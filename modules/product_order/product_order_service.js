/**
 * Created by chenkaixia on 16/4/14.
 */

define(['angular','app'], function (angular,app) {
    'use strict';
    app.factory('product_order_service', ['$resource', function ($resource) {
        return {
            get_detail: $resource('product_list/product_detail.json'),
            get_city: $resource('/location/city/list'),
            get_school: $resource('/location/city/site/list'),
            search_site:$resource('/location/site/search'),
            createorder:$resource('/mall/createorder'),
            serialize:function (json) {
                var arr = [];
                if(json){
                    angular.forEach(json,function (key,value) {
                        arr.push(value+"="+key);
                    })
                }
                return arr.join("&");
            }
        }
    }]);

});
