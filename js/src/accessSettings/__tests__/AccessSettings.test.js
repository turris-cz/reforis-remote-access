/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { render, wait } from "foris/testUtils/customTestRender";
import { WebSockets } from "foris";
import { mockJSONError } from "foris/testUtils/network";
import mockAxios from 'jest-mock-axios';

import AccessSettings from "../AccessSettings";
import { CA_STATUS } from "../CertificateAuthority";

describe("<AccessSettings />", () => {
    const webSockets = new WebSockets();
    let container;

    beforeEach(() => {
        ({ container } = render(<AccessSettings ws={webSockets} />));
    });

    it("should render spinner", () => {
        expect(container).toMatchSnapshot();
    });

    it("should render error", async () => {
        expect(mockAxios.get).toBeCalledWith("/reforis/remote-access/api/authority", expect.anything());
        expect(mockAxios.get).toBeCalledWith("/reforis/remote-access/api/settings", expect.anything());
        mockJSONError();
        await wait(() => expect(container).toMatchSnapshot());
    });

    it("should handle missing certificate", async () => {
        // Response to GET authority
        mockAxios.mockResponse({ data: { status: CA_STATUS.MISSING }});
        // Response to GET settings
        mockAxios.mockResponse({ data: { enabled: false }});
        await wait(() => expect(container).toMatchSnapshot());
    });

    it("should handle generating certificate", async () => {
        // Response to GET authority
        mockAxios.mockResponse({ data: { status: CA_STATUS.GENERATING }});
        // Response to GET settings
        mockAxios.mockResponse({ data: { enabled: false }});
        await wait(() => expect(container).toMatchSnapshot());
    });

    it("should handle ready certificate", async () => {
        // Response to GET authority
        mockAxios.mockResponse({ data: { status: CA_STATUS.READY }});
        // Response to GET settings
        mockAxios.mockResponse({ data: { enabled: false }});
        await wait(() => expect(container).toMatchSnapshot());
    });
});
