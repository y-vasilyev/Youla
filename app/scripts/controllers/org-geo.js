(function(){
    'use strict';
    angular
        .module('youla')
        .controller('orgGeoCtrl', [
            '$scope',
            'funcs',
            settingsFn
        ]);

    function settingsFn($scope, funcs){
        funcs.page_orgGeo($scope, this);
    }

}());
