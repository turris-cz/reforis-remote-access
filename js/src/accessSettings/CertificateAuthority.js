/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import {
    Button,
    useAlert,
    useAPIDelete,
    API_STATE,
    formFieldsSize,
} from "foris";

import API_URLs from "API";

export const CA_STATUS = {
    MISSING: "missing",
    READY: "ready",
    GENERATING: "generating",
};

CertificateAuthority.propTypes = {
    authority: PropTypes.object.isRequired,
    accessEnabled: PropTypes.bool.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default function CertificateAuthority({
    authority,
    accessEnabled,
    onSuccess,
}) {
    const [setAlert] = useAlert();

    const [deleteResponse, deleteCA] = useAPIDelete(API_URLs.authority);
    useEffect(() => {
        if (deleteResponse.state === API_STATE.SUCCESS) {
            onSuccess();
        } else if (deleteResponse.state === API_STATE.ERROR) {
            setAlert(_("Cannot delete certificate authority."));
        }
    }, [deleteResponse, onSuccess, setAlert]);

    if (authority.status !== CA_STATUS.READY) {
        return null;
    }

    return (
        <div className={formFieldsSize}>
            <h2>{_("Certificate Authority")}</h2>
            {accessEnabled ? (
                <p>
                    {_(
                        "You can't delete certificate authority while remote access is enabled. To delete it, you need to disable the access first."
                    )}
                </p>
            ) : (
                <>
                    <p>
                        {_(
                            "Your certificate authority is set up properly. Please note that if you delete it, all clients will have their access revoked."
                        )}
                    </p>
                    <div className="text-right">
                        <Button
                            onClick={() => deleteCA()}
                            loading={deleteResponse.state === API_STATE.SENDING}
                            forisFormSize
                        >
                            {_("Delete Certificate Authority")}
                        </Button>
                    </div>
                </>
            )}
        </div>
    );
}
