(
    function(){
        "use strict";
        angular
            .module('youla')
            .controller('loginCtrl', [
                '$scope',
                'handlersFactory',
                welcomeFn
            ]);

        function welcomeFn($scope, handlersFactory){
            handlersFactory.loginHandler(this, $scope);
        }
    }()
);
