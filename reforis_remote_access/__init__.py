#  Copyright (C) 2019 CZ.NIC z.s.p.o. (http://www.nic.cz/)
#
#  This is free software, licensed under the GNU General Public License v3.
#  See /LICENSE for more information.

from pathlib import Path
from http import HTTPStatus

from flask import Blueprint, current_app, jsonify, request
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
    'js_app_path': 'reforis_remote_access/app.min.js',
    'translations_path': BASE_DIR / 'translations',
}


# /authority

@blueprint.route('/authority', methods=['GET'])
def get_authority():
    authority_status = current_app.backend.perform('remote', 'get_status')
    return jsonify({'status': authority_status['status']})


@blueprint.route('/authority', methods=['POST'])
def post_authority():
    ca_status = current_app.backend.perform('remote', 'get_status').get('status')
    if ca_status == 'ready':
        raise APIError(_('Certificate authority already exists'))
    return jsonify(current_app.backend.perform('remote', 'generate_ca')), HTTPStatus.ACCEPTED


@blueprint.route('/authority', methods=['DELETE'])
def delete_authority():
    response = current_app.backend.perform('remote', 'delete_ca')
    if response.get('result') is not True:
        raise APIError(_('Cannot delete certificate authority'), HTTPStatus.INTERNAL_SERVER_ERROR)
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
        raise APIError(_('Cannot change settings'), HTTPStatus.INTERNAL_SERVER_ERROR)
    return jsonify(response)
