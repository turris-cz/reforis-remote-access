/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { useAPIGet } from "foris";

import API_URLs from "API";
import CertificateAuthority from "./CertificateAuthority";

RemoteAccess.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function RemoteAccess({ ws }) {
    const [getAuthorityResponse, getAuthority] = useAPIGet(API_URLs.authority);
    useEffect(() => {
        getAuthority();
    }, [getAuthority]);

    return (
        <>
            <h1>{_("Remote Access")}</h1>
            <p>{_("Here you can set up your router to be configured remotely. The remote configuration is done via secure encrypted connection and each client is required to have a token issued by this device.")}</p>
            <p>{_("This can be useful when you plan to access configuration interface via mobile app, another Turris router or you intend to write your own client.")}</p>
            <CertificateAuthority
                apiState={getAuthorityResponse.state}
                ws={ws}
                authority={getAuthorityResponse.data}
                onSuccess={getAuthority}
            />
        </>
    );
}
