/*
 * Copyright (C) 2019-2021 CZ.NIC z.s.p.o. (https://www.nic.cz/)
 *
 * This is free software, licensed under the GNU General Public License v3.
 * See /LICENSE for more information.
 */

import React, { useEffect } from "react";
import PropTypes from "prop-types";

import {
    CheckBox,
    NumberInput,
    Button,
    useForm,
    API_STATE,
    useAlert,
    useAPIPut,
    undefinedIfEmpty,
} from "foris";

import API_URLs from "API";

RemoteAccessForm.propTypes = {
    settings: PropTypes.object.isRequired,
    onSuccess: PropTypes.func.isRequired,
};

export default function RemoteAccessForm({ settings, onSuccess }) {
    const [setAlert] = useAlert();

    const [putSettingsResponse, putSettings] = useAPIPut(API_URLs.settings);
    useEffect(() => {
        if (putSettingsResponse.state === API_STATE.ERROR) {
            setAlert(_("Cannot save connection parameters."));
        } else if (putSettingsResponse.state === API_STATE.SUCCESS) {
            onSuccess();
        }
    }, [putSettingsResponse, setAlert, onSuccess]);

    const [formState, formChangeHandler, reloadForm] = useForm(validator);
    const formData = formState.data;
    const formErrors = formState.errors || {};
    useEffect(() => {
        reloadForm(settings);
    }, [reloadForm, settings]);

    if (!formData) {
        return null;
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (formData.enabled) {
            putSettings({ data: formData });
        } else {
            putSettings({ data: { enabled: false } });
        }
    }

    const saveButtonDisabled =
        !!undefinedIfEmpty(formErrors) ||
        putSettingsResponse.state === API_STATE.SENDING;

    return (
        <>
            <h2>{_("Remote Access")}</h2>
            <form onSubmit={handleSubmit}>
                <Switch
                    label={_("Enable Remote Access")}
                    checked={formData.enabled}
                    onChange={formChangeHandler((value) => ({
                        enabled: { $set: value },
                    }))}
                />
                {formData.enabled && (
                    <>
                        <CheckBox
                            label={_("Accessible via WAN")}
                            helpText={_(`Devices in the WAN network will be \
able to connect to the configuration interface. Otherwise only devices on LAN \
will be able to access it.`)}
                            checked={formData.wan_access}
                            onChange={formChangeHandler((value) => ({
                                wan_access: { $set: value },
                            }))}
                        />
                        <NumberInput
                            label={_("Port")}
                            helpText={_(`A port which will be opened for the \
remote configuration of this device.`)}
                            value={formData.port}
                            error={formErrors.port}
                            onChange={formChangeHandler((value) => ({
                                port: { $set: value },
                            }))}
                        />
                    </>
                )}
                <Button
                    type="submit"
                    forisFormSize
                    disabled={saveButtonDisabled}
                    loading={putSettingsResponse.state === API_STATE.SENDING}
                >
                    {_("Save")}
                </Button>
            </form>
        </>
    );
}

function validator(formData) {
    if (formData.port < 1024 || formData.port > 65536) {
        return { port: _("Should be a number in range of 1024-65536") };
    }
    return undefined;
}
