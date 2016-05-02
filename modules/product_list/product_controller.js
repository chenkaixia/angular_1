define(['angular','app', '../product_list/product_service'], function (angular,app) {
    'use strict';
    app.controller('product_list_controller', ['$rootScope','$scope', 'product_service', '$state','$location','$cookies', function ($rootScope,$scope, product_service, $state,$location,$cookies) {
        var start_index = 0, limit = 10;
        var fontSize = document.documentElement.style.fontSize;
        fontSize= fontSize.replace("px","");
        //列表高度
        $scope.itemHeight = 240/25*fontSize+"px";
        var token = $location.search()['token'];
        if(token){
            window.localStorage.setItem('token',token);
            $cookies.put('token',token);
        }
        $cookies.put('device_id','1mDSBbBjJkwZCBKcEzexeA1wXH0n8Y9X');
        $scope.banner = "./res/banner.png";
        window.localStorage.setItem("product_detail","");
        //数据模型
        $scope.dataModel = {
            list: [],
            more_data: true
        };
        //获取列表数据
        function get_product_list(offset, limit) {
            product_service.get({
                offset: offset,
                limit: limit
            }).$promise.then(function (data) {
                $scope.$broadcast('scroll.infiniteScrollComplete');
                var products = data.data.products;
                if (products == null) {
                    return false;
                }
                angular.forEach(products, function (product) {
                    product.product_name_1 = product.product_name.substr(0,13);
                    product.product_name_2 = product.product_name.substr(13);
                });

                $scope.dataModel.list = $scope.dataModel.list.concat(data.data.products);
                start_index = start_index + limit;
                if (data.data.products.length != limit) {
                    $scope.dataModel.more_data = false;
                }
            });
        }

        //滑动获取列表下一页数据
        $scope.loadMoreData = function () {
            get_product_list(start_index, limit);
        };

        //跳转到详情界面
        $scope.view_detail = function (product) {
            var product_id = product.product_id;
            var owner_id = product.owner_id;
                window.localStorage.setItem("product_id",product_id);
                window.localStorage.setItem("owner_id",owner_id);
            $state.go('product_detail');
        };

    }]);
});