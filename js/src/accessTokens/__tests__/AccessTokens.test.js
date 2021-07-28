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
    getByLabelText,
    getByRole,
    queryByRole,
    fireEvent,
} from "foris/testUtils/customTestRender";
import { mockJSONError } from "foris/testUtils/network";
import { WebSockets } from "foris";
import mockAxios from "jest-mock-axios";

import AccessTokens from "../AccessTokens";

describe("<AccessTokens />", () => {
    let webSockets;
    let container;

    function getAddButton() {
        return getByText(container, "Add");
    }

    function submitTokenForm(name) {
        const tokenNameInput = getByLabelText(container, "Token name");
        fireEvent.change(tokenNameInput, { target: { value: name } });
        const addButton = getAddButton();
        fireEvent.click(addButton);
    }

    beforeEach(() => {
        webSockets = new WebSockets();
        ({ container } = render(<AccessTokens ws={webSockets} />));
    });

    it("should render spinner", () => {
        expect(container).toMatchSnapshot();
    });

    it("should render error", async () => {
        expect(mockAxios.get).toBeCalledWith(
            "/reforis/remote-access/api/authority",
            expect.anything()
        );
        mockJSONError();
        await wait(() => expect(container).toMatchSnapshot());
    });

    it("should handle invalid CA", async () => {
        mockAxios.mockResponse({ data: { status: "whatever" } });
        await wait(() =>
            getByText(
                container,
                "You need to generate certificate authority in order to create tokens."
            )
        );
    });

    it("should handle proper CA", async () => {
        mockAxios.mockResponse({ data: { status: "ready" } });
        await wait(() => expect(container).toMatchSnapshot());
    });

    it("should add new token to the table", async () => {
        // Response to GET authority
        mockAxios.mockResponse({ data: { status: "ready" } });
        await wait(() => getByText(container, "Create new token"));
        // Response to GET tokens
        mockAxios.mockResponse({ data: [] });
        await wait(() =>
            getByText(container, "There are no tokens added yet.")
        );

        const name = "another_turris";
        submitTokenForm(name);
        expect(getAddButton().disabled).toBe(true);
        // Handle request
        expect(mockAxios.post).toBeCalledWith(
            "/reforis/remote-access/api/tokens",
            { name },
            expect.anything()
        );
        mockAxios.mockResponse({ data: { task_id: "1234" } });
        await wait(() => getByText(container, "Create new token"));

        // Generating new token
        act(() =>
            webSockets.dispatch({
                module: "remote",
                action: "generate_token",
                data: { status: "token_generating" },
            })
        );
        // Third GET request is the second one for "tokens" endpoint
        expect(mockAxios.get).toHaveBeenNthCalledWith(
            3,
            "/reforis/remote-access/api/tokens",
            expect.anything()
        );
        mockAxios.mockResponse({
            data: [{ id: "T1", name, status: "generating" }],
        });
        // New token appears (with spinner)
        await wait(() => expect(getByText(container, name)).toBeDefined());
        expect(getByRole(container, "status")).toBeTruthy();

        // Token is ready
        act(() =>
            webSockets.dispatch({
                module: "remote",
                action: "generate_token",
                data: { status: "succeeded" },
            })
        );
        expect(mockAxios.get).toHaveBeenNthCalledWith(
            4,
            "/reforis/remote-access/api/tokens",
            expect.anything()
        );
        mockAxios.mockResponse({
            data: [{ id: "T1", name, status: "succeeded" }],
        });
        // Table is refreshed
        await wait(() => expect(getByText(container, name)).toBeDefined());
        // Spinner is gone
        expect(queryByRole(container, "status")).toBeFalsy();
        // Download is available
        expect(getByText(container, "Download")).toBeTruthy();
        // Add button is enabled again
        expect(getAddButton().disabled).toBe(false);
    });
});
