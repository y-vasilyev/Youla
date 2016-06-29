(function(){
    'use strict';
    angular
        .module('youla')
        .controller('settingsCtrl', [
            '$scope',
            'funcs',
            settingsFn
        ]);

    function settingsFn($scope, funcs){
        var vm = this;
        funcs.page_account($scope, vm);
    }

}());
