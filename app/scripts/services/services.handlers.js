(function(){
    'use strict';
    angular
        .module('services.handlers', [])
        .factory('handlersFactory', [
            '$rootScope',
            '$state',
            '$log',
            '$window',
            'store',
            'API_CONSTANT',
            '$timeout',
            'dataFactory',
            'authFactory',
            'funcs',
            '$location',
            '$stateParams',
            '$injector',

            controllerFn
        ]);

    function controllerFn($rootScope, $state, $log, $window, store, API_CONSTANT, $timeout, dataFactory, authFactory, funcs,
                           $location, $stateParams, $injector){

        return {

            nonlogHandler: function(vm, $scope){
                var handlersFactory = this;

                //dubl code 20150821_1003
                $scope.popup_signup = function($event){
                    funcs.popup_create(
                        $event,
                        vm,
                        $scope,
                        'login/signup-inner.html',
                        '',
                        '',
                        'signupEmailHandler'
                    );
                };
            },

            //------------------------------------
            signupEmailHandler: function(vm, $scope){
                $scope.noAccountYet = false;

                $scope.logout = authFactory.logout;

                $scope.genreList = funcs.genreList;

                $scope.user = {};
                $scope.signUp = function(isValid){
                    var o = $scope.user;

                    var isFormErrors = [];

                    if (o.Email != o.Email_too) {
	                    isFormErrors.push('Email не совпадают');
	                }

                    if (!isFormErrors.length) {
                        $scope.errorMessage = '';

		            	o.BirthDate = moment(o.BirthDate_set, 'DD.MM.YYYY').format();

                        authFactory.signUpEmail(o)
                       	.then(function(res) {

                            if(res.code === 400){
                                $scope.errorMessage = res.message;
                                return;
                            }

                            $scope.popup_close();

                            authFactory.getMe()
                                .then(function(userData){
    				                $rootScope.userInfo = userData;
                                    funcs.afterLogin(vm, $scope, userData);
                                }
                            );

                        });
                	} else {
                    	$scope.errorMessage = isFormErrors.join('<br />');
                	}
                };


            },

            emptyHandler: function(vm, $scope, $event) {
            },

            orggeoHandler: function(vm, $scope, $event) {
	            funcs.page_orgGeo($scope, vm);
            },

            //-------------------------------------
            loginHandler: function(vm, $scope, $event){
                $scope.$watch(authFactory.isLoggedIn, function(newVal, oldVal){
                    $scope.isLoggedIn = newVal;
                });

                $scope.logout = authFactory.logout;

                $scope.userLogin = {};

                $scope.loginEmail = function(){
                    authFactory.logout();

                    var promise = authFactory.loginEmail($scope.userLogin);
                    promise.then(function(res){

                        if(res.code === 400) {
                            $scope.is_error = true;

                            $('#field-email').focus(function(){
                                $scope.noAccountYet = false;
                                $scope.errorMessage1 = '';
                            });

                            $('#field-password').focus(function(){
                                $scope.errorMessage = '';
                                $scope.errorMessage1 = '';
                            });

                            if(res.message === undefined){
                                $scope.errorMessage = 'Looks like you don\'t have an account yet!';
                                $scope.noAccountYet = true;
                                return;
                            } else{
                                $scope.errorMessage1 = 'Please check your login and password';
                                return;
                            }

                        }

                        if ($scope.popup_close) {
                            $scope.popup_close();
                        }

                        authFactory.getMe()
                            .then(function(userData){
				                $rootScope.userInfo = userData;
                                funcs.afterLogin(vm, $scope, userData);
                            }
                        );

                    });
                };

                //dubl code 20150727_1006
                $scope.popup_login = function($event){
                    funcs.popup_create(
                        $event,
                        vm,
                        $scope,
                        'login/login-inner.html',
                        '',
                        '',
                        'loginHandler'
                    );
                };

                $scope.showPopupForgetPassword = function($event){
                    $scope.forgetUser = {};

                    vm.submit = function($event){
                        if(!$scope.forgetUser.UserLogin){
                            $scope.errorMessage = 'Please, fill in password field';

                            $event.preventDefault();
                        } else{

                            var obj = $scope.forgetUser;
                            var promise = authFactory.forgetPassword(obj);
                            promise.then(function(response){
                                if(response.serverSuccess == true){
                                    funcs.popup_create(
                                        $event,
                                        vm,
                                        $scope,
                                        'login/password-send-inner.html',
                                        '',
                                        'forgetPassword',
                                        'passwordHandler'
                                    );
                                } else{
                                    $scope.errorMessage = response.error.data.detail;
                                }
                            });

                        }
                    };

                    funcs.popup_create(
                        $event,
                        vm,
                        $scope,
                        'login/password-inner.html',
                        '',
                        'forgetPassword',
                        'passwordHandler'
                    );
                };

            },

            passwordHandler: function(vm, $scope){
                //dubl code 20150727_1006
                $scope.popup_login = function($event){
                    funcs.popup_create(
                        $event,
                        vm,
                        $scope,
                        'login/login-inner.html',
                        '',
                        '',
                        'loginHandler'
                    );
                };
            },

            uploadPhotoHandler: function(vm, $scope){

                $scope.showTempImage = false;
                vm.visibility = [];
                vm.localImage = store.get('userAvatar');
                vm.myCroppedImage = '';
                $scope.privacy = {};
                $scope.isDisabled = {};
                $scope.showButton = false;

                vm.cropImage = '';

                var handleFileSelect = function(evt){
                    var file = evt.currentTarget.files[0];
                    var reader = new FileReader();
                    reader.onload = function(evt){
                        $scope.$apply(function($scope){
                            $scope.showButton = true;
                            $scope.cropImage = evt.target.result;
                            $scope.showTempImage = true;
                        });
                    };
                    reader.readAsDataURL(file);
                };

                $timeout(function(){
                    angular.element(document.querySelector('#fileInput')).on('change', handleFileSelect);
                }, 1000);

                $scope.uploadFile = function(){
                    var userPk = $scope.user.Id;

                    window.localStorage.setItem('localPic', JSON.stringify(vm.myCroppedImage));

                    $rootScope.userProfileLocal = vm.myCroppedImage;
                    $rootScope.$broadcast("UpdateProfilePicture");

                    var file = funcs.dataURItoBlob(vm.myCroppedImage);
                    var uploadUrl = API_CONSTANT.Host + '/Attachments/AddAttachment?EntityType=777&EntityId='+userPk;
                    funcs.uploadFileToUrl(file, uploadUrl, function(){
                        $scope.popup_close();

		                $window.localStorage.removeItem('ME');

                        authFactory.getMe()
                            .then(function(result){
                                $scope.user = result;

                                $rootScope.$broadcast('user.change', {"user": result});
                            }
                        );


                    }, function(){
                    });
                };

            }

            //-------------------------------------

        };

    }

}());
