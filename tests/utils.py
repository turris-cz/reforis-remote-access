from reforis.test_utils import get_mocked_client

def get_mocked_remote_access_client(*args, **kwargs):
    return get_mocked_client('reforis_remote_access', *args, *kwargs)
