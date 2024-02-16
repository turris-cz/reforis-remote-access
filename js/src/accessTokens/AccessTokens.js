/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useState } from "react";

import { useAPIGet, withErrorMessage, withSpinnerOnSending } from "foris";
import PropTypes from "prop-types";

import API_URLs from "API";

import CreateTokenForm from "./CreateTokenForm";
import Tokens from "./Tokens";

AccessTokens.propTypes = {
    ws: PropTypes.object.isRequired,
};

export default function AccessTokens({ ws }) {
    const [authority, getAuthority] = useAPIGet(API_URLs.authority);
    useEffect(() => {
        getAuthority();
    }, [getAuthority]);

    return (
        <>
            <h1>{_("Access Tokens")}</h1>
            <TokensWrapperWithErrorAndSpinner
                apiState={authority.state}
                ws={ws}
                authority={authority.data}
            />
        </>
    );
}

const TokensWrapperWithErrorAndSpinner = withErrorMessage(
    withSpinnerOnSending(TokensWrapper)
);

TokensWrapper.propTypes = {
    ws: PropTypes.object.isRequired,
    authority: PropTypes.object.isRequired,
};

function TokensWrapper({ ws, authority }) {
    const [generating, setGenerating] = useState(false);

    if (authority.status !== "ready") {
        return (
            <p>
                {_(
                    "You need to generate certificate authority to create tokens."
                )}
            </p>
        );
    }

    return (
        <>
            <p>
                {_(
                    `You need to generate a token file for each client you want to grant access to.`
                )}
            </p>
            <p>
                {_(
                    `To use the token with another Turris router you need to transfer it using the "Remote Devices" plugin on the client device.`
                )}
            </p>
            <CreateTokenForm
                generating={generating}
                setGenerating={setGenerating}
            />
            <Tokens ws={ws} setGenerating={setGenerating} />
        </>
    );
}
