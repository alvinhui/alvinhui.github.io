var CN_DEBUG = false;
var CN_URL_ARGS = CN_DEBUG ? ('bust=' + new Date().getTime()) : 'v=20130711007';
require.config({
    'urlArgs': CN_URL_ARGS,
    'paths': {
        'jquery': 'libs/jquery/1.10.2'
    },
    'shim': {
        'plugins/jquery.placeholder/main': ['jquery']
    }
});

requirejs(['app']);
