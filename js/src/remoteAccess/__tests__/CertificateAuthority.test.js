/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import mockAxios from 'jest-mock-axios';
import { WebSockets, API_STATE } from "foris";
import { render, getByText, wait, fireEvent } from "foris/testUtils/customTestRender";
import { mockSetAlert } from "foris/testUtils/alertContextMock";
import { mockJSONError } from "foris/testUtils/network";

import CertificateAuthority, { CA_STATUS } from "../CertificateAuthority";

describe("<CertificateAuthority />", () => {
    const webSockets = new WebSockets();
    const onSucces = jest.fn();

    function renderComponent(apiState, authority = {}) {
        return render(
            <CertificateAuthority
                apiState={apiState}
                ws={webSockets}
                authority={authority}
                onSuccess={onSucces}
            />
        );
    }

    describe("authority is ready", () => {
        let container;

        beforeEach(() => {
            ({ container } = renderComponent(
                API_STATE.SUCCESS,
                { status: CA_STATUS.READY },
            ));
        });

        it("should render component", () => {
            expect(container).toMatchSnapshot();
        });

        it("should send request when button is clicked", () => {
            fireEvent.click(getByText(container, "Delete CA"));
            expect(mockAxios.delete).toBeCalledWith("/reforis/subordinates/api/authority", expect.anything());
        });

        it("should handle error", async () => {
            fireEvent.click(getByText(container, "Delete CA"));
            mockJSONError();
            await wait(() => {
                expect(mockSetAlert).toHaveBeenCalledWith("Cannot delete certificate authority");
            });
        });

        it("should handle success", async () => {
            fireEvent.click(getByText(container, "Delete CA"));
            mockAxios.mockResponse({});
            await wait(() => {
                expect(onSucces).toHaveBeenCalledTimes(1);
            });
        });
    });

    it("should render missing component", () => {
        const { container } = renderComponent(
            API_STATE.SUCCESS,
            { status: CA_STATUS.MISSING },
        );
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
});
