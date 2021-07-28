/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import {
    render,
    getByText,
    fireEvent,
    wait,
} from "foris/testUtils/customTestRender";
import { mockSetAlert } from "foris/testUtils/alertContextMock";
import { mockJSONError } from "foris/testUtils/network";
import mockAxios from "jest-mock-axios";

import { tokensFixture } from "./__fixtures__/tokens";
import TokensTable from "../TokensTable";

describe("<TokensTable />", () => {
    function renderTable(tokens) {
        return render(<TokensTable tokens={tokens} />);
    }

    function revokeToken(container) {
        fireEvent.click(getByText(container, "Revoke"));
    }

    it("should be rendered - empty table", () => {
        const { container } = renderTable([]);
        expect(container).toMatchSnapshot();
    });

    it("should be rendered - filled table", () => {
        const { container } = renderTable(tokensFixture);
        expect(container).toMatchSnapshot();
    });

    it("should display spinner while sending delete request", () => {
        const { container } = renderTable(tokensFixture);
        revokeToken(container);
        expect(mockAxios.delete).toBeCalledWith(
            "/reforis/remote-access/api/tokens/1",
            expect.anything()
        );
        expect(container).toMatchSnapshot();
    });

    it("should set alert on revoke error", async () => {
        const { container } = renderTable(tokensFixture);
        revokeToken(container);
        const errorMessage = "API didn't handle this well";
        mockJSONError(errorMessage);
        await wait(() => {
            expect(mockSetAlert).toHaveBeenCalledWith(errorMessage);
        });
    });
});
