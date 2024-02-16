/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";

import mockAxios from "jest-mock-axios";
import {
    render,
    fireEvent,
    getByLabelText,
    getByText,
    queryByText,
    wait,
    getByTestId,
} from "foris/testUtils/customTestRender";
import { mockSetAlert } from "foris/testUtils/alertContextMock";
import { mockJSONError } from "foris/testUtils/network";

import RemoteAccessForm from "../RemoteAccessForm";

describe("<RemoteAccessForm />", () => {
    let container;
    const onSuccess = jest.fn();
    const settings = { enabled: true, wan_enabled: true, port: 1808 };
    const settingsDisabled = { enabled: false, wan_enabled: false, port: 1194 };

    function renderForm(settings) {
        return render(
            <RemoteAccessForm settings={settings} onSuccess={onSuccess} />
        );
    }

    function getSaveButton() {
        return getByTestId(container, "save-settings-button");
    }

    function saveForm() {
        fireEvent.click(getSaveButton());
    }

    function enableRemoteAccess() {
        fireEvent.click(getByLabelText(container, "Enable Remote Access"));
    }

    function setPort(port) {
        fireEvent.change(getByLabelText(container, "Port"), {
            target: { value: port },
        });
    }

    it("should render only checkbox when access is disabled", () => {
        ({ container } = renderForm(settingsDisabled));
        expect(container).toMatchSnapshot();
    });

    it("should render full form when access is enabled", () => {
        ({ container } = renderForm(settings));
        expect(container).toMatchSnapshot();
    });

    it("should expose the rest of the form when enabled", () => {
        ({ container } = renderForm(settingsDisabled));
        enableRemoteAccess();
        expect(container).toMatchSnapshot();
    });

    it("should validate port", () => {
        ({ container } = renderForm(settings));

        // Invalid ports
        for (const port of [-1, 9999999999999999, 80]) {
            setPort(port);
            expect(getSaveButton().disabled).toBeTruthy();
            expect(
                getByText(
                    container,
                    "Should be a number in range of 1024-65536"
                )
            ).toBeTruthy();
        }

        // Valid port
        setPort(9090);
        expect(getSaveButton().disabled).toBeFalsy();
        expect(
            queryByText(container, "Should be a number in range of 1024-65536")
        ).toBeNull();
    });

    it("should handle success", async () => {
        ({ container } = renderForm(settingsDisabled));

        // Fill out and submit the form
        enableRemoteAccess();
        const newPort = 9090;
        setPort(newPort);
        saveForm();

        expect(mockAxios.put).toBeCalledWith(
            "/reforis/remote-access/api/settings",
            { ...settingsDisabled, enabled: true, port: newPort },
            expect.anything()
        );

        mockAxios.mockResponse();
        await wait(() => expect(onSuccess).toBeCalled());
    });

    it("should turn off remote access", async () => {
        ({ container } = renderForm(settings));
        // Fill out and submit the form
        enableRemoteAccess();
        saveForm();
        expect(mockAxios.put).toBeCalledWith(
            "/reforis/remote-access/api/settings",
            { enabled: false },
            expect.anything()
        );
    });

    it("should set alert on API error", async () => {
        ({ container } = renderForm(settings));
        saveForm();
        mockJSONError();
        await wait(() =>
            expect(mockSetAlert).toBeCalledWith(
                "Cannot save connection parameters."
            )
        );
    });

    it("should display a spinner and disable save button while sending request", async () => {
        ({ container } = renderForm(settings));
        saveForm();
        expect(getSaveButton().disabled).toBeTruthy();
        expect(container).toMatchSnapshot();
    });
});
