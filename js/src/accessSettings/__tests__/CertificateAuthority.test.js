/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import mockAxios from "jest-mock-axios";
import { WebSockets } from "foris";
import {
    render,
    getByText,
    wait,
    fireEvent,
} from "foris/testUtils/customTestRender";
import { mockSetAlert } from "foris/testUtils/alertContextMock";
import { mockJSONError } from "foris/testUtils/network";

import CertificateAuthority, { CA_STATUS } from "../CertificateAuthority";

describe("<CertificateAuthority />", () => {
    const webSockets = new WebSockets();
    const onSucces = jest.fn();
    let container;

    function renderComponent(authority = {}, accessEnabled = false) {
        return render(
            <CertificateAuthority
                ws={webSockets}
                authority={authority}
                accessEnabled={accessEnabled}
                onSuccess={onSucces}
            />
        );
    }

    function deleteCA() {
        fireEvent.click(getByText(container, "Delete Certificate Authority"));
    }

    describe("when remote access is disabled", () => {
        it("should render component", () => {
            ({ container } = renderComponent(
                { status: CA_STATUS.READY },
                true
            ));
            expect(container).toMatchSnapshot();
        });
    });

    describe("when remote access is enabled", () => {
        beforeEach(() => {
            ({ container } = renderComponent({ status: CA_STATUS.READY }));
        });

        it("should render component", () => {
            expect(container).toMatchSnapshot();
        });

        it("should send request when button is clicked", () => {
            deleteCA();
            expect(mockAxios.delete).toBeCalledWith(
                "/reforis/remote-access/api/authority",
                expect.anything()
            );
        });

        it("should handle error", async () => {
            deleteCA();
            mockJSONError();
            await wait(() => {
                expect(mockSetAlert).toHaveBeenCalledWith(
                    "Cannot delete certificate authority."
                );
            });
        });

        it("should handle success", async () => {
            deleteCA();
            mockAxios.mockResponse({});
            await wait(() => {
                expect(onSucces).toHaveBeenCalledTimes(1);
            });
        });
    });
});
