(function(){
    'use strict';
    angular
        .module("youla")
        .directive('userLinkWithPic', [
        	'funcs',
        	'authFactory',
            directiveFn
        ]);

    function directiveFn(funcs, authFactory) {
        return {
            restrict: 'A',
            templateUrl: function(elem, attr){
                return funcs.getTemplate(elem, attr, 'user-link-with-pic.html');
            },
            link: linkFunction,
            replace: true
        };

        function linkFunction($scope, element, attrs){
            $scope.logout = authFactory.logout;
        }
    }

}());
