/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import RemoteAccess from "./remoteAccess/RemoteAccess";

const SubordinatesPlugin = {
    name: _("Remote Access"),
    path: "/remote-access",
    component: RemoteAccess,
    icon: "tty",
};

ForisPlugins.push(SubordinatesPlugin);
