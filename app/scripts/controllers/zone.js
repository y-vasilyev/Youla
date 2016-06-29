(function(){
    'use strict';
    angular
        .module('youla')
        .controller('zoneCtrl', [
            '$scope',
            'funcs',
            settingsFn
        ]);

    function settingsFn($scope, funcs){
        funcs.page_zone($scope, this);
    }

}());
