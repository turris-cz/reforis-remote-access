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

import RemoteAccess from "../RemoteAccess";
import { CA_STATUS } from "../CertificateAuthority";

describe("<RemoteAccess />", () => {
    const webSockets = new WebSockets();
    let container;

    beforeEach(() => {
        ({ container } = render(<RemoteAccess ws={webSockets} />));
    });

    it("should render spinner", () => {
        expect(container).toMatchSnapshot();
    });

    it("should render error", async () => {
        expect(mockAxios.get).toBeCalledWith("/reforis/subordinates/api/authority", expect.anything());
        mockJSONError();
        await wait(() => expect(container).toMatchSnapshot());
    });

    it("should handle missing certificate", async () => {
        mockAxios.mockResponse({ data: { status: CA_STATUS.MISSING }});
        await wait(() => expect(container).toMatchSnapshot());
    });

    it("should handle generating certificate", async () => {
        mockAxios.mockResponse({ data: { status: CA_STATUS.GENERATING }});
        await wait(() => expect(container).toMatchSnapshot());
    });

    it("should handle ready certificate", async () => {
        mockAxios.mockResponse({ data: { status: CA_STATUS.READY }});
        await wait(() => expect(container).toMatchSnapshot());
    });
});
