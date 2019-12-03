/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { render, getByText, getByLabelText, fireEvent, wait } from "foris/testUtils/customTestRender";
import { mockSetAlert } from "foris/testUtils/alertContextMock";
import { mockJSONError } from "foris/testUtils/network";
import mockAxios from "jest-mock-axios";

import CreateTokenForm from "../CreateTokenForm";

function getFormElements(container) {
    return {
        nameInput: getByLabelText(container, "Token name"),
        submitButton: getByText(container, "Add"),
    };
}

describe("<CreateTokenForm />", () => {
    let container;
    const setGenerating = jest.fn();

    beforeEach(() => {
        ({ container } = render(<CreateTokenForm generating={false} setGenerating={setGenerating} />));
    });

    it("should be rendered", () => {
        expect(container).toMatchSnapshot();
    });

    it("should check if name is empty", () => {
        const { nameInput, submitButton } = getFormElements(container);
        fireEvent.change(nameInput, { target: { value: "" } });
        expect(getByText(container, "Name cannot be empty")).toBeDefined();
        expect(submitButton.disabled).toBe(true);
    });

    it("should check if name has proper length", () => {
        const { nameInput, submitButton } = getFormElements(container);
        fireEvent.change(nameInput, { target: { value: "q".repeat(65) } });
        expect(getByText(container, "Name is too long")).toBeDefined();
        expect(submitButton.disabled).toBe(true);
    });

    it("should check if name contains invalid characters", () => {
        const { nameInput, submitButton } = getFormElements(container);
        fireEvent.change(nameInput, { target: { value: "!@#$%" } });
        expect(getByText(container, "Name contains invalid characters")).toBeDefined();
        expect(submitButton.disabled).toBe(true);
    });

    it("should add client", () => {
        const { nameInput, submitButton } = getFormElements(container);

        expect(submitButton.disabled).toBe(true);
        fireEvent.change(nameInput, { target: { value: "propername" } });
        expect(nameInput.value).toBe("propername");
        expect(submitButton.disabled).toBe(false);

        fireEvent.click(submitButton);
        expect(setGenerating).toBeCalledWith(true);
        expect(mockAxios.post).toBeCalledWith(
            "/reforis/remote-access/api/tokens",
            { name: "propername" },
            expect.anything(),
        );
    });

    it("should handle API error", async () => {
        const { nameInput, submitButton } = getFormElements(container);

        fireEvent.change(nameInput, { target: { value: "propername" } });
        fireEvent.click(submitButton);

        const errorMessage = "API didn't handle this well";
        mockJSONError(errorMessage);
        await wait(() => {
            expect(mockSetAlert).toHaveBeenCalledWith(errorMessage);
        });
        expect(setGenerating).toBeCalledWith(false);
    });
});
