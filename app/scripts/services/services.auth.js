(function(){
    'use strict';
    angular
        .module('services.auth', [])
        .factory('authFactory', [
            '$log',
            'Restangular',
            'API_CONSTANT',
            '$window',
            '$q',
            '$state',
            '$injector',
            "$rootScope",
            "$cookies",
            authFactoryFn
        ]);

    function authFactoryFn($log, Restangular, API_CONSTANT, $window, $q, $state, $injector, $rootScope, $cookies){


        function saveToken(userData) {
            $window.localStorage.setItem('authToken', JSON.stringify(userData.sessionId));

			$cookies.put('sessionId', userData.sessionId);

            return userData;
        }

        return {
            isLoggedIn: function(){
                return $window.localStorage.getItem('authToken') ? true : false;
            },

            authToken: function(){
                var token = window.localStorage.getItem('authToken');
                return token;
            },

            logout: function(){
                return Restangular.all('auth/logout')
                    .post()
                    .then(function(response){


                        $window.localStorage.removeItem('ME');
                        $window.localStorage.removeItem('authToken');
						$cookies.remove('sessionId');

                        $rootScope.$broadcast("UserLogOut");
                        $state.go('app.index');

                        return true;
                    }, function(error) {
                        return {
                            code: error.status,
                            message: error.data.error_message
                        };
                    }
				);


            },

            signUpEmail: function(data) {

                return Restangular.all('register')
                    .post(data)
                    .then(function(response){
                        return saveToken(response.data);
                    }, function(error) {
                        return {
                            code: error.status,
                            message: error.data.error_message
                        };
                    }
				);

            },

            loginEmail: function(data) {

                return Restangular.all('auth')
                    .post(data)
                    .then(function(response){
                        return saveToken(response.data);
                    }, function(error) {
                        return {
                            code: error.status,
                            message: error.data.Errors.error_message
                        };
                    }
				);

            },

            forgetPassword: function(userData){
                return Restangular.all('/register/recoverPassword')
                    .post(userData, {})
                    .then(function(response){
                        $log.debug("youla server Response success for forget password:" + response.data.fromServer);
                        return {
                            serverResponse: response.state,
                            serverSuccess: true,
                            success: response
                        };
                    }, function(error){
                        $log.debug("Error :", error);
                        return {
                            error: error,
                            serverResponse: error.status,
                            serverSuccess: false
                        };
                    });
            },

            getMe: function(){
                if (0&&$window.localStorage.getItem('ME')) { //!!!test
                    var ME = JSON.parse($window.localStorage.getItem("ME"));

                    var deferred = $q.defer();

                    deferred.resolve(ME);

                    return deferred.promise;

                } else {
                    return Restangular.all('profile')
                        .get('')
                        .then(function(success){

                            $window.localStorage.setItem('ME', JSON.stringify(success.data));
                            return success.data;

                        }, function(error){
                            $log.debug("Error while getting user Me:" + error.status);
                            return error;
                        }
                    );
                }
            }

        };

    }

}());
