/**
 * Created by chenkaixia on 16/4/14.
 */

define(['app'], function (app) {
    'use strict';
    app.factory('product_detail_service',['$resource', function ($resource) {
          return {
              get_detail:$resource('/mall/productdetail')
          }
    }]);

});
