(function() {
    'use strict';
    angular
        .module('services.data', [])
        .factory('dataFactory', [
            '$log',
            'Restangular',
            'API_CONSTANT',
            '$window',
            'authFactory',
            '$q',
            '$http',
            '$rootScope',
            dataFactoryFn
        ]);

    function dataFactoryFn($log, Restangular, API_CONSTANT, $window, authFactory, $q, $http, $rootScope) {

        return {

            getUserHistory: function() {

                return Restangular.all('billing/stat')
                    .get('', {})
                    .then(function(success){
                        return success;
                    }, function(error){
                        if($rootScope.serverError === false){
                            $log.debug("Error while Loading history:" + error.status);
                        }

                        return error;

                    });

            },

            getCities: function() {

                return Restangular.all('reference/crowdBranches')
                    .get('')
                    .then(function(success){
                        return success;
                    }, function(error){
                        if($rootScope.serverError === false){
                            $log.debug("Error while Loading history:" + error.status);
                        }

                        return error;

                    });

            },

            getWorkingTpls: function() {

                return Restangular.all('Reference/ScheduleTemplates')
                    .get('')
                    .then(function(success){
                        return success;
                    }, function(error){
                        if($rootScope.serverError === false){
                            $log.debug("Error while Loading history:" + error.status);
                        }

                        return error;

                    });

            },

            getCityZones: function(id) {

                return Restangular.all('/Branch/'+id+'/Territories/')
                    .get('', {})
                    .then(function(success){
                        return success;
                    }, function(error){
                        if($rootScope.serverError === false){
                            $log.debug("Error while Loading history:" + error.status);
                        }

                        return error;

                    });

            },

            getComments: function(EntityId, Type) {

                return Restangular.all('Comments')
                    .get('', {EntityId : EntityId, Type : Type})
                    .then(function(success){
                        return success;
                    }, function(error){
                        if($rootScope.serverError === false){
                            $log.debug("Error while Loading history:" + error.status);
                        }

                        return error;

                    });

            },

            addComment: function(data) {

                return Restangular.all('Comments/Add')
                    .post(data)
                    .then(function(success){
                        $log.debug("work zone :" + success);
                        return success;
                    }, function(error){
                        $log.debug("Error while work zone :" + error.status);
                    }
                );
            },

            getAttachments: function(EntityId, Type) {

                return Restangular.all('Attachments/'+EntityId+'/'+Type)
                    .get('', {})
                    .then(function(success){
                        return success;
                    }, function(error){
                        if($rootScope.serverError === false){
                            $log.debug("Error while Loading history:" + error.status);
                        }

                        return error;

                    });

            },

            /*
            getAttachmentContent: function(Uid) {

                return Restangular.all('Attachments/File/'+Uid)
                    .get('', {})
                    .then(function(success){
                        return success;
                    }, function(error){
                        if($rootScope.serverError === false){
                            $log.debug("Error while Loading history:" + error.status);
                        }

                        return error;

                    });

            },
            */

            getZoneData: function(id) {

                return Restangular.all('verificationResults/'+id)
                    .get('')
                    .then(function(success){
                        return success;
                    }, function(error){
                        if($rootScope.serverError === false){
                            $log.debug("Error while Loading history:" + error.status);
                        }

                        return error;

                    });
            },

            getOrgData: function(id, type) {

            	var urlType = type == 'org' ? 'Card' : 'Feature';

                return Restangular.all('verificationResults/'+urlType+'/'+id)
                    .get('')
                    .then(function(success){
                        return success;
                    }, function(error){
                        if($rootScope.serverError === false){
                            $log.debug("Error while Loading org data:" + error.status);
                        }

                        return error;

                    });
            },

            saveOrgData: function(id, type, data) {
            	var urlType = type == 'org' ? 'Card' : 'Feature';

                var sendData = {};
                sendData[urlType] = data;
                console.log(sendData);


                return Restangular.all('verificationResults/'+urlType+'/'+id)
                    .patch(sendData)
                    .then(function(success){
                        $log.debug("org Update data :" + success);
                        return success;
                    }, function(error){
                        $log.debug("Error while saving org data :" + error.status);
                    }
                );
            },

            setWorkZone: function(id) {

                return Restangular.all('Territories/Assign/')
                    .post({TerritoryId : id})
                    .then(function(success){
                        $log.debug("work zone :" + success);
                        return success;
                    }, function(error){
                        $log.debug("Error while work zone :" + error.status);
                    }
                );
            },

            sendCheckOrg: function(data) {

                return Restangular.all('verificationResults/changeStatus')
                    .post(data)
                    .then(function(success){
                        $log.debug("org send check data :" + success);
                        return success;
                    }, function(error){
                        $log.debug("Error while send check org :" + error.status);
                    }
                );
            },

            getMoney: function() {

                return Restangular.all('/billing/billingHistory')
                    .get('')
                    .then(function(success){
                        return success;
                    }, function(error){
                        if($rootScope.serverError === false){
                            $log.debug("Error while Loading history:" + error.status);
                        }

                        return error;

                    });
            },

            grabMoney: function() {

                return Restangular.all('/billing/postPaymentRequest')
                    .post('')
                    .then(function(success){
                        return success;
                    }, function(error){
                        if($rootScope.serverError === false){
                            $log.debug("Error while grab money:" + error.status);
                        }

                        return error;

                    });
            },

            updateProfile: function(updateProfileData) {

                return Restangular.all('profile/change')
                    .patch(updateProfileData)
                    .then(function(success){
                        $log.debug("Profile Update data :" + success);
                        return success;
                    }, function(error){
                        $log.debug("Error while update profile :" + error.status);
                    });

            }

        };

    }

}());
