define(['angular', 'app', '../product_order/product_order_service'], function (angular, app) {
    'use strict';
    app.controller('product_order_controller', ['$rootScope','$scope', 'product_order_service', '$stateParams', '$state', '$ionicModal', function ($rootScope,$scope, product_order_service, $stateParams, $state, $ionicModal) {
        document.title="确认下单";
        $scope.show_select=false;
        $scope.show_remark=false;
        var city_list = [];
        //商品详情
        var product_detail = JSON.parse(window.localStorage.getItem("product_detail"));
        var user_info = JSON.parse(window.localStorage.getItem("user_info"));
        delete product_detail.description;
        delete product_detail.images;
        user_info  = user_info?user_info:{
            site_id:"",
            school_name:"",
            receiver_address:"",
            phone:""
        };

        //订单详情
        $scope.order_data = {
            product_id: "",
            owner_id: "",
            num: "0",
            price: "0",
            delivery_fee: "0",
            total_amount: "0",
            site_id: user_info.site_id,
            receiver_address:user_info.receiver_address,
            phone: user_info.phone,
            img: "",
            remark: "",
            product_name: "",
            remark_text: ""
        };

        $scope.order_data = angular.extend($scope.order_data, product_detail);

        $scope.data = {
            recommend_cities: [],
            city_group: [],
            recommend_hide: false,
            school_name: user_info.school_name,
            search_name: "",
            search_list: [],
            select_title:"选择城市",
            search_city:true,
            city:"",
            search_school_name:""
        };
        //留言框
        $scope.openModal = function () {
            $scope.order_data.remark_text = $scope.order_data.remark;
            $scope.show_remark=true;
        };
        $scope.closeModal = function (set_remark) {
            if (set_remark) {
                $scope.order_data.remark = $scope.order_data.remark_text;
            }
            $scope.show_remark=false;
        };
        $scope.order_data.remark_num = 0;
        $scope.word_set = function () {
            $scope.order_data.remark_num = $scope.order_data.remark_text.length;
        };
        //跳转选择学校界面
        $scope.open_select_school = function () {
            $scope.show_select=true;
        }
        $scope.submit_order = function () {
            if($scope.order_data.site_id==""){
                $rootScope.alert_show("请选择学校");
                return;
            }
            if($scope.order_data.receiver_address==""){
                $rootScope.alert_show("请填写详细地址");
                return;
            }
            if(!/^(13[0-9]|14[0-9]|15[0-9]|18[0-9]|17[0-9])\d{8}$/i.test($scope.order_data.phone)){
                $rootScope.alert_show("请填写正确的手机号码");
                return;
            }
            user_info.site_id=$scope.order_data.site_id;
            user_info.school_name =$scope.data.school_name;
            user_info.receiver_address = $scope.order_data.receiver_address;
            user_info.phone = $scope.order_data.phone;
            localStorage.setItem("user_info",JSON.stringify(user_info));
            var token = window.localStorage.getItem("token");
            $scope.order_data.token=token;
            delete product_detail.description;

            var order_data = product_order_service.serialize($scope.order_data);

            localStorage.setItem("product_detail",JSON.stringify($scope.order_data));

            product_order_service.createorder.save(order_data).$promise.then(function (res) {
                if(res.status==0){
                    localStorage["order"]=JSON.stringify(res.data);
                    $state.go('pay_order');
                }else{
                    var msg = res&&res.msg?res.msg:"网络问题！请刷新";
                    $rootScope.alert_show(msg);
                }
            },function () {
                $rootScope.alert_show("网络问题！请刷新");
            });
        }
        /**
        * 选择学校
        * */
        if(city_list.length==0){
            product_order_service.get_city.get().$promise.then(function (data) {
                if(data&&data.status==0){
                    $scope.data.recommend_cities = data.data.recommend_cities;
                    $scope.data.city_group = data.data.city_group;
                    angular.forEach(data.data.city_group, function (group) {
                        angular.forEach(group.cities, function (city) {
                            city_list.push(city);
                        });
                    });
                }else{
                    var msg = data&&data.msg?data.msg:"获取城市列表失败，请刷新。";
                    $rootScope.alert_show(msg);
                }
            },function () {
                $rootScope.alert_show("网络问题");
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
                    if(data&&data.status==0){
                        $scope.data.city =city_name;
                        $scope.data.recommend_hide = true;
                        $scope.data.zones = data.data.zones;
                        $scope.search_focus_on = false;
                        $scope.data.search_name="";
                        $scope.data.search_list=[];
                        $scope.data.search_city=false;
                    }else{
                        var msg = data&&data.msg?data.msg:"网络问题！请刷新";
                        $rootScope.alert_show(msg);
                    }
                },function () {
                    $rootScope.alert_show("网络问题！请刷新");
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
            $scope.order_data.site_id = school.site_id;
            $scope.data.school_name = school.site_name;
            $scope.search_focus_on = false;
            $scope.data.search_name="";
            $scope.data.search_list=[];
            $scope.show_select=false;
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
                    if(res&&res.status==0){
                        $scope.data.search_school_list =res.data.sites;
                    }else {
                        var msg = res&&res.msg?res.msg:"网络问题！请刷新";
                        $rootScope.alert_show(msg);
                    }

                },function () {
                    $rootScope.alert_show("网络问题！请刷新");
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