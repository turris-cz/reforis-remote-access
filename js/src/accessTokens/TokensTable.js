/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import {
    withErrorMessage,
    withSpinnerOnSending,
    Button,
    DownloadButton,
    useAlert,
    useAPIDelete,
    API_STATE,
    SpinnerElement,
} from "foris";
import PropTypes from "prop-types";

import API_URLs from "API";

import TOKEN_STATUS from "./token_status";

const tokenShape = PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
});

TokensTable.propTypes = {
    tokens: PropTypes.arrayOf(tokenShape).isRequired,
};

function TokensTable({ tokens }) {
    if (!tokens || tokens.length === 0) {
        return (
            <p className="text-muted text-center">
                {_("There are no tokens added yet.")}
            </p>
        );
    }

    return (
        <div className="table-responsive">
            <table className="table table-hover mb-0">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">{_("Name")}</th>
                        <th scope="col" aria-label={_("Actions")} />
                    </tr>
                </thead>
                <tbody>
                    {tokens.map((token) => (
                        <TokenRow key={token.id} token={token} />
                    ))}
                </tbody>
            </table>
        </div>
    );
}

TokenRow.propTypes = {
    token: tokenShape,
};

function TokenRow({ token }) {
    return (
        <tr>
            <td className="align-middle">{token.name}</td>
            <td className="text-end">
                <TokenActions token={token} />
            </td>
        </tr>
    );
}

TokenActions.propTypes = {
    token: tokenShape,
};

function TokenActions({ token }) {
    const [setAlert] = useAlert();

    const [deleteTokenResponse, deleteToken] = useAPIDelete(
        `${API_URLs.tokens}/${token.id}`
    );
    useEffect(() => {
        if (deleteTokenResponse.state === API_STATE.ERROR) {
            setAlert(deleteTokenResponse.data);
        }
    }, [deleteTokenResponse, setAlert]);

    if (token.status === TOKEN_STATUS.REVOKED) {
        return <span className="text-muted">{_("Access revoked")}</span>;
    }
    if (
        token.status === TOKEN_STATUS.GENERATING ||
        deleteTokenResponse.state === API_STATE.SENDING
    ) {
        return <SpinnerElement small />;
    }

    return (
        <div className="btn-group" role="group">
            <DownloadButton
                href={`${API_URLs.tokens}/${token.id}`}
                className="btn-primary btn-sm"
            >
                {_("Download")}
            </DownloadButton>
            <Button className="btn-danger btn-sm" onClick={deleteToken}>
                {_("Revoke")}
            </Button>
        </div>
    );
}

export default withErrorMessage(withSpinnerOnSending(TokensTable));
