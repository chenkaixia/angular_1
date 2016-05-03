define(['angular', 'app', '../pay_order/product_pay_service'], function (angular, app) {
    'use strict';
    app.controller('product_pay_controller', ['$rootScope','$scope', 'product_pay_service', '$stateParams', '$state', '$ionicPopup', '$timeout', function ($rootScope,$scope, product_pay_service, $stateParams, $state,$ionicPopup,$timeout) {
        document.title="支付订单";
        var order ={
            order_sn:"",
            order_amount:0
        };
        order = angular.extend(order,JSON.parse(localStorage.getItem('order')));
        var token = localStorage.getItem('token');
        var user_info = {};
        var description = "";
        var method_disabled = false;
        $scope.pay_not_open = false;
        $scope.data_model = {
            pay_methods: [],
            charge_password:"",
            pay_type:1,
            available_consume:"",
            show_password:true
        };
        $scope.order_data = {
            amount:order.order_amount
        };
        $scope.passwords = [];
        $scope.password_show =false;
        product_pay_service.get_pay_status.get({
            order_id:order.order_sn
        }).$promise.then(function (data) {
            if(data.status!=0){
                var msg = data&&data.msg?data.msg:"网络问题";
                $rootScope.alert_show(msg);
                return false;
            }
            if(data.data.status==0){
                localStorage.setItem("pay_result",JSON.stringify(data.data));
                $state.go('pay_result');
            }else{
                init_pay()
            }
        },function () {
            $rootScope.alert_show("网络问题");
        });
        init_pay();
        function init_pay() {
            product_pay_service.get_user.get({
                token:token
            }).$promise.then(function (data) {
                if(data.status==0){
                    user_info = data.data.creditcard_info;
                    $scope.pay_not_open=false;
                    if (user_info.account_status == 1) {
                        if (order.order_amount <= user_info.available_consume) {
                            description = "剩余消费额度￥" + user_info.available_consume;
                            $scope.data_model.available_consume=user_info.available_consume;
                            $scope.data_model.pay_type=8;
                        } else {
                            method_disabled = true;
                            description = "<span>额度不足</span>";
                            $scope.data_model.pay_type=1;
                        }
                    }else if(user_info.account_status == 2){
                        method_disabled = true;
                        description = "<span>已冻结</span>";
                        $scope.data_model.pay_type=1;
                    }else if(user_info.account_status == 0){
                        method_disabled = true;
                        $scope.data_model.pay_type=1;
                        $scope.pay_not_open=true;
                    }
                }else{
                    var msg = data&&data.msg?data.msg:"网络问题";
                    $rootScope.alert_show(msg);
                }
            },function () {
                $rootScope.alert_show("网络问题");
            }).then(function () {
                return product_pay_service.get_pay_methods.get({
                    order_type:13,
                    pay_amount:12,
                    installment:0,
                    device_type:1,
                    site_id:1,
                    app_version:4.0,
                    token:token,
                    _:1461740178277
                }).$promise;
            }).then(function (data) {
                if(data.status!=0){
                    var msg = data&&data.msg?data.msg:"网络问题";
                    $rootScope.alert_show(msg);;
                    return false;
                }
                var methodes = data.data&&data.data.paymethods;
                angular.forEach(methodes, function (method) {
                    if (method.pay_type == 8) {
                        var _description =method.description
                        method.description = description;
                        method.disabled = method_disabled;
                        if($scope.pay_not_open){
                            method.description = _description;
                            method.pay_not_open=true;
                        }
                    } else {
                        method.disabled = false;
                        method.pay_not_open=false;
                    }

                });
                $scope.data_model.pay_methods = methodes;
            },function () {
                $rootScope.alert_show("网络问题");
            });
        }

        $scope.submit_pay = function () {

            if($scope.data_model.pay_type==8){
                $scope.data_model.charge_password="";
                $scope.passwords=[];
                $scope.password_show = true;
            }else{
                var data = {
                    'order_sn':order.order_sn,
                    'type':13,
                    'type_name':'自营商品',
                    'attach':order.attach,
                    'order_amount':order.order_amount
                };
                var type=1;
                switch($scope.data_model.pay_type){
                    case 1:
                        type=1;
                        break;
                    case 6:
                        type=2;
                        break;
                }
                try{
                    HXSJSBridge.payWithTypeAndParam(type,JSON.stringify(data));
                }catch (e){
                    alert(e.toString());
                }

            }
        }
        $scope.wallet_pay = function (pay) {

            if(pay==false){
                $scope.data_model.show_password = true;
                $scope.password_show = false;
                return;
            }
            if($scope.data_model.show_password==false&&pay){
                $scope.data_model.show_password=true;
                return;
            }
            if(pay){
                var charge_password = hex_md5($scope.data_model.charge_password);
                try{
                    var time = new Date();
                    time= time.getTime();
                    var tradeParms = {
                        type:1,
                        sale_channel:13,
                        device_type:1,
                        order_sn:order.order_sn,
                        amount:order.order_amount,
                        trading_comment:"12344556778",
                        exemption_status:0,
                        exemption_open:0,
                        periods:1,
                        pay_password:charge_password,
                        token:token,
                        app_version:"4.0.05",
                        device_id:"00000000-52cd-f038-9d65-c94f509ee204",
                        protocol_version:"2",
                        call_back_url:order.attach,
                        time:time
                    };
                    tradeParms = product_pay_service.serialize(tradeParms);
                    product_pay_service.credit_card_trade.save(tradeParms).$promise.then(function (data) {
                        var _data = data.data;
                        if(data.status==0){
                            var pay_result = {
                                amount:_data.amount,
                                order_id:_data.sale_no,
                                create_time:_data.create_time,
                                pay_type:8
                            };
                            localStorage.setItem("pay_result",JSON.stringify(pay_result));
                            $state.go('pay_result');
                        }else if(data.status==8){
                            $scope.data_model.charge_password="";
                            $scope.passwords=[];
                            $scope.data_model.show_password = false;
                            $scope.data_model.password_msg=data.msg;
                        }
                    },function () {
                        
                    });
                }catch(e){
                    alert(e.toString());
                }
            }
            $scope.data_model.charge_password="";
        }
        //密码改变
        $scope.change_password = function () {
           var password = $scope.data_model.charge_password;
            var length = password.length;
            var _length = $scope.passwords.length;
            if(length==_length){
                return false;
            }
            if(length>_length){
                $scope.passwords.push("*");
            }else if(length<_length){
                $scope.passwords.pop();
            }
        }
        $scope.open_pay = function () {
                HXSJSBridge.openCreditPayView();
            }

    }]);
});