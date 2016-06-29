(
    function(){
        "use strict";

        angular
            .module('youla')
            .controller('signupEmailCtrl', [
                '$scope',
                'handlersFactory',

                welcomeFn
            ]);

        function welcomeFn($scope, handlersFactory) {
            handlersFactory.signupEmailHandler(this, $scope);
        }

    }()
);
