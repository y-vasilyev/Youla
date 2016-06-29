(function(){
    'use strict';
    angular
        .module("youla")
        .factory('httpErrorInterceptor', [
            '$q',
            '$rootScope',
            httpInterceptorfn
        ]);
    function httpInterceptorfn($q, $rootScope){
        return {
            request: function(config){
                return config;
            },
            responseError: function(response){
                var code = response.status;
                $rootScope.serverError = false;
                $rootScope.serverErrorCode = null;

                for(var i = 450; i <= 599; i++){
                    // console.log(i)
                    if(code == i){
                        $rootScope.serverError = true;
                        $rootScope.serverErrorCode = code;

                        //console.log("Ops we got server error :" +code)
                        $rootScope.$emit('loading:show');

                    }
                }

                return $q.reject(response);
            }
        };
    }

}());
