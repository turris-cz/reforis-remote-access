/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React from "react";
import PropTypes from "prop-types";

import { withErrorMessage, withSpinnerOnSending, withEither } from "foris";

import AuthorityMissing from "./AuthorityMissing";
import AuthorityGenerating from "./AuthorityGenerating";
import CertificateAuthority, { CA_STATUS } from "./CertificateAuthority";
import RemoteAccessForm from "./RemoteAccessForm";

Settings.propTypes = {
    authority: PropTypes.object.isRequired,
    settings: PropTypes.object.isRequired,
    onAuthoritySuccess: PropTypes.func.isRequired,
    onSettingsSuccess: PropTypes.func.isRequired,
};

function Settings({
    authority, settings, onAuthoritySuccess, onSettingsSuccess,
}) {
    return (
        <>
            <RemoteAccessForm
                settings={settings}
                onSuccess={onSettingsSuccess}
            />
            <CertificateAuthority
                authority={authority}
                accessEnabled={settings.enabled}
                onSuccess={onAuthoritySuccess}
            />
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
                withGenerating(Settings),
            ),
        ),
    ));
