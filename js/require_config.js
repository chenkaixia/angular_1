require.config({
    baseUrl: '/',
    paths: {
        'angular': 'js/lib/ionic/js/angular/angular',
        'angular-ui-route': 'js/lib/ionic/js/angular-ui/angular-ui-router',
        'ionic': 'js/lib/ionic/js/ionic',
        'ionic-angular': 'js/lib/ionic/js/ionic-angular',
        'domReady': 'js/lib/requirejs-domready/domReady',
        'angular-animate': 'js/lib/ionic/js/angular/angular-animate',
        'angular-resource': 'js/lib/ionic/js/angular/angular-resource',
        'angular-sanitize': 'js/lib/ionic/js/angular/angular-sanitize',
        'angular-cookies':'js/lib/ionic/js/angular/angular-cookies',
        'app':'js/app',
        'dependencyResolverFor':'js/dependencyResolverFor',
        'routes':'js/routes'
    },
    shim: {
        'angular': {
            exports: 'angular'
        },
        'angular-ui-route': {
            deps: ['angular']
        },
        'angular-animate': {
            deps: ['angular']
        },
        'angular-resource': {
            deps: ['angular']
        },
        'angular-sanitize':{
            deps: ['angular']
        },
        'angular-cookies':{
            deps: ['angular']
        },
        'angular-debounce':{
            deps: ['angular']
        },
        'ionic-angular': {
            deps: [
                'angular',
                'angular-ui-route',
                'angular-animate',
                'angular-sanitize',
                'angular-resource',
                'ionic',
                'angular-cookies'
            ]
        }
    },
    urlArgs: "version=1.01"
});