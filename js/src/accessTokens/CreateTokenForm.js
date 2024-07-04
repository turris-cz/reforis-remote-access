/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";

import {
    TextInput,
    Button,
    useAPIPost,
    useForm,
    useAlert,
    undefinedIfEmpty,
    API_STATE,
    formFieldsSize,
} from "foris";
import PropTypes from "prop-types";

import API_URLs from "API";

CreateTokenForm.propTypes = {
    generating: PropTypes.bool.isRequired,
    setGenerating: PropTypes.func.isRequired,
};

export default function CreateTokenForm({ generating, setGenerating }) {
    const [setAlert] = useAlert();

    const [createTokenResponse, createToken] = useAPIPost(API_URLs.tokens);
    useEffect(() => {
        if (createTokenResponse.state === API_STATE.ERROR) {
            setAlert(createTokenResponse.data);
            setGenerating(false);
        }
    }, [createTokenResponse, setAlert, setGenerating]);

    const [formState, formChangeHandler, reloadForm] =
        useForm(createTokenValidator);
    const formData = formState.data;
    const formErrors = formState.errors || {};
    useEffect(() => {
        reloadForm({ name: "" });
    }, [reloadForm]);

    function handleSubmit(event) {
        event.preventDefault();
        createToken({ data: formData });
        setGenerating(true);
    }

    if (!formData) {
        return null;
    }

    const addButtonDisabled = undefinedIfEmpty(formErrors) || generating;
    return (
        <div className={formFieldsSize}>
            <h2>{_("Create Token")}</h2>
            <form onSubmit={handleSubmit}>
                <TextInput
                    label={_("Token name")}
                    helpText={_(
                        `Shorter than 64 characters. Only alphanumeric characters, dots, dashes and underscores.`
                    )}
                    value={formData.name}
                    error={formErrors.name}
                    onChange={formChangeHandler((value) => ({
                        name: { $set: value },
                    }))}
                />
                <div className="text-end">
                    <Button
                        data-testid="add-token-button"
                        type="submit"
                        forisFormSize
                        disabled={addButtonDisabled}
                    >
                        {_("Add")}
                    </Button>
                </div>
            </form>
        </div>
    );
}

function createTokenValidator(formData) {
    const { name } = formData;
    if (!name) {
        return { name: _("Name cannot be empty") };
    }
    if (name.length > 64) {
        return { name: _("Name is too long") };
    }
    if (!/^[a-zA-Z0-9.\-_]+$/.test(name)) {
        return { name: _("Name contains invalid characters") };
    }
    return undefined;
}
