((function(){
    return {
        'appDir': '../www',
        'baseUrl': 'js',
        'dir': '../www-production',
        'optimizeCss': 'standard',
        'optimize': 'uglify2',
        'preserveLicenseComments': false,
        'optimizeAllPluginResources': true,
        'generateSourceMaps': false,
        'modules': [
            {
                'name': 'app'
            }
        ],
        'paths': {
            'jquery': 'libs/jquery/1.10.2'
        },
        'shim': {
            'plugins/jquery.placeholder/main': ['jquery']
        }
    };
})())
