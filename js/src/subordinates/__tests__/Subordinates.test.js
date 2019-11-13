/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { render } from "foris/testUtils/customTestRender";

import Subordinates from "../Subordinates";

describe("<Subordinates />", () => {
    it("should render component", () => {
        const { container, getByText } = render(<Subordinates />);
        expect(getByText("Subordinates")).toBeDefined();
    });
});
