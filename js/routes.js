define([], function () {
    return {
        defaultRoutePath: '/product_list',
        routes: {
            'product_list': {
                url: '/product_list',
                templateUrl: 'modules/product_list/product_list.html',
                controller: 'product_list_controller',
                prefetchTemplate:true,
                dependencies: [
                    '../modules/product_list/product_controller'
                ]
            },
            'product_detail':{
                url: '/product_detail/{product_id}&{owner_id}&{token}',
                templateUrl: 'modules/product_detail/product_detail.html',
                controller: 'product_detail_controller',
                prefetchTemplate:false,
                dependencies: [
                    '../modules/product_detail/product_detail_controller'
                ]
            },
            'order': {
                url: '/order',
                templateUrl: 'modules/product_order/product_order.html',
                controller: 'product_order_controller',
                prefetchTemplate:false,
                dependencies: [
                    '../modules/product_order/product_order_controller'
                ]
            },'pay_order': {
                url: '/pay_order',
                templateUrl: 'modules/pay_order/pay_order.html',
                controller: 'product_pay_controller',
                prefetchTemplate:false,
                dependencies: [
                    '../modules/pay_order/product_pay_controller',
                    '../diretive/59_diretive'
                ]
            },'pay_result': {
                url: '/pay_result',
                templateUrl: 'modules/pay_result/pay_result.html',
                controller: 'pay_result_controller',
                prefetchTemplate:false,
                dependencies: [
                    '../modules/pay_result/pay_result_controller'
                ]
            }
        }
    };
});