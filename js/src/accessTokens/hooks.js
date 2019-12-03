/*
 * Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import { useEffect } from "react";
import { useWSForisModule } from "foris";

import { TOKEN_STATUS } from "./TokensTable";

export function useRevokeToken(ws, setTokens) {
    const [revokeTokenNotification] = useWSForisModule(ws, "remote", "revoke");
    useEffect(() => {
        if (!revokeTokenNotification) {
            return;
        }
        if (revokeTokenNotification.id) {
            setTokens((tokensList) => {
                const tokensAfterRevoke = [...tokensList];
                const revokedTokenIdx = tokensAfterRevoke.findIndex(
                    (token) => token.id === revokeTokenNotification.id,
                );
                tokensAfterRevoke[revokedTokenIdx].status = TOKEN_STATUS.REVOKED;
                return tokensAfterRevoke;
            });
        }
    }, [revokeTokenNotification, setTokens]);
}

export function useGenerateToken(ws, getTokens, setGenerating) {
    const [generateTokenNotification] = useWSForisModule(ws, "remote", "generate_token");
    useEffect(() => {
        if (!generateTokenNotification) {
            return;
        }
        if (["token_generating", "succeeded"].includes(generateTokenNotification.status)) {
            getTokens();
            if (generateTokenNotification.status === "succeeded") {
                setGenerating(false);
            }
        }
    }, [generateTokenNotification, getTokens, setGenerating]);
}
