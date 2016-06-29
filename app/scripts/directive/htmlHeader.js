/**
 * ei added 20150712
 */
(function(){
    'use strict';
    angular
        .module("youla")
        .directive('htmlHeader', [
            'funcs', directiveFn
        ])
        .controller('htmlHeaderCtrl', [
            '$scope',
            '$log',
            '$timeout',
            'funcs',
            'dataFactory',
            'authFactory',
            '$state',
            'handlersFactory',

            htmlHeaderCtrlFn
        ]);

    function htmlHeaderCtrlFn($scope, $log, $timeout, funcs, dataFactory, authFactory, $state, handlersFactory) {
        var vm = this;

        if(window.localStorage.getItem('ME')){
            $scope.ME = JSON.parse(window.localStorage.getItem("ME"));
            $scope.user = $scope.ME;
        }

        $scope.$on('user.change', function(event, args) {
        	$scope.ME = args.user;
            $scope.user = $scope.ME;
        });


        $scope.$watch(authFactory.isLoggedIn, function(newVal, oldVal){
            $scope.isLoggedIn = newVal;
        });

        //dubl code 20150821_1003
        $scope.popup_signup = function($event) {
            funcs.popup_create(
            	$event,
            	vm,
            	$scope,
            	'login/signup-inner.html',
                '',
                '',
                'signupEmailHandler'
            );
        };

        //dubl code 20150727_1006
        $scope.popup_login = function($event){
            funcs.popup_create(
            	$event,
            	vm,
            	$scope,
            	'login/login-inner.html',
                '',
                '',
                'loginHandler'
            );
        };
    }


    function directiveFn(funcs) {
        return {
            restrict: 'A',
            scope: {},
            replace: true,
            templateUrl: function(elem, attr) {return funcs.getTemplate(elem, attr, 'htmlHeader.html')},
            controller: 'htmlHeaderCtrl as vm',
            link: linkFunction
        };

        function linkFunction(scope, elem, attrs){
        	scope.type = attrs.type;
        }
    }

}());
