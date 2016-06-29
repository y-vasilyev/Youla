/**
 * ei added 20150713
 */
(function(){
    'use strict';
    angular
        .module("youla")
        .directive('htmlHeaderNav', [
            'funcs', directiveFn
        ])
        .controller('htmlHeaderNavCtrl', [
            '$scope',
            '$log',
            'funcs',
            'dataFactory',
            'authFactory',
            'CacheFactory',
            '$state',
            'naturalService',
            htmlHeaderNavCtrlFn
        ]);

    function htmlHeaderNavCtrlFn($scope, $log, funcs, dataFactory, authFactory, CacheFactory, $state, naturalService) {
        var vm = this;

        $scope.$watch(authFactory.isLoggedIn, function(newVal, oldVal){
            $scope.isLoggedIn = newVal;
        });

        $scope.url = $state.current.url;
        $scope.state_name = $state.current.name;

    }


    function directiveFn(funcs) {
        return {
            restrict: 'A',
            scope: {},
            transclude: true,
            replace: true,
            templateUrl: function(elem, attr) {return funcs.getTemplate(elem, attr, 'htmlHeaderNav.html')},
            controller: 'htmlHeaderNavCtrl as vm',
            link: linkFunction
        };

        function linkFunction(scope, elem, attrs){



        }
    }

}());
