/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { Button, useAlert, useAPIPost, API_STATE, formFieldsSize } from "foris";

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
        <div className={formFieldsSize}>
            <h2>{_("No Certificate Authority")}</h2>
            <p>
                {_(`Currently, there is no certificate authority (CA) \
dedicated to remote access. A CA is required to generate access tokens to \
authenticate. To proceed, you need to generate it first.`)}
            </p>
            <div className="text-right">
                <Button
                    onClick={() => generateCA()}
                    loading={generateResponse.state === API_STATE.SENDING}
                    forisFormSize
                >
                    {_("Generate Certificate Authority")}
                </Button>
            </div>
        </div>
    );
}
