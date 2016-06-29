(function(){
    'use strict';
    angular
        .module('youla')
        .controller('cityCtrl', [
            '$scope',
            'funcs',
            settingsFn
        ]);

    function settingsFn($scope, funcs){
        var vm = this;
        funcs.page_city($scope, vm);
    }

}());
