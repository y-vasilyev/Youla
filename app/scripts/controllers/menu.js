(
    function(){
        "use strict";

        angular
            .module('youla')
            .controller('menuCtrl', [
                '$scope',
                'authFactory',
                '$location',
                '$state',
                '$timeout',
                'API_CONSTANT',
                'funcs',
                '$rootScope',
                loginFn
            ]);

        function loginFn($scope, authFactory, $location, $state, $timeout,
        				 API_CONSTANT, funcs, $rootScope){

            var vm = this;

            $scope.isItemActive = function(item){
                var location = window.location.href;
                if(location.indexOf(item) > -1){
                    return true;
                }
            };

            $scope.$on("UserLogOut", function(){
                $scope.isDisabled = true;
            });


            $scope.isDisabled = true;
            authFactory.getMe()
                .then(function(result){
		            $scope.isDisabled = false;
                    $scope.user = result;
                }
            );

            //check screen width and convert it to 70% of width as menu width
            $scope.menuWidth = Math.round(( 70 / 100) * window.innerWidth);


        }
    }());
