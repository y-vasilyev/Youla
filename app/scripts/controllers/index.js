(
    function(){
        "use strict";

        angular
            .module('youla')
            .controller('ctrlIndex', [
                '$rootScope',
                '$log',
                '$scope',
                'dataFactory',
                'API_CONSTANT',
                'authFactory',
	            'CacheFactory',
                '$location',
                '$state',
                '$timeout',
                '$stateParams',
                '$injector',
                'funcs',
                '$q',

                welcomeFn
            ]);

        function welcomeFn($rootScope, $log, $scope, dataFactory, API_CONSTANT,  authFactory, CacheFactory,
        					$location, $state, $timeout, $stateParams, $injector, funcs, $q){

            var vm = this;

        }

    }()
);
