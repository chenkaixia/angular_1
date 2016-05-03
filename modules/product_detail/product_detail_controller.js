define(['angular', 'app', '../product_detail/product_detail_service'], function (angular, app) {
    'use strict';
    app.controller('product_detail_controller', ['$rootScope', '$scope', 'product_detail_service', '$stateParams', '$state', '$ionicSlideBoxDelegate', '$timeout', function ($rootScope, $scope, product_service, $stateParams, $state, $ionicSlideBoxDelegate, $timeout) {

        document.title = "商品详情";
        var product_id = localStorage.getItem("product_id");
        var owner_id = localStorage.getItem("owner_id");
        var product_detail = window.localStorage.getItem("product_detail");
        product_detail = product_detail ? JSON.parse(product_detail) : {};
        $scope.product_detail = {
            product_id: product_id,//商品id
            product_name: "",//商品名称
            origin_price: "",//商品初始价格
            price: "",//当前价格
            currency_type: 0,//币种，0 人民币
            images: [],//图片路径，主图（参考京东命名）
            description: "",//商品描述
            owner_id: owner_id,//商品拥有者id
            num: 1,
            total_amount: 0
        };
        product_service.get_detail.get({
            product_id: product_id,
            owner_id: owner_id
        }).$promise.then(function (data) {
            if(data&&data.status==0){
                $scope.product_detail = angular.extend($scope.product_detail, data.data);
                $scope.product_detail.total_amount = $scope.product_detail.price;
                $timeout(function () {
                    $ionicSlideBoxDelegate.update();
                }, 50);
            }else{
                var msg = data&&data.msg?data.msg:"网络问题";
                $rootScope.alert_show(msg);
            }
        }, function () {
            $rootScope.alert_show("网络问题");
        });

        if (product_detail && product_id == product_detail.product_id) {
            $scope.product_detail = angular.extend($scope.product_detail, product_detail);
        }

        $scope.go_order = function () {
            $scope.product_detail.img = $scope.product_detail.images[0];
            var product_detail = JSON.stringify($scope.product_detail);
            window.localStorage.setItem("product_detail", product_detail);
            $state.go('order');
        };
        $scope.set_num = function (num) {
            num = num - 0;
            if (num > 0 && $scope.product_detail.num == 99 || num < 0 && $scope.product_detail.num == 1) {
                return false;
            }
            $scope.product_detail.num = $scope.product_detail.num + num;
            $scope.product_detail.total_amount = ($scope.product_detail.price * $scope.product_detail.num).toFixed(2);
        }
    }]);
});