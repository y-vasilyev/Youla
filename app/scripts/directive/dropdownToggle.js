(function(){
    'use strict';
    angular
        .module("youla")
        .directive('dropdownToggle', [
            '$rootScope',
            directiveFn
        ]);
    function directiveFn($rootScope){
        return {
            restrict: 'C',
            link: linkFunction
        };

        function linkFunction(scope, element, attrs) {
	        var el = jQuery(element);

	        el.bind('click', function(e) {
	        	var parent = el.parent();
	        	parent.toggleClass('open');

	        	e.preventDefault();

	            var find = parent.find('.dropdown-menu');


	            var top = el.offset().top;
	            top = top - 40;
	            find.css({top: top});


	            return false;
	        });

	        el.parent().find('.dropdown-close-button').bind('click', function(e) {
	        	el.parent().removeClass('open');
	        });

            $rootScope.$on('dropDownClose', function(event, args) {
	        	el.parent().removeClass('open');
            });

	        jQuery(document).unbind('click').bind('click', function(e) {
	        	var el = jQuery(e.target);

	            var find = el.parents('.dropdown-menu');
	            if (!find.length || el.hasClass('dropdown-close-button')) {
					jQuery('.dropdown').removeClass('open');
				}
	        });
        }
    }

}());
