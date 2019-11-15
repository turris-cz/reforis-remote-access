/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import { render, act } from "foris/testUtils/customTestRender";

import { WebSockets } from "foris";

import AuthorityGenerating, { SUCCESS_STATUS } from "../AuthorityGenerating";

describe("<AuthorityGenerating />", () => {
    const onSuccess = jest.fn();
    let webSockets,
        componentContainer;

    beforeEach(() => {
        webSockets = new WebSockets();
        const { container } = render(<AuthorityGenerating ws={webSockets} onSuccess={onSuccess} />);
        componentContainer = container;
    });

    it("should match snapshot", () => {
        expect(componentContainer).toMatchSnapshot();
    });

    it("should call onSuccess when CA is ready", () => {
        expect(onSuccess).not.toBeCalled();
        const wsMessage = { module: "remote", action: "generate_ca", data: {status: SUCCESS_STATUS} };
        act(() => webSockets.dispatch(wsMessage));
        expect(onSuccess).toHaveBeenCalledTimes(1);
    });
});
