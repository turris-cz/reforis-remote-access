/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { useWSForisModule, Spinner } from "foris";

AuthorityGenerating.propTypes = {
    ws: PropTypes.object.isRequired,
    onAuthoritySuccess: PropTypes.func.isRequired,
};

export const SUCCESS_STATUS = "succeeded";

export default function AuthorityGenerating({ ws, onAuthoritySuccess }) {
    const [generateCA] = useWSForisModule(ws, "remote", "generate_ca");
    useEffect(() => {
        if (generateCA && generateCA.status === SUCCESS_STATUS) {
            onAuthoritySuccess();
        }
    }, [generateCA, onAuthoritySuccess]);

    return (
        <>
            <h2>{_("Generating Certificate Authority")}</h2>
            <Spinner />
            <p>
                {_(`Your certificate authority is now being generated. It \
usually takes a few minutes. Settings will appear here automatically once the \
authority is ready.`)}
            </p>
        </>
    );
}
