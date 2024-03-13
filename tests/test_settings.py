#  Copyright (C) 2020-2024 CZ.NIC z.s.p.o. (https://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from http import HTTPStatus

from reforis.test_utils import mock_backend_response

SETTINGS_URL = "/remote-access/api/settings"


@mock_backend_response({"remote": {"get_settings": {"key": "value"}}})
def test_get_settings(client):
    response = client.get(SETTINGS_URL)
    assert response.status_code == HTTPStatus.OK
    assert response.json == {"key": "value"}


@mock_backend_response({"remote": {"update_settings": {"result": True}}})
def test_put_settings(client):
    response = client.put(SETTINGS_URL, json={"foo": "bar"})
    assert response.status_code == HTTPStatus.OK
    assert response.json == {"result": True}


@mock_backend_response({"remote": {"update_settings": {}}})
def test_put_settings_invalid_json(client):
    response = client.put(SETTINGS_URL)
    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == "Invalid JSON"


@mock_backend_response({"remote": {"update_settings": {"result": False}}})
def test_put_settings_backend_error(client):
    response = client.put(SETTINGS_URL, json={"foo": "bar"})
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == "Cannot change settings."
