define(['app'], function (app) {
    'use strict';
    app.controller('pay_result_controller', ['$scope',function ($scope) {
        document.title="结算";
        var pay_map = {
            "1":"支付宝",
            "6":"微信支付",
            "8":"59钱包"
        };
        $scope.pay_result = JSON.parse(localStorage.getItem("pay_result"));
        $scope.pay_result.pay_type_name =pay_map[$scope.pay_result.pay_type];
        if($scope.pay_result.pay_type==8){
            $scope.pay_result.create_time = $scope.pay_result.create_time*1000;
        }
        $scope.go_list =function () {
         var length = 1-history.length;
            history.go(length);
        };
        $scope.go_order =function () {
            HXSJSBridge.openOrderListView(10);
        }

    }]);
});