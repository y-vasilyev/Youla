(function(){
    'use strict';
    angular
        .module('youla')
        .controller('homeCtrl', [
            '$scope',
            'funcs',
            settingsFn
        ]);

    function settingsFn($scope, funcs){
        var vm = this;
        funcs.page_home($scope, vm);
    }

}());
