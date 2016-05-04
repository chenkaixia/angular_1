define([
    'angular',
    'dependencyResolverFor',
    'routes',
    'ionic-angular'
], function (angular, dependencyResolverFor, config) {
    'use strict';
    var app = angular.module('app', ['ionic', 'ui.router', 'ngResource','ngCookies','ngAnimate']);
    var load = document.getElementById('loadWrap');
    var $load = angular.element(load);
    app.factory('myInterceptor',[function () {
        var interceptor = {
            'request': function (config){
                $load.addClass('showLoad');
                return config;
            },
            'response': function (response) {
                 $load.removeClass('showLoad');
                return response;
            },
            'requestError': function (rejection) {
                return rejection; // 或新的promise
            },
            'responseError': function (rejection) {
                $load.removeClass('showLoad');
                return rejection; // 或新的promise
            }
        };
        return interceptor;
    }]);
    app.config(
        [
            '$stateProvider',
            '$urlRouterProvider',
            '$locationProvider',
            '$controllerProvider',
            '$compileProvider',
            '$filterProvider',
            '$provide',
            '$httpProvider',
            function ($stateProvider, $urlRouterProvider, $locationProvider, $controllerProvider, $compileProvider, $filterProvider, $provide,$httpProvider) {
                app.controller = $controllerProvider.register;
                app.directive = $compileProvider.directive;
                app.filter = $filterProvider.register;
                app.factory = $provide.factory;
                app.service = $provide.service;
                if (config.routes !== undefined) {
                    angular.forEach(config.routes, function (route, path) {
                        $stateProvider.state(path, {
                            url: route.url,
                            templateUrl: route.templateUrl,
                            controller: route.controller,
                            prefetchTemplate:route.prefetchTemplate,
                            resolve: dependencyResolverFor(route.dependencies)
                        });
                    });
                }
                $httpProvider.interceptors.push('myInterceptor');
                $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8';
            }
        ]).run(["$rootScope","$timeout",function ($rootScope, $timeout) {
                $rootScope.alert_text="";
                $rootScope.alertShow=false;
                $rootScope.alert_show = function (msg) {
                    $rootScope.alert_text = msg;
                    $rootScope.alertShow=true;
                    $timeout(function () {
                        $rootScope.alertShow=false;
                    },2000);
                };
         }]);
    return app;
});
