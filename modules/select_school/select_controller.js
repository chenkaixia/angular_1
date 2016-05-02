define(['angular', 'app', '../product_order/product_order_service'], function (angular, app) {
    'use strict';
    app.controller('select_controller', ['$scope', 'product_order_service', '$state', function ($scope, product_order_service,$state) {
        var city_list = [];
        $scope.data={
            recommend_cities:[],
            city_group:[]
        };
        $scope.data.recommend_hide = false;
        $scope.data.search_city = true;
        if(city_list.length==0){
            product_order_service.get_city.get().$promise.then(function (data) {
                $scope.data.recommend_cities = data.data.recommend_cities;
                $scope.data.city_group = data.data.city_group;
                angular.forEach(data.data.city_group, function (group) {
                    angular.forEach(group.cities, function (city) {
                        city_list.push(city);
                    });
                });
            });
        }
        //获取焦点
        $scope.search_focus = function (focus) {
            if (focus) {
                $scope.search_focus_on = true;
            } else {
                $scope.search_focus_on = false;
            }
        };

        //选择城市
        $scope.select_city = function (event) {
            var target = angular.element(event.target);
            var city_id = target.attr("data-id");
            var city_name = target.attr("data-name");
            var site_id  = target.attr("site-id");

            if (city_id) {
                product_order_service.get_school.get({
                    store_only: 0,
                    city_id: city_id
                }).$promise.then(function (data) {
                    if(data.data){
                        $scope.data.city =city_name;
                        $scope.data.recommend_hide = true;
                        $scope.data.zones = data.data.zones;
                        $scope.search_focus_on = false;
                        $scope.data.search_name="";
                        $scope.data.search_list=[];
                        $scope.data.search_city=false;
                    }
                });
            }else if(site_id){
                select_school({
                    site_id:site_id,
                    site_name:target.attr("site-name")
                })
            }

        };
        //选择学校
        function select_school (school) {
            $state.go('order',{
                site_id:school.site_id,
                site_name:school.site_name
            });
        }
        //搜索城市
        $scope.search_city = function () {
            var searchWord = $scope.data.search_name;
            if (searchWord) {
                var result_list = [];
                angular.forEach(city_list, function (city) {
                    if ((city.city && city.city.indexOf(searchWord) >= 0) || (city.spell_short && city.spell_short.indexOf(searchWord) >= 0) || (city.spell_all && city.spell_all.indexOf(searchWord) >= 0)) {
                        result_list.push(city);
                    }
                });
                $scope.data.search_list = result_list;
            } else {
                $scope.data.search_list = []
            }
        }
        //搜索学校
        $scope.search_school = function () {
            var searchWord = $scope.data.search_school_name;
            if (searchWord) {
                product_order_service.search_site.get({
                    keywords: searchWord
                }).$promise.then(function (res) {
                    $scope.data.search_school_list =res.data.sites;
                })
            } else {
                $scope.data.search_school_list = []
            }
        }
        // 返回城市
        $scope.return_city = function () {
            $scope.data.recommend_hide = false;
            $scope.data.search_city = true;
        }
    }]);
});