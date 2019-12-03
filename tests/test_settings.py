from http import HTTPStatus

from .utils import get_mocked_remote_access_client


SETTINGS_URL = '/remote-access/api/settings'


def test_get_settings(app):
    backend_response = {'key': 'value'}
    with get_mocked_remote_access_client(app, backend_response) as client:
        response = client.get(SETTINGS_URL)
    assert response.status_code == HTTPStatus.OK
    assert response.json == backend_response


def test_put_settings(app):
    backend_response = {'result': True}
    with get_mocked_remote_access_client(app, backend_response) as client:
        response = client.put(SETTINGS_URL, json={'foo': 'bar'})
    assert response.status_code == HTTPStatus.OK
    assert response.json == backend_response


def test_put_settings_invalid_json(app):
    with get_mocked_remote_access_client(app, {}) as client:
        response = client.put(SETTINGS_URL)
    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == 'Invalid JSON'


def test_put_settings_backend_error(app):
    with get_mocked_remote_access_client(app, {'result': False}) as client:
        response = client.put(SETTINGS_URL, json={'foo': 'bar'})
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot change settings.'
