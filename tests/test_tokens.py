from http import HTTPStatus

from reforis.test_utils import mock_backend_response

TOKENS_URL = '/remote-access/api/tokens'
EXAMPLE_TOKEN_URL = f'{TOKENS_URL}/1234'


@mock_backend_response({'remote': {'get_status': {'tokens': []}}})
def test_get_tokens(client):
    response = client.get(TOKENS_URL)
    assert response.status_code == HTTPStatus.OK
    assert response.json == []


@mock_backend_response({
    'remote': {
        'get_status': {'tokens': []},
        'generate_token': {'task_id': 1234}
    }
})
def test_post_token(client):
    response = client.post(TOKENS_URL, json={'name': 'Joe Sixpack'})
    assert response.status_code == HTTPStatus.ACCEPTED
    assert response.json == {'task_id': 1234}


@mock_backend_response({
    'remote': {
        'get_status': {'tokens': [{'name': 'Joe Sixpack'}]},
    }
})
def test_post_token_duplicate(client):
    response = client.post(TOKENS_URL, json={'name': 'Joe Sixpack'})
    assert response.status_code == HTTPStatus.CONFLICT
    assert response.json == 'Token \'Joe Sixpack\' already exists.'


def test_post_token_missing_field(client):
    response = client.post(TOKENS_URL, json={'codename': 'Duchess'})
    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == {'name': 'Missing data for required field.'}


def test_post_token_invalid_json(client):
    response = client.post(TOKENS_URL)
    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == 'Invalid JSON'


def test_post_token_invalid_data(client):
    response = client.post(TOKENS_URL, json={'name': 1234})
    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == {'name': 'Expected data of type: str'}


@mock_backend_response({
    'remote': {
        'get_status': {'tokens': []},
        'generate_token': {}
    }
})
def test_post_token_backend_error(client):
    response = client.post(TOKENS_URL, json={'name': 'Erika Mustermann'})
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot create token.'


@mock_backend_response({
    'remote': {
        'get_token': {'token': 'FOO=BAR'},
        'get_status': {'tokens': [{'id': '1234', 'name': 'foobar'}]},
    }
})
def test_get_token(client):
    response = client.get(f'{TOKENS_URL}/1234')
    assert response.status_code == HTTPStatus.OK
    assert response.headers.get('Content-Disposition') == f'attachment; filename=token-foobar.tar.gz'
    assert response.data == b'\x14\xe3'


@mock_backend_response({'remote': {'get_token': {'status': 'not_found'}}})
def test_get_token_not_found(client):
    response = client.get(EXAMPLE_TOKEN_URL)
    assert response.status_code == HTTPStatus.NOT_FOUND
    assert response.json == 'Requested token does not exist.'


@mock_backend_response({'remote': {'get_token': {}}})
def test_get_token_backend_error(client):
    response = client.get(EXAMPLE_TOKEN_URL)
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot get token.'


@mock_backend_response({'remote': {'revoke': {'result': True}}})
def test_delete_client(client):
    response = client.delete(EXAMPLE_TOKEN_URL)
    assert response.status_code == HTTPStatus.NO_CONTENT


@mock_backend_response({'remote': {'revoke': {}}})
def test_delete_client_backend_error(client):
    response = client.delete(EXAMPLE_TOKEN_URL)
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot revoke token.'


@mock_backend_response({'remote': {'revoke': {'result': 1234}}})
def test_delete_client_unexpected_result(client):
    response = client.delete(EXAMPLE_TOKEN_URL)
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot revoke token.'
