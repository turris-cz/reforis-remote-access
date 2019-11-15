/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import { useWSForisModule, Spinner } from "foris";

AuthorityGenerating.propTypes = {
    ws: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export const SUCCESS_STATUS = "succeeded";

export default function AuthorityGenerating({ ws, onSuccess }) {
    const [generateCA] = useWSForisModule(ws, "remote", "generate_ca");
    useEffect(() => {
        if (generateCA && generateCA.status === SUCCESS_STATUS) {
            onSuccess();
        }
    }, [generateCA, onSuccess]);

    return (
        <>
            <h3>{_("Generating certification authority")}</h3>
            <Spinner />
            <p>{_("Your certification authority is now being generated. It usually takes a few minutes. Settings will appear here automatically once the authority is ready.")}</p>
        </>
    );
}
