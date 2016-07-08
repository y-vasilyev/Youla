(function(){
    'use strict';
    angular
        .module('configuration', ['restangular'])
        .constant('API_CONSTANT', {
            user_agent: 'curl/7.37.1',
            Host: '/api/',
            Accept: 'application/json'
        })
          .config(['RestangularProvider', 'API_CONSTANT', '$logProvider', '$httpProvider',
        		function(RestangularProvider, API_CONSTANT, $logProvider, $httpProvider) {

            RestangularProvider.setBaseUrl(API_CONSTANT.Host);
            RestangularProvider.setFullResponse(true);
            RestangularProvider.setDefaultHttpFields({cache: false});
            RestangularProvider.setDefaultHeaders({
                    // 'User-Agent': API.user_agent,
                    //'Host': API_CONSTANT.Host,
                    Accept: API_CONSTANT.Accept
                    //version: API.version,x1
                    //content_type: API.content_type
                    //token: 'x-restangular'
                }
            );

            $logProvider.debugEnabled(true);//this is default angular log provider

            $httpProvider.interceptors.push('httpErrorInterceptor');
            $httpProvider.interceptors.push('authInterceptor');
        }
        ])

        .run(function($state, $rootScope, authFactory, $timeout,
        				$stateParams, Restangular, funcs
        				) {


            $rootScope.$on('$stateChangeSuccess', function(evt, toState){
                if(toState.pageTitle){
                    document.title = toState.pageTitle;
                }
            });
        });

}());
