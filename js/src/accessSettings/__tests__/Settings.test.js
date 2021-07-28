/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { WebSockets, API_STATE } from "foris";
import { render } from "foris/testUtils/customTestRender";

import Settings from "../Settings";
import { CA_STATUS } from "../CertificateAuthority";

describe("<Settings />", () => {
    const webSockets = new WebSockets();
    const onAuthoritySuccess = jest.fn();
    const onSettingsSuccess = jest.fn();

    function renderComponent(apiState, authority = {}, settings = {}) {
        return render(
            <Settings
                apiState={apiState}
                ws={webSockets}
                authority={authority}
                settings={settings}
                onAuthoritySuccess={onAuthoritySuccess}
                onSettingsSuccess={onSettingsSuccess}
            />
        );
    }

    it("should render missing component", () => {
        const { container } = renderComponent(API_STATE.SUCCESS, {
            status: CA_STATUS.MISSING,
        });
        expect(container).toMatchSnapshot();
    });

    it("should render generating component", () => {
        const { container } = renderComponent(API_STATE.SUCCESS, {
            status: CA_STATUS.GENERATING,
        });
        expect(container).toMatchSnapshot();
    });

    it("should render spinner", () => {
        const { container } = renderComponent(API_STATE.SENDING);
        expect(container).toMatchSnapshot();
    });

    it("should render error", () => {
        const { container } = renderComponent(API_STATE.ERROR);
        expect(container).toMatchSnapshot();
    });

    it("should render settings component", () => {
        const { container } = renderComponent(
            API_STATE.SUCCESS,
            { status: CA_STATUS.READY },
            { enabled: true, wan_enabled: false, port: 1234 }
        );
        expect(container).toMatchSnapshot();
    });
});
