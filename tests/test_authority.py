#  Copyright (C) 2020 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from http import HTTPStatus

from reforis.test_utils import mock_backend_response

AUTHORITY_URL = '/remote-access/api/authority'


@mock_backend_response({
    'remote': {
        'get_status': {
            'status': 'missing',
            'something_else': 'duh!'
        }
    }
})
def test_get_authority(client):
    response = client.get(AUTHORITY_URL)
    assert response.status_code == HTTPStatus.OK
    assert response.json == {'status': 'missing'}


@mock_backend_response({
    'remote': {
        'get_status': {'status': 'whatever'},
        'generate_ca': {'authority': 'whatever'}
    }
})
def test_post_authority(client):
    response = client.post(AUTHORITY_URL)
    assert response.status_code == HTTPStatus.ACCEPTED
    assert response.json == {'authority': 'whatever'}


@mock_backend_response({
    'remote': {
        'get_status': {'status': 'ready'},
    }
})
def test_post_authority_already_exists(client):
    response = client.post(AUTHORITY_URL)
    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == 'Certificate authority already exists.'


@mock_backend_response({'remote': {'delete_ca': {'result': True}, }})
def test_delete_authority(client):
    response = client.delete(AUTHORITY_URL)
    assert response.status_code == HTTPStatus.NO_CONTENT
    assert response.data == b''


@mock_backend_response({'remote': {'delete_ca': {}, }})
def test_delete_authority_backend_error_no_result(client):
    response = client.delete(AUTHORITY_URL)
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot delete certificate authority.'


@mock_backend_response({'remote': {'delete_ca': {'result': 1234}, }})
def test_delete_authority_backend_error_wrong_result(client):
    response = client.delete(AUTHORITY_URL)
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot delete certificate authority.'
