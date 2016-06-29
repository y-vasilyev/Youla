(function(){
    'use strict';
    angular
        .module("youla")
        .factory('authInterceptor', [
            '$q',
            '$location',
            authInterceptorFn
        ]);

    function authInterceptorFn($q, $location){
        return {
            request: function(config){
                config.headers = config.headers||{};
                var token = window.localStorage.getItem('authToken');

                if(token){
                    //config.headers.Cookie = token;
                }
                return config;
            },
            responseError: function(response){
                if(response.status == 401){
                    window.localStorage.removeItem('authToken');
                }
                return $q.reject(response);
            }
        };

    }

}());
