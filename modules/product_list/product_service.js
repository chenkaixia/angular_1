/**
 * Created by chenkaixia on 16/4/14.
 */

define(['app'], function (app) {
    'use strict';
    app.factory('product_service',['$resource', function ($resource) {
          return $resource('/mall/products');
    }]);
});
