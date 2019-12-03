/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import AccessSettings from "./accessSettings/AccessSettings";
import AccessTokens from "./accessTokens/AccessTokens";

const RemoteAccessPlugin = {
    submenuId: "remote-access",
    name: _("Remote Access"),
    icon: "satellite-dish",
    path: "/remote-access",
    pages: [
        {
            name: "Access Settings",
            path: "/settings",
            component: AccessSettings,
        },
        {
            name: "Access Tokens",
            path: "/tokens",
            component: AccessTokens,
        },
    ],
};

ForisPlugins.push(RemoteAccessPlugin);
