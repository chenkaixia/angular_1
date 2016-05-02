/**
 * Created by chenkaixia on 16/4/19.
 */

define(['angular','app'], function (angular,app) {
    'use strict';
    app.directive('ion59Radio', function() {
        return {
            restrict: 'E',
            replace: true,
            require: '?ngModel',
            transclude: true,
            template:
            '<label class="pay-label">' +
            '<input type="radio" name="radio-group">' +
            '<div class="pay-way-container" ng-class="{\'not_open\':pay_not_open}">' +
            '<div ng-transclude></div>'+
            '</div>' +
            '</label>',

            compile: function(element, attr) {
                var input = element.find('input');
                angular.forEach({
                    'name': attr.name,
                    'value': attr.value,
                    'disabled': attr.disabled,
                    'ng-value': attr.ngValue,
                    'ng-model': attr.ngModel,
                    'ng-disabled': attr.ngDisabled,
                    'ng-change': attr.ngChange,
                    'ng-required': attr.ngRequired,
                    'required': attr.required
                }, function(value, name) {
                    if (angular.isDefined(value)) {
                        input.attr(name, value);
                    }
                });

                return function(scope, element, attr) {
                    scope.getValue = function() {
                        return scope.ngValue || attr.value;
                    };
                };
            }
        };
    });

});
