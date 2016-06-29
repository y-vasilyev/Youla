(function(){
    'use strict';
    angular
        .module('youla')
        .controller('moneyCtrl', [
            '$scope',
            'funcs',
            settingsFn
        ]);

    function settingsFn($scope, funcs){
        var vm = this;
        funcs.page_money($scope, vm);
    }

}());
