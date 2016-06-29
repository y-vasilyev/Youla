(function(){
    'use strict';
    angular
        .module('youla')
        .controller('citiesCtrl', [
            '$scope',
            'funcs',
            settingsFn
        ]);

    function settingsFn($scope, funcs){
        var vm = this;
        funcs.page_cities($scope, vm);
    }

}());
