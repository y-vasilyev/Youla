(function(){
    'use strict';
    angular
        .module('youla')
        .controller('orgCtrl', [
            '$scope',
            'funcs',
            settingsFn
        ]);

    function settingsFn($scope, funcs){
        funcs.page_org($scope, this, 'org');
    }

}());
