/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect, useState } from "react";

import { useAPIGet, API_STATE, formFieldsSize } from "foris";
import PropTypes from "prop-types";

import API_URLs from "API";

import { useRevokeToken, useGenerateToken } from "./hooks";
import TokensTable from "./TokensTable";

Tokens.propTypes = {
    ws: PropTypes.object.isRequired,
    setGenerating: PropTypes.func.isRequired,
};

export default function Tokens({ ws, setGenerating }) {
    const [getTokensResponse, getTokens] = useAPIGet(API_URLs.tokens);
    useEffect(() => {
        getTokens();
    }, [getTokens]);

    const [tokens, setTokens] = useState([]);
    // Update list of tokens when GET request is successful
    useEffect(() => {
        if (getTokensResponse.state === API_STATE.SUCCESS) {
            setTokens(getTokensResponse.data);
        }
    }, [getTokensResponse]);

    // Refresh list of tokens when one is being generated
    useGenerateToken(ws, getTokens, setGenerating);

    // Refresh list of clients after certificate is revoked
    useRevokeToken(ws, setTokens);

    return (
        <div className={formFieldsSize}>
            <h2>{_("Tokens")}</h2>
            <TokensTable apiState={getTokensResponse.state} tokens={tokens} />
        </div>
    );
}
