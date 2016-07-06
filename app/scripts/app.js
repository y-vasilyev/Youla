(function(){
    'use strict';

    angular
        .module('youla', [
            'configuration',
            'services.data',
            'services.handlers',
            'ui.router',
            'ngAnimate',
            'restangular',
            'services.auth',
            'angular-cache',
            'smoothScroll',
            'angular-storage',//for local storage
            'ngMap',//testing for directions
            'ngImgCrop',//for image cropping
            'focus-if',
            'naturalSort',
            'camera',
            'ngPicturefill',
            'MassAutoComplete'
            , 'ngCookies'
            , 'ngMockE2E'
            , 'nemLogging'
            , 'moment-picker'
            , 'ngDialog'
            , 'ui.grid'
        ])

    	.directive('stRatio',function(){
            return {
              link:function(scope, element, attr){
                var ratio=+(attr.stRatio);

                element.css('width',ratio+'%');

              }
            };
        })
        .run(function($httpBackend, $rootScope, $location, $timeout, $window, $state, $stateParams) {

        	var useMock = true;
        	useMock = false;


        	var versionNew = 3;
            var version = !$window.localStorage['version'] ? 1 : $window.localStorage['version'];

            if (version != versionNew) {
            	$window.localStorage.clear();

            	$window.localStorage['version'] = versionNew;
            }

			if (useMock) {
            	var ME = {
            		"Id" : 1,
            		"Email" : "president@kremlin.ru",
            		"PhoneNumber" : "79009652345",
            		"Sex" : "Male", //Male, Female
            		"DisplayName" : "Vladimir Vladimirovich",
            		"BirthDate" : "1976-06-02T13:37:03.9200000",

            		"PaymentScheduleType" : "OnDemand", //OnDemand, Auto
            		"MinPaymentLimit" : 500,

            		"PaymentMethodType" : "Sberbank", //Sberbank, MobilePhone, Card, YandexMoney
            		"payTypeSber" : "sber234",
            		"payTypePhoneNumber" : "phone123",
            		"payTypeCard" : "card123",
            		"payTypeYandex" : "yandex1234",

            		"Registered" : "1996-06-02T13:37:03.9200000"
            	};

                ME = !$window.localStorage['ME'] ? ME : JSON.parse($window.localStorage['ME']);

            	var Territories = [
                	{
                		"id" : 1,
                		"BranchName" : "Ханты",
                		"TerritoryName" : "Зона 1",
                	    "TerritoryId" : 5,
                	    "city_id" : 21,
                		"Collected" : 50,
                		"OnCheck" : 10,
                		"Accepted" : 20,
                		"Declined" : 5,
                		"TotalEarned" : 400,
                		"TotalPayed" : 0
                	},
                	{
                		"id" : 2,
                		"BranchName" : "Кызыл",
                		"TerritoryName" : "Зона 2",
                	    "TerritoryId" : 15,
                	    "city_id" : 23,
                		"Collected" : 30,
                		"OnCheck" : 15,
                		"Accepted" : 17,
                		"Declined" : 4,
                		"TotalEarned" : 300,
                		"TotalPayed" : 100
                	}
            	];

            	var CrowdBranch = [
                	{
                		"Id" : 1,
                		"Name" : "Ханты",
                		"TerritoriesTotal" : 50,
                		"TerritoriesAvaliable" : 20
                	},
                	{
                		"Id" : 2,
                		"Name" : "Кызыл",
                		"TerritoriesTotal" : 70,
                		"TerritoriesAvaliable" : 10
                	}
            	];

            	var city_zones = [
                	{
                		"Id" : 1,
                		"Name" : "Зона 1",
                		"BuildingsTotal" : 50,
                		"CardCost" : 20,
                		"TerritoryCost" : 200,
                		"Status" : "New", // New, Assigned, InWork, Closed
                		"Color" : "#e04040",
                		"Kml" : "<kml xmlns=\"http://www.opengis.net/kml/2.2\"><Document><name>Абакан</name><Placemark id=\"4\"><name>А01 Северный_1</name><visibility>true</visibility><Polygon><outerBoundaryIs><LinearRing><coordinates>91.4146555555556,53.7463666666667\r\n91.4249743855775,53.7419246857938\r\n91.4283161376262,53.7416573379296\r\n91.4285102435168,53.7433718096024\r\n91.4265386018191,53.7434607304882\r\n91.4265712953357,53.7464289979044\r\n91.417735702571,53.7466456257986</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark><mapName xmlns=\"\">Абакан</mapName></Document></kml>"
                	},
                	{
                		"Id" : 2,
                		"Name" : "Зона 2",
                		"BuildingsTotal" : 50,
                		"CardCost" : 10,
                		"TerritoryCost" : 300,
                		"Status" : "Assigned",
                		"Color" : "#30e040",
                		"Kml" : "<kml xmlns=\"http://www.opengis.net/kml/2.2\"><Document><name>Абакан</name><Placemark id=\"4\"><name>А02 Северный_2</name><visibility>true</visibility><Polygon><outerBoundaryIs><LinearRing><coordinates>91.4266416666667,53.7464444444444\r\n91.4401135581647,53.7461813868233\r\n91.4402170311797,53.7433881398299\r\n91.4399441024862,53.7431704617501\r\n91.426493477718,53.7434346230328</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark><mapName xmlns=\"\">Абакан</mapName></Document></kml>"
                	},
                	{
                		"Id" : 3,
                		"Name" : "Зона 3",
                		"BuildingsTotal" : 20,
                		"CardCost" : 30,
                		"TerritoryCost" : 600,
                		"Status" : "InWork",
                		"Color" : "#9040e0",
                		"Kml" : "<kml xmlns=\"http://www.opengis.net/kml/2.2\"><Document><name>Абакан</name><Placemark id=\"4\"><name>А03 Северный рынок</name><visibility>true</visibility><Polygon><outerBoundaryIs><LinearRing><coordinates>91.4357,53.7432777777778\r\n91.4417668821543,53.7430830667719\r\n91.4415301793095,53.7392475784875\r\n91.4396967823258,53.7372972199644\r\n91.4382185240069,53.7360530774042\r\n91.431245274471,53.739101504487\r\n91.4300572872162,53.7396946376426\r\n91.4322475443173,53.7414798801307\r\n91.433093547821,53.7411065144616\r\n91.4337372779846,53.7416490432754\r\n91.4325118025129,53.742218393475\r\n91.4320336268136,53.7433073955645</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark><mapName xmlns=\"\">Абакан</mapName></Document></kml>"
                	},
                	{
                		"Id" : 4,
                		"Name" : "Зона 4",
                		"BuildingsTotal" : 40,
                		"CardCost" : 24,
                		"TerritoryCost" : 500,
                		"Status" : "Closed",
                		"Color" : "#e0d040",
                		"Kml" : "<kml xmlns=\"http://www.opengis.net/kml/2.2\"><Document><name>Абакан</name><Placemark id=\"4\"><name>А04 2ГИС</name><visibility>true</visibility><Polygon><outerBoundaryIs><LinearRing><coordinates>91.4163055555556,53.7454638888889\r\n91.4248319606038,53.7417067817976\r\n91.4165314870918,53.7352429982223\r\n91.4136012623229,53.7367684746134\r\n91.4132654306988,53.7404951450798\r\n91.4132443475222,53.743119213776\r\n91.4144377159307,53.7441314779214\r\n91.4146465362897,53.7442964982546\r\n91.4149503557283,53.744532262375\r\n91.4152721414899,53.7448145583584\r\n91.4156181235392,53.7449697945163</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark><mapName xmlns=\"\">Абакан</mapName></Document></kml>"
                	},
                	{
                		"Id" : 5,
                		"Name" : "Зона 5",
                		"BuildingsTotal" : 30,
                		"CardCost" : 22,
                		"TerritoryCost" : 400,
                		"Status" : "Closed",
                		"Color" : "#e04090",
                		"Kml" : "<kml xmlns=\"http://www.opengis.net/kml/2.2\"><Document><name>Абакан</name><Placemark id=\"4\"><name>А05 Преображенский</name><visibility>true</visibility><Polygon><outerBoundaryIs><LinearRing><coordinates>91.4247583333333,53.7417333333333\r\n91.4309983633561,53.7389770057393\r\n91.4276188645619,53.7363139359112\r\n91.4213407563313,53.7390471152234</coordinates></LinearRing></outerBoundaryIs></Polygon></Placemark><mapName xmlns=\"\">Абакан</mapName></Document></kml>"
                	}
            	];

            	var zone_data = [
                	{
                		"Id" : 1,
                		"Name" : "Аптека ромашка",
                		"Type" : "Card",
                		"CreationDateUtc" : "2016-06-10T13:37:03.9200000",
                		"Status" : "New", //New, OnCheck, Declined, Approved
                		"LastComment" : ""
                	},
                	{
                		"Id" : 2,
                		"Name" : "Аптека радуга",
                		"Type" : "Feature",
                		"CreationDateUtc" : "2016-05-03T13:37:03.9200000",
                		"Status" : "OnCheck",
                		"LastComment" : ""
                	},
                	{
                		"Id" : 3,
                		"Name" : "Холидей",
                		"Type" : "Card",
                		"CreationDateUtc" : "2015-06-03T13:37:03.9200000",
                		"Status" : "Declined",
                		"LastComment" : ""
                	},
                	{
                		"Id" : 4,
                		"Name" : "Аптека 1222",
                		"Type" : "Card",
                		"CreationDateUtc" : "2014-06-16T13:37:03.9200000",
                		"Status" : "New",
                		"LastComment" : "не указано время работы"
                	},
                	{
                		"Id" : 5,
                		"Name" : "Аптека 888888",
                		"Type" : "Card",
                		"CreationDateUtc" : "2016-07-16T13:37:03.9200000",
                		"Status" : "New",
                		"LastComment" : ""
                	},
                	{
                		"Id" : 6,
                		"Name" : "Игрушки ООО",
                		"Type" : "Card",
                		"CreationDateUtc" : "2016-08-16T13:37:03.9200000",
                		"Status" : "Approved",
                		"LastComment" : "прекрасная работа вован"
                	}
            	];

            	var org_data = {
            	    "Id" : 10,
            	    "TerritoryId" : 5,
            	    "BranchId" : 21,
            	    "Status" : "New", //New, OnCheck, Declined, Approved

            		"CardName" : "Радуга, артека, ООО",

            		"FeatureClass" : 26004,

            		"Coordinates" : {
                		"Lat" : 56.27405206657268,
                		"Lon" : 43.931236267089844
            		},
            		"Address" : {
            			"AddressSynCode" : '',
            			"Address" : "",
	            		"AddressComment" : "адрес уточняется"
            		},//"Ханты-мансийск, ул Ленина, 12",
            		"Contacts" : [
            			{
            				"Type" : "phone",
            				"Value" : "34556777",
            				"Comment" : "домашний"
            			},
            			{
            				"Type" : "site",
            				"Value" : "fff.com",
            				"Comment" : ""
            			},
            			{
            				"Type" : "email",
            				"Value" : "test@test.ru",
            				"Comment" : ""
            			}
            		],
            		"Rubrics" : ["Аптека", "ртуальные услыги", "оргопедия"],
            		"CreationDateUtc" : "2012-08-16T13:37:03.9200000",
            		"Schedule" : [
            			{
            			 	"ScheduleDays" : [5],
            			 	"Work" : [570, 1100],
            			 	"RoundDay" : false,
            			 	"Break" : [840, 900],
            			 	"BreakExists" : true,
            			 	"Comment" : "тра ляля"
            			},
            			{
            			 	"ScheduleDays" : [6,7],
            			 	"Work" : [670, 1230],
            			 	"RoundDay" : false,
            			 	"Break" : [0,0],
            			 	"BreakExists" : false,
            			 	"Comment" : ""
            			}
            		],
            		"Additional" : "Есть фай фай",
            		"Comment" : "Красное зданяииезазабором "
            	};

            	var working_tpls = [
            		{
            		Name : "Типичный раб день",
            		Schedule :
            		{
            			"Comment" : "есть",
            		 	"ScheduleDays" : [1,2,3],
            		 	"Work" : [770, 1310],
            		 	"Roundday" : false,
            		 	"Break" : [800, 940],
            		 	"BreakExists" : true
            		}},
            		{
            		Name : "нети ипичный раб день",
            		Schedule :
            		{
            			"Comment" : "ага",
            		 	"ScheduleDays" : [7],
            		 	"Work" : [570, 1110],
            		 	"Roundday" : false,
            		 	"Break" : [0,0],
            		 	"BreakExists" : false
            		}
            		}
            	];
                working_tpls = !$window.localStorage['working_tpls'] ? working_tpls : JSON.parse($window.localStorage['working_tpls']);


            	var user_money = {
            		"Balance" : 3202,
            		"CardsCount" : 278,
            		"TotalEarned" : 12200,
            		"TotalPayed" : 9000,
            		"BillingItems" : [
                    	{ //BillingHistoryItem
                    		"Date" : 1340904508,
                    		"PaymentMethod" : "Sberbank",
                    		"Payment" : 400,
                    		"Type" : "OnDemand"
                    	},
                    	{
                    		"Date" : 1330904508,
                    		"PaymentMethod" : "YandexMoney",
                    		"Payment" : 500,
                    		"Type" : "Auto"
                    	},
                    	{
                    		"Date" : 1340900508,
                    		"PaymentMethod" : "Sberbank",
                    		"Payment" : 600,
                    		"Type" : "OnDemand"
                    	},
                    	{
                    		"Date" : 1340604508,
                    		"PaymentMethod" : "Sberbank",
                    		"Payment" : 300,
                    		"Type" : "Auto"
                    	},
                    	{
                    		"Date" : 1340904508,
                    		"PaymentMethod" : "Card",
                    		"Payment" : 200,
                    		"Type" : "OnDemand"
                    	},
                    	{
                    		"Date" : 1340904008,
                    		"PaymentMethod" : "MobilePhone",
                    		"Payment" : 100,
                    		"Type" : "OnDemand"
                    	}
            		]
            	};





    			$httpBackend.
          			whenPOST(/auth/).
          			respond(function(method, url, data) {
       	 				var user = angular.fromJson(data);

       	 				var AuthResponse = {
       	 					"sessionId" : "sessionId-123",
       	 					"userName" : ME.DisplayName,
       	 					"responseStatus" : {}
       	 				};


        				return [200, AuthResponse, {}];
      				}
      			);

    			$httpBackend.
          			whenPOST(/register/).
          			respond(function(method, url, data) {
       	 				var user = angular.fromJson(data);

       	 				user = angular.merge(ME, user);

        				return [200, user, {}];
      				}
      			);

    			$httpBackend.
          			whenPOST(/auth\/logout/).
          			respond(function(method, url, data) {


        				return [200, 'OK', {}];
      				}
      			);

    			$httpBackend.
          			whenGET(/profile/).
          			respond(ME);

    			$httpBackend.
          			whenGET(/billing\/stat/).
          			respond(Territories);

    			$httpBackend.
          			whenGET(/reference\/crowdBranches/).
          			respond(CrowdBranch);

    			$httpBackend.
          			whenGET(/Branch\/\d+\/Territories/).
          			respond({zones: city_zones, cityTitle:'Ашхабад'});

    			$httpBackend.
          			whenGET(/Reference\/ScheduleTemplates/).
          			respond(working_tpls);



          			    var Comments = [
                			{
                			 	"CreatedBy" : "Оля",
                			 	"Text" : "добавьте лук"
                			},
                			{
                			 	"CreatedBy" : "Лукое",
                			 	"Text" : "и пшено"
                			},
                			{
                			 	"CreatedBy" : "Иван",
                			 	"Text" : "и рис"
                			}
            			];

    			$httpBackend.
          			whenPOST(/Comments\/Add/).
          			respond(function(method, url, data) {
          				var ret = {'status' : 'ok'};

    	            	Comments = !$window.localStorage['Comments'] ? Comments : JSON.parse($window.localStorage['Comments']);

       	 				var comment = angular.fromJson(data);

       	 				Comments.push(comment);

    		            $window.localStorage['Comments'] = JSON.stringify(Comments);

        				return [200, ret, {}];
      				}
      			);

    			$httpBackend.
          			whenPOST(/register\/recoverPassword/).
          			respond(function(method, url, data) {
          				var ret = {'status' : 'ok'};


        				return [200, ret, {}];
      				}
      			);

    			$httpBackend.
          			whenGET(/Comments/).
          			respond(function(method, url, data) {

          				var j = url.match(/EntityId=(\d+)&Type=(\d+)/i);

          				var id = j[1]|0;
          				var Type = j[2]|0;

    	            	Comments = !$window.localStorage['Comments'] ? Comments : JSON.parse($window.localStorage['Comments']);

          				var ret = {'data' : Comments};

        				return [200, ret, {}];
      				}
      			);

      			/*
    			$httpBackend.
          			whenGET(/Attachments\/File\/\d+/).
          			respond(function(method, url, data) {

          				var j = url.match(/(\d+)/i);

          				var Uid = j[1]|0;

          				var ret = {'data' : files};

        				return [200, ret, {}];
      				}
      			);
      			*/

          			    var files = [
                			{
                			 	"Uid" : "11111111111",
                			 	"EntityType" : 1,
                			 	"EntityId" : 1,
                			 	"FileName" : "kremlin.jpg",
                			 	"Length" : 120000
                			},
                			{
                			 	"Uid" : "2222222222",
                			 	"EntityType" : 2,
                			 	"EntityId" : 1,
                			 	"FileName" : "kremlin.avi",
                			 	"Length" : 130000000
                			}
            			];

    			$httpBackend.
          			whenGET(/Attachments\/\d+\/\d+/).
          			respond(function(method, url, data) {

          				var j = url.match(/(\d+)\/(\d+)/i);

          				var id = j[1]|0;
          				var Type = j[2]|0;

    	            	files = !$window.localStorage['files'] ? files : JSON.parse($window.localStorage['files']);

          				var ret = {'data' : files};

        				return [200, ret, {}];
      				}
      			);

    			$httpBackend.
          			whenGET(/verificationResults\/(Card|Feature)\/\d+/).
          			respond(function(method, url, data) {
          				var id = url.match(/^.*?(\d+)$/i)[1]|0;

    		            org_data = !$window.localStorage['ORG'] ? org_data : JSON.parse($window.localStorage['ORG']);

          				org_data['Id'] = id;
          				org_data['TerritoryId'] = id*2;
          				org_data['BranchId'] = id*3;

          				var ret = {'data' : org_data};

        				return [200, ret, {}];
      				}
      			);

    			$httpBackend.
          			whenGET(/verificationResults/).
          			respond({list: zone_data, cityTitle:'Ашхабад', zoneTitle:'Зона 1'});


    			$httpBackend.
          			whenPATCH(/verificationResults\/(Card|Feature)\/\d+/).
          			respond(function(method, url, data) {
          				var ret = {'status' : 'ok'};

       	 				var data = angular.fromJson(data);

          				var saveData = {};
          				Object.keys(org_data).forEach(function(key) {
          					if (typeof data[key] != 'undefined') {
    	      					saveData[key] = data[key];
          					}
          				});

    		            $window.localStorage['ORG'] = JSON.stringify(saveData);

        				return [200, ret, {}];
      				}
      			);

    			$httpBackend.
          			whenPOST(/verificationResults\/changeStatus/).
          			respond(function(method, url, data) {
          				var ret = {'status' : 'ok'};

       	 				var data = angular.fromJson(data);

          				var saveData = angular.fromJson($window.localStorage['ORG']);
          				Object.keys(data).forEach(function(key) {
          					if (typeof data[key] != 'undefined') {
    	      					saveData[key] = data[key];
          					}
          				});

       					saveData['Status'] = 'OnCheck';

    		            $window.localStorage['ORG'] = JSON.stringify(saveData);

        				return [200, ret, {}];
      				}
      			);

    			$httpBackend.
          			whenPOST(/Territories\/Assign/).
          			respond(function(method, url, data) {
          				var ret = {'status' : 'ok'};

       	 				var data = angular.fromJson(data);

          				var id = data['TerritoryId'];


        				return [200, ret, {}];
      				}
      			);


    			$httpBackend.
          			whenGET(/billing\/billingHistory/).
          			respond({data: user_money});

    			$httpBackend.
          			whenPOST(/billing\/postPaymentRequest/).
          			respond(function(method, url, data) {
          				var ret = {'status' : 'ok', "Message" : "запрос на получение денег отправлен и оплата будет произведена в течении одного рабочего дня"};

        				return [200, ret, {}];
      				}
      			);

    			$httpBackend.
          			whenPATCH(/profile\/change/).
          			respond(function(method, url, data) {
          				var ret = {'status' : 'ok'};

       	 				var data = angular.fromJson(data);

          				var saveData = {};
          				Object.keys(ME).forEach(function(key) {
          					if (typeof data[key] != 'undefined') {
    	      					saveData[key] = data[key];
          					}
          				});

    		            $window.localStorage['ME'] = JSON.stringify(saveData);

        				return [200, ret, {}];
      				}
      			);



        		$httpBackend.
          			whenGET(/.*/).
          			passThrough();
        	}
			else
			{
				$httpBackend.
					whenGET(/.*/).
					passThrough();
				$httpBackend.
					whenPOST(/.*/).
					passThrough();

				$httpBackend.
					whenPATCH(/.*/).
					passThrough();
			}






			$rootScope.$on("$stateChangeSuccess", function(event, toState, toParams, fromState, fromParams) {
               	if (typeof $stateParams.scroll != 'undefined') {
               		var top = angular.element(document.querySelector('#'+$stateParams.scroll)).prop('offsetTop')+200;

               		$timeout(function() {
						//.scrollTo(0, top, true);
               		}, 700);

               	} else {
               	 	//.scrollTop(true);
               	}
  			});


        })
        .config(function($stateProvider, $urlRouterProvider, $locationProvider, API_CONSTANT, $provide){
            $locationProvider.html5Mode(true);


            var isDesktop_cache;
            var isDesktop = function() {
                var isDesktop = true;
                return isDesktop;
            };

            var getTemplate = function(elem, attr, template) {
                template = 'templates/'+template;
                return template;
            };

            $provide.decorator('funcs', function($delegate) {
            	$delegate.isDesktop = isDesktop;
            	$delegate.getTemplate = getTemplate;

                return $delegate;
            });

            $stateProvider
                .state('app', {
                    url: '/',
                    abstract: true,
                    authenticate: false,
                    templateUrl: function(elem, attr){
                        return getTemplate(elem, attr, 'menu.html');
                    },
                    controller: 'menuCtrl as vm',
                    cache: false

                })
                .state('app.about', {
                    url: 'about',
                    cache: true,
                    authenticate: false,
                    pageTitle: 'About',
                    views: {
                        'menuContent': {
                            templateUrl: function(elem, attr){
                                return getTemplate(elem, attr, 'about/about.html');
                            },
                            controller: 'aboutCtrl as vm'
                        }
                    }
                })
                .state('app.contacts', {
                    url: 'contacts',
                    pageTitle: 'Contacts',
                    views: {
                        'menuContent': {
                            templateUrl: function(elem, attr){
                                return getTemplate(elem, attr, 'about/contacts.html');
                            },
                            controller: 'aboutCtrl as vm'
                        }
                    }
                })
                .state('app.faq', {
                    url: 'faq',
                    pageTitle: 'FAQ',
                    cache: true,
                    authenticate: false,
                    views: {
                        'menuContent': {
                            templateUrl: function(elem, attr){
                                return getTemplate(elem, attr, 'about/faq.html');
                            },
                            controller: 'aboutCtrl as vm'
                        }
                    }
                })
                .state('confirm', {
                    url: 'confirm',
                    templateUrl: 'confirm.html',
                    controller: 'loginCtrl as vm'

                })
                .state('email-confirm', {
                    url: 'confirmations/:confirmationCode',
                    templateUrl: 'email-confirmation.html',
                    controller: 'confirmationCtrl as vm'
                })
                .state('app.404', {
                    url: '404',
                    authenticate: false,
                    cache: true,
                    pageTitle: '404',
                    views: {
                        'menuContent': {
                            templateUrl: function(elem, attr){
                                return getTemplate(elem, attr, '404.html');
                            },
                            controller: 'ctrl404 as vm'
                        }
                    }
                })
                .state('app.index', {
                    url: '',
                    authenticate: false,
                    cache: true,
                    pageTitle: 'Youla',
                    views: {
                        'menuContent': {
                            templateUrl: function(elem, attr){
                                return getTemplate(elem, attr, 'index.html');
                            },
                            controller: 'ctrlIndex as vm'
                        }
                    }
                })
                .state('app.account', {
                    url: 'account',
                    authenticate: true,
                    cache: false,
                    pageTitle: 'Account Settings | youla.com ',
                    views: {
                        'menuContent': {
                            templateUrl: function(elem, attr){
                                return getTemplate(elem, attr, 'account/settings.html');
                            },
                            controller: 'settingsCtrl as vm'
                        }
                    }
                })
                .state('app.home', {
                    url: 'home',
                    authenticate: true,
                    views: {
                        'menuContent': {
                            templateUrl: function(elem, attr){
                                return getTemplate(elem, attr, 'account/home.html');
                            },
                            controller: 'homeCtrl as vm'
                        }
                    }
                })
                .state('app.money', {
                    url: 'money',
                    authenticate: true,
                    views: {
                        'menuContent': {
                            templateUrl: function(elem, attr){
                                return getTemplate(elem, attr, 'account/money.html');
                            },
                            controller: 'moneyCtrl as vm'
                        }
                    }
                })
                .state('app.cities', {
                    url: 'cities',
                    authenticate: true,
                    views: {
                        'menuContent': {
                            templateUrl: function(elem, attr){
                                return getTemplate(elem, attr, 'cities.html');
                            },
                            controller: 'citiesCtrl as vm'
                        }
                    }
                })
                .state('app.city', {
                    url: 'city/{id:int}',
                    authenticate: true,
                    views: {
                        'menuContent': {
                            templateUrl: function(elem, attr){
                                return getTemplate(elem, attr, 'city-zones.html');
                            },
                            controller: 'cityCtrl as vm'
                        }
                    }
                })
                .state('app.zone', {
                    url: 'zone/{id:int}',
                    authenticate: true,
                    views: {
                        'menuContent': {
                            templateUrl: function(elem, attr){
                                return getTemplate(elem, attr, 'zone.html');
                            },
                            controller: 'zoneCtrl as vm'
                        }
                    }
                })
                .state('app.org', {
                    url: 'org/{id:int}',
                    authenticate: true,
                    views: {
                        'menuContent': {
                            templateUrl: function(elem, attr){
                                return getTemplate(elem, attr, 'org.html');
                            },
                            controller: 'orgCtrl as vm'
                        }
                    }
                })
                .state('app.geo', {
                    url: 'geo/{id:int}',
                    authenticate: true,
                    views: {
                        'menuContent': {
                            templateUrl: function(elem, attr){
                                return getTemplate(elem, attr, 'org.html');
                            },
                            controller: 'geoCtrl as vm'
                        }
                    }
                }

            );

            // if none of the above states are matched, use this as the fallback
            $urlRouterProvider.otherwise('/404');
        });

    angular.element(document).ready(function(){

        angular.bootstrap(document.getElementById('entryPoint'), ['youla']);
    });

}());
