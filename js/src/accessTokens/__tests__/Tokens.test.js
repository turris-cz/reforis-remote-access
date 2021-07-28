/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import {
    render,
    wait,
    act,
    getByText,
    getAllByText,
} from "foris/testUtils/customTestRender";
import { mockJSONError } from "foris/testUtils/network";
import { WebSockets } from "foris";
import mockAxios from "jest-mock-axios";

import { tokensFixture } from "./__fixtures__/tokens";
import Tokens from "../Tokens";

describe("<Tokens />", () => {
    let webSockets;
    const setGenerating = jest.fn();
    let container;

    beforeEach(() => {
        webSockets = new WebSockets();
        ({ container } = render(
            <Tokens ws={webSockets} setGenerating={setGenerating} />
        ));
    });

    it("should render spinner", () => {
        expect(container).toMatchSnapshot();
    });

    it("should render error", async () => {
        expect(mockAxios.get).toBeCalledWith(
            "/reforis/remote-access/api/tokens",
            expect.anything()
        );
        mockJSONError();
        await wait(() => expect(container).toMatchSnapshot());
    });

    it("should render tokens", async () => {
        mockAxios.mockResponse({ data: tokensFixture });
        await wait(() => expect(container).toMatchSnapshot());
    });

    it("should refresh table after token is revoked", async () => {
        const getRevokedNumber = () =>
            getAllByText(container, "Access revoked").length;

        mockAxios.mockResponse({ data: tokensFixture });
        await wait(() => expect(getByText(container, "foo")).toBeTruthy());

        const revoked = getRevokedNumber();
        // Client is revoked
        act(() =>
            webSockets.dispatch({
                module: "remote",
                action: "revoke",
                data: { id: tokensFixture[0].id },
            })
        );
        expect(getRevokedNumber()).toBe(revoked + 1);
    });

    it("should refresh table after token is created", async () => {
        expect(mockAxios.get).toHaveBeenCalledTimes(1);
        mockAxios.mockResponse({ data: tokensFixture });
        await wait(() => expect(getByText(container, "foo")).toBeTruthy());

        const generatingMessage = {
            module: "remote",
            action: "generate_token",
            data: { status: "token_generating" },
        };
        act(() => webSockets.dispatch(generatingMessage));
        expect(mockAxios.get).toHaveBeenCalledTimes(2);

        const succeededMessage = {
            module: "remote",
            action: "generate_token",
            data: { status: "succeeded" },
        };
        act(() => webSockets.dispatch(succeededMessage));
        expect(mockAxios.get).toHaveBeenCalledTimes(3);

        expect(setGenerating).toBeCalledWith(false);
    });
});
