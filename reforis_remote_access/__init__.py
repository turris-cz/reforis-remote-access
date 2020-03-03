#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from pathlib import Path
from http import HTTPStatus
import base64

from flask import Blueprint, current_app, jsonify, request, make_response
from flask_babel import gettext as _

from reforis.foris_controller_api.utils import log_error, validate_json, APIError

# pylint: disable=invalid-name
blueprint = Blueprint(
    'Remote Access',
    __name__,
    url_prefix='/remote-access/api',
)

BASE_DIR = Path(__file__).parent

# pylint: disable=invalid-name
remote_access = {
    'blueprint': blueprint,
    # Define {python_module_name}/js/app.min.js
    # See https://gitlab.labs.nic.cz/turris/reforis/reforis-distutils/blob/master/reforis_distutils/__init__.py#L11
    'js_app_path': 'reforis_remote_access/js/app.min.js',
    'translations_path': BASE_DIR / 'translations',
}


# /authority

@blueprint.route('/authority', methods=['GET'])
def get_authority():
    remote_status = current_app.backend.perform('remote', 'get_status')
    return jsonify({'status': remote_status['status']})


@blueprint.route('/authority', methods=['POST'])
def post_authority():
    ca_status = current_app.backend.perform('remote', 'get_status').get('status')
    if ca_status == 'ready':
        raise APIError(_('Certificate authority already exists.'))
    return jsonify(current_app.backend.perform('remote', 'generate_ca')), HTTPStatus.ACCEPTED


@blueprint.route('/authority', methods=['DELETE'])
def delete_authority():
    response = current_app.backend.perform('remote', 'delete_ca')
    if response.get('result') is not True:
        raise APIError(_('Cannot delete certificate authority.'), HTTPStatus.INTERNAL_SERVER_ERROR)
    return '', HTTPStatus.NO_CONTENT


# /settings

@blueprint.route('/settings', methods=['GET'])
def get_connection_settings():
    return jsonify(current_app.backend.perform('remote', 'get_settings'))


@blueprint.route('/settings', methods=['PUT'])
def put_connection_settings():
    validate_json(request.json)
    response = current_app.backend.perform('remote', 'update_settings', request.json)
    if response.get('result') is not True:
        raise APIError(_('Cannot change settings.'), HTTPStatus.INTERNAL_SERVER_ERROR)
    return jsonify(response)


# /tokens

@blueprint.route('/tokens', methods=['GET'])
def get_tokens():
    remote_status = current_app.backend.perform('remote', 'get_status')
    return jsonify(remote_status['tokens'])


@blueprint.route('/tokens', methods=['POST'])
def post_tokens():
    validate_json(request.json, {'name': str})
    # Check for conflict (name)
    tokens = current_app.backend.perform('remote', 'get_status')['tokens']
    names = [token['name'] for token in tokens]
    name = request.json['name']
    if name in names:
        raise APIError(_('Token \'{}\' already exists.').format(name), HTTPStatus.CONFLICT)

    response = current_app.backend.perform('remote', 'generate_token', request.json)
    if not response.get('task_id'):
        raise APIError(_('Cannot create token.'), HTTPStatus.INTERNAL_SERVER_ERROR)
    return jsonify(response), HTTPStatus.ACCEPTED


@blueprint.route('/tokens/<token_id>', methods=['GET'])
def get_token(token_id):
    token_request = {'id': token_id}

    response = current_app.backend.perform('remote', 'get_token', token_request)
    if response.get('status') == 'not_found':
        raise APIError(_('Requested token does not exist.'), HTTPStatus.NOT_FOUND)

    token_data = response.get('token')
    if not token_data:
        raise APIError(_('Cannot get token.'), HTTPStatus.INTERNAL_SERVER_ERROR)

    tokens = current_app.backend.perform('remote', 'get_status')['tokens']
    token_name = next(filter(lambda t: t['id'] == token_id, tokens))['name']

    return make_response((
        base64.b64decode(token_data),
        {
            'Content-Disposition': f'attachment; filename=token-{token_name}.tar.gz'
        }
    ))


@blueprint.route('/tokens/<token_id>', methods=['DELETE'])
def delete_token(token_id):
    response = current_app.backend.perform('remote', 'revoke', {'id': token_id})
    if response.get('result') is not True:
        raise APIError(_('Cannot revoke token.'), HTTPStatus.INTERNAL_SERVER_ERROR)
    return '', HTTPStatus.NO_CONTENT
