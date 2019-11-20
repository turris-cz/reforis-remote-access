/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { render, getByText, fireEvent, wait } from "foris/testUtils/customTestRender";
import { mockSetAlert } from "foris/testUtils/alertContextMock";
import { mockJSONError } from "foris/testUtils/network";
import mockAxios from 'jest-mock-axios';

import AuthorityMissing from "../AuthorityMissing";

describe("<AuthorityMissing />", () => {
    let componentContainer;
    const onSuccess = jest.fn();

    function generateCA() {
        fireEvent.click(getByText(componentContainer, "Generate certificate authority"));
    }

    beforeEach(() => {
        const { container } = render(<AuthorityMissing onAuthoritySuccess={onSuccess} />);
        componentContainer = container;
    });

    it("should match snapshot", () => {
        expect(componentContainer).toMatchSnapshot();
    });

    it("should send request when button is clicked", () => {
        generateCA();
        expect(mockAxios.post).toBeCalledWith("/reforis/subordinates/api/authority", undefined, expect.anything());
    });

    it("should display spinner when sending request", () => {
        generateCA();
        expect(componentContainer).toMatchSnapshot();
    });

    it("should handle error", async () => {
        generateCA();
        mockJSONError();
        await wait(() => {
            expect(mockSetAlert).toHaveBeenCalledWith("Cannot generate certificate authority");
        });
    });

    it("should handle success", async () => {
        generateCA();
        mockAxios.mockResponse({});
        await wait(() => {
            expect(onSuccess).toHaveBeenCalledTimes(1);
        });
    });
});
