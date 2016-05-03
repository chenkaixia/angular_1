/**
 * Created by chenkaixia on 16/4/14.
 */

define(['angular','app'], function (angular,app) {
    'use strict';
    app.factory('product_pay_service',['$resource', function ($resource) {
          return {
              get_pay_methods: $resource('/pay/methods/'),
              // get_user:$resource('/user/whole_info'),
              get_user:$resource('../modules/pay_order/user.json'),
              get_pay_status:$resource('/mall/getPayStatus'),
              credit_card_trade:$resource('/creditcard/trade'),
              serialize:function (json) {
                  var arr = [];
                  if(json){
                      angular.forEach(json,function (key,value) {
                          arr.push(value+"="+key);
                      })
                  }
                  return arr.join("&");
              }

          };
    }]);

});
