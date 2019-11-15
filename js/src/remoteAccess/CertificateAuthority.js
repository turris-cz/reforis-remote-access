/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import {
    Button, withErrorMessage, withSpinnerOnSending, withEither, useAlert, useAPIDelete, API_STATE,
} from "foris";

import API_URLs from "API";
import AuthorityMissing from "./AuthorityMissing";
import AuthorityGenerating from "./AuthorityGenerating";

export const CA_STATUS = {
    MISSING: "missing",
    READY: "ready",
    GENERATING: "generating",
};

CertificateAuthority.propTypes = {
    authority: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

function CertificateAuthority({ authority, onSuccess }) {
    const [setAlert] = useAlert();

    const [deleteResponse, deleteCA] = useAPIDelete(API_URLs.authority);
    useEffect(() => {
        if (deleteResponse.state === API_STATE.SUCCESS) {
            onSuccess();
        } else if (deleteResponse.state === API_STATE.ERROR) {
            setAlert(_("Cannot delete certificate authority"));
        }
    }, [deleteResponse, onSuccess, setAlert]);

    if (authority.status !== CA_STATUS.READY) {
        return null;
    }

    return (
        <>
            <h3>{_("Certificate Authority")}</h3>
            <p>{_("Your certificate authority (CA) is set up properly. Please note that if you delete it all clients will have their access revoked.")}</p>
            <Button onClick={() => deleteCA()} forisFormSize>{_("Delete CA")}</Button>
        </>
    );
}

const withMissing = withEither(
    (props) => props.authority.status === CA_STATUS.MISSING,
    AuthorityMissing,
);

const withGenerating = withEither(
    (props) => props.authority.status === CA_STATUS.GENERATING,
    AuthorityGenerating,
);

export default (
    withErrorMessage(
        withSpinnerOnSending(
            withMissing(
                withGenerating(CertificateAuthority),
            ),
        ),
    ));
