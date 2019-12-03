/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

const API_URL_PREFIX = "/reforis/remote-access/api";

const API_URLs = new Proxy(
    {
        authority: "/authority",
        settings: "/settings",
        tokens: "/tokens",
    },
    {
        get: (target, name) => `${API_URL_PREFIX}${target[name]}`,
    },
);

export default API_URLs;
