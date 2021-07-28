/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { Button, useAlert, useAPIPost, API_STATE } from "foris";

import API_URLs from "API";

AuthorityMissing.propTypes = {
    onAuthoritySuccess: PropTypes.func.isRequired,
};

export default function AuthorityMissing({ onAuthoritySuccess }) {
    const [setAlert] = useAlert();

    const [generateResponse, generateCA] = useAPIPost(API_URLs.authority);
    useEffect(() => {
        if (generateResponse.state === API_STATE.SUCCESS) {
            onAuthoritySuccess();
        } else if (generateResponse.state === API_STATE.ERROR) {
            setAlert(_("Cannot generate certificate authority."));
        }
    }, [generateResponse, onAuthoritySuccess, setAlert]);

    return (
        <>
            <h3>{_("No certificate authority")}</h3>
            <p>
                {_(
                    "Currently there is no certificate authority (CA) dedicated to remote access. A CA is required to generate access tokens to authenticate. To proceed you need to generate it first."
                )}
            </p>
            <Button
                onClick={() => generateCA()}
                loading={generateResponse.state === API_STATE.SENDING}
                forisFormSize
            >
                {_("Generate certificate authority")}
            </Button>
        </>
    );
}
