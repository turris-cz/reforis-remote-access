from http import HTTPStatus

from .utils import get_mocked_remote_access_client


TOKENS_URL = '/remote-access/api/tokens'
EXAMPLE_TOKEN_URL = f'{TOKENS_URL}/1234'


def test_get_tokens(app):
    backend_response = {'tokens': []}
    with get_mocked_remote_access_client(app, backend_response) as client:
        response = client.get(TOKENS_URL)
    assert response.status_code == HTTPStatus.OK
    assert response.json == backend_response['tokens']


def test_post_token(app):
    backend_response = {
        'remote': {
            'get_status': {
                'tokens': []
            },
            'generate_token': {
                'task_id': 1234
            }
        }
    }
    with get_mocked_remote_access_client(app, backend_response, mock_specific_calls=True) as client:
        response = client.post(TOKENS_URL, json={'name': 'Joe Sixpack'})
    assert response.status_code == HTTPStatus.ACCEPTED
    assert response.json == backend_response['remote']['generate_token']


def test_post_token_duplicate(app):
    backend_response = {'tokens': [{'name': 'Joe Sixpack'}]}
    with get_mocked_remote_access_client(app, backend_response) as client:
        response = client.post(TOKENS_URL, json={'name': 'Joe Sixpack'})
    assert response.status_code == HTTPStatus.CONFLICT
    assert response.json == 'Token \'Joe Sixpack\' already exists.'


def test_post_token_missing_field(app):
    with get_mocked_remote_access_client(app, {}) as client:
        response = client.post(TOKENS_URL, json={'codename': 'Duchess'})
    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == {'name': 'Missing data for required field.'}


def test_post_token_invalid_json(app):
    with get_mocked_remote_access_client(app, {}) as client:
        response = client.post(TOKENS_URL)
    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == 'Invalid JSON'


def test_post_token_invalid_data(app):
    with get_mocked_remote_access_client(app, {}) as client:
        response = client.post(TOKENS_URL, json={'name': 1234})
    assert response.status_code == HTTPStatus.BAD_REQUEST
    assert response.json == {'name': 'Expected data of type: str'}


def test_post_token_backend_error(app):
    backend_response = {
        'remote': {
            'get_status': {
                'tokens': []
            },
            'generate_token': {}
        }
    }
    with get_mocked_remote_access_client(app, backend_response, mock_specific_calls=True) as client:
        response = client.post(TOKENS_URL, json={'name': 'Erika Mustermann'})
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot create token.'


def test_get_token(app):
    token_id = '1234'
    token_name = 'foobar'
    token_content = 'FOO=BAR'

    backend_response = {
        'remote': {
            'get_token': {
                'token': token_content
            },
            'get_status': {
                'tokens': [{'id': token_id, 'name': token_name}]
            },
        }
    }
    with get_mocked_remote_access_client(app, backend_response, mock_specific_calls=True) as client:
        response = client.get(f'{TOKENS_URL}/{token_id}')

    assert response.status_code == HTTPStatus.OK
    assert response.headers.get('Content-Disposition') == f'attachment; filename=token-{token_name}.tar.gz'
    assert response.data == bytes(token_content, 'utf-8')


def test_get_token_not_found(app):
    with get_mocked_remote_access_client(app, {'status': 'not_found'}) as client:
        response = client.get(EXAMPLE_TOKEN_URL)
    assert response.status_code == HTTPStatus.NOT_FOUND
    assert response.json == 'Requested token does not exist.'


def test_get_token_backend_error(app):
    with get_mocked_remote_access_client(app, {}) as client:
        response = client.get(EXAMPLE_TOKEN_URL)
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot get token.'


def test_delete_client(app):
    with get_mocked_remote_access_client(app, {'result': True}) as client:
        response = client.delete(EXAMPLE_TOKEN_URL)
    assert response.status_code == HTTPStatus.NO_CONTENT


def test_delete_client_backend_error(app):
    with get_mocked_remote_access_client(app, {}) as client:
        response = client.delete(EXAMPLE_TOKEN_URL)
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot revoke token.'


def test_delete_client_unexpected_result(app):
    with get_mocked_remote_access_client(app, {'result': 1234}) as client:
        response = client.delete(EXAMPLE_TOKEN_URL)
    assert response.status_code == HTTPStatus.INTERNAL_SERVER_ERROR
    assert response.json == 'Cannot revoke token.'
