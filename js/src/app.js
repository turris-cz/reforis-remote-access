/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import Subordinates from "./subordinates/Subordinates";

const SubordinatesPlugin = {
    name: _("Subordinates"),
    submenuId: "administration",
    weight: 100,
    path: "/subordinates",
    component: Subordinates,
};

ForisPlugins.push(SubordinatesPlugin);
