(function(){
    'use strict';
    angular
        .module('youla')
        .controller('geoCtrl', [
            '$scope',
            'funcs',
            settingsFn
        ]);

    function settingsFn($scope, funcs){
        funcs.page_org($scope, this, 'geo');
    }

}());
