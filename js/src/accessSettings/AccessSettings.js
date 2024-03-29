/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import { useAPIGet } from "foris";
import PropTypes from "prop-types";

import API_URLs from "API";

import Settings from "./Settings";

AccessSettings.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function AccessSettings({ ws }) {
    const [getAuthorityResponse, getAuthority] = useAPIGet(API_URLs.authority);
    useEffect(() => {
        getAuthority();
    }, [getAuthority]);

    const [getSettingsResponse, getSettings] = useAPIGet(API_URLs.settings);
    useEffect(() => {
        getSettings();
    }, [getSettings]);

    return (
        <>
            <h1>{_("Access Settings")}</h1>
            <p>
                {_(
                    "Here you can set up your router to be configured remotely. The remote configuration is done via a secure encrypted connection, and each client is required to have a token issued by this device."
                )}
            </p>
            <p>
                {_(
                    "It can be useful when you plan to access the configuration interface from another Turris router, or you intend to write your client."
                )}
            </p>
            <Settings
                apiState={[
                    getAuthorityResponse.state,
                    getSettingsResponse.state,
                ]}
                ws={ws}
                authority={getAuthorityResponse.data}
                settings={getSettingsResponse.data}
                onAuthoritySuccess={getAuthority}
                onSettingsSuccess={getSettings}
            />
        </>
    );
}
