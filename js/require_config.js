require.config({
    paths: {
        'angular': 'lib/ionic/js/angular/angular',
        'angular-ui-route': 'lib/ionic/js/angular-ui/angular-ui-router',
        'ionic': 'lib/ionic/js/ionic',
        'ionic-angular': 'lib/ionic/js/ionic-angular',
        'domReady': 'lib/requirejs-domready/domReady',
        'angular-animate': 'lib/ionic/js/angular/angular-animate',
        'angular-resource': 'lib/ionic/js/angular/angular-resource',
        'angular-sanitize': 'lib/ionic/js/angular/angular-sanitize',
        'angular-cookies':'lib/ionic/js/angular/angular-cookies',
        'angular-debounce':'lib/angular-debounce'
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
    }
});