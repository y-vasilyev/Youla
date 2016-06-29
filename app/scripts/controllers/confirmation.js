/**
 * Created by Andrew on 20/4/15.
 */
(
    function(){
        "use strict";

        angular.module('youla').controller(
            'confirmationCtrl', [
                '$stateParams',
                'authFactory',
                '$state',
                confirmationControllerFn
            ]);

        function confirmationControllerFn($stateParams, authFactory, $state) {

            authFactory.confirmEmail($stateParams.confirmationCode).then(function(isOkay){
                if(!isOkay){
                    // TODO: nice response here
                    alert('Bad confirmation token...');
                    return;
                }

                // TODO: need a flash here!
                $state.go('app.index');
            });

        }
    }()
);
