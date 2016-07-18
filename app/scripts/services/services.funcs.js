(function() {
    'use strict';
    angular
        .module("youla")
        .factory('funcs', [
            '$rootScope',
            '$log',
            'API_CONSTANT',
            'dataFactory',
            'authFactory',
            'CacheFactory',
            'store',
            '$injector',
            '$timeout',
            '$state',
            '$stateParams',
            '$document',
            '$http',
            '$q',
            'naturalService',
            'ngDialog',
            'uiGridConstants',

            controllerFn
        ]);

    function controllerFn($rootScope, $log, API_CONSTANT, dataFactory, authFactory, CacheFactory, store,
    						$injector, $timeout,
    						$state, $stateParams,
    						$document, $http, $q, naturalService, ngDialog, uiGridConstants
    ) {


        var vm = this;


        return {

        	gis_key : 'ruvnwl3272',

        	city_status2title : {
        		"New" : "Новая",
        		"Assigned" : "Занята пользователем",
        		"InWork" : "В работе",
        		"Closed" : "Закрыта"
        	},

        	status2class : {
        		"New" : "new",
        		"OnCheck" : "check",
        		"Declined" : "cancel",
        		"Approved" : "ok"
        	},
        	status2title : {
        		"New" : "Новая",
        		"OnCheck" : "На проверке",
        		"Declined" : "Отклонена",
        		"Approved" : "Одобрена"
        	},
        	zone_status2title : {
        		"New" : "Новая",
        		"OnCheck" : "На проверке",
        		"Declined" : "Отклонена",
        		"Approved" : "Одобрена"
        	},

        	PaymentMethod2title : {
        		"Sberbank" : "Карта сбербанка",
        		"MobilePhone" : "На мобильный телефон",
        		"Card" : "Карта банка",
        		"YandexMoney" : "На яндекс-деньги"
        	},

        	PaymentType2title : {
        		"OnDemand" : "по запросу",
        		"Auto" : "автоплатеж"
        	},

        	zoneType2title : {
        		"Card" : "Карточка",
        		"Feature" : "Геоинформация"
        	},

			genreList : [
                {text: 'Мужской', value: "Male"},
                {text: 'Женский', value: "Female"}
            ],

			EntityTypes : {
				1 :	['Territory', 'Территория'],
				2 : ['CyclePlan', 'Цикловой план']
				/*
				3 : TerritoryInCycle	Территория в рамках циклового плана
				4	Vorwand	Зацепка
				5	VerificationTask	Задача выверки ССИ
				6	Audit	Аудит
				7	Card	Карточка
				8	Building	Строение
				9	Anchor	Якорь
				666	Comment	Комментарий
				777	Userpic	Аватарка пользователя
				*/
			},

			FeatureList : [
				{
					'id' : 8000,
					'title' : 'Здание'
				},

				{
					'id' : 37000,
					'title' : 'Парковка'
				},

				{
					'id' : 21000,
					'title' : 'Достопримечательность'
				},

				{
					'id' : 6000,
					'title' : 'Забор'
				},

				{
					'id' : 7000,
					'title' : 'Проход / проезд'
				},

				{
					'id' : 19000,
					'title' : 'Остановка'
				},

				{
					'id' : 26004,
					'title' : 'Пешеходная дорожка'
				},

				{
					'id' : 40000,
					'title' : 'Вход в здание'
				},

				{
					'id' : 12000,
					'title' : 'Якорь (где находится организация в здании)'
				}
			],
			    /*
				8000 : ['Buildings', 'Здание'],
				37000	ParkingLots 	Парковка
                21000	Sights 	Достопримечательность
                6000	Fence 	Забор
                7000	Passage 	Проход / проезд
                19000	PublicTransportStop 	Остановка
                26004	Footpath 	Пешеходная дорожка
                40000	Entrances 	Вход в здание
                12000 	Anchors 	Якорь (где находится организация в здании)
              */

			checkWorking : function(obj) {
			    var that = this;

				var r = {"status" : "ok"};

				var o = obj.Schedule;

				var invalid = false;

				var hindex = [];

                o.forEach(function(item, index) {
                	if (!item.ScheduleDays.length) {
		            	invalid = true;
                	} else {

                	}

                	var w0 = item.workStartHour|0;
                	var w1 = item.workStartMin|0;
                	var w2 = item.workEndHour|0;
                	var w3 = item.workEndMin|0;

                	var e0 = item.breakStartHour|0;
                	var e1 = item.breakStartMin|0;
                	var e2 = item.breakEndHour|0;
                	var e3 = item.breakEndMin|0;

                	var ws = w0*60+w1;
                	var we = w2*60+w3;
                	var es = e0*60+e1;
                	var ee = e2*60+e3;

                	item.Work[0] = ws;
                	item.Work[1] = we;

                	item.Break[0] = es;
                	item.Break[1] = ee;

                	hindex.push([item.ScheduleDays, ws, we]);

                	var find = false;
                	var i, l = hindex.length, e, ref;
                	for (i=0; i < l; i++) {
                		e = hindex[i];

                		if (index != i) {
                			ref = that.array_intersect(item.ScheduleDays, e[0]);

                			if (Object.keys(ref).length && ((ws >= e[1] && ws < e[2]) || (we >= e[1] && we < e[2]))) {
                				find = true;
                				break;
                			}
                		}
                	}

                	if (find) {
		            	invalid = true;
                	}

                	if (ws > we || es > ee) {
		            	invalid = true;
                	}

                	if (!item.Roundday) {

                		if (!w0 && !w1 && !w2 && !w3) {
			            	invalid = true;
			            }

	                	if (item.BreakExists) {
	                		if (!(es >= ws && ee <= we)) {
				            	invalid = true;
	                		}
	                	}
                	}
                });

                if (invalid) {
                	r.status = 'error';
                }

				return r;
			},

        	map_init : function(id, $scope, vm, callback) {
                var root = jQuery('#'+id);

                var already = root.hasClass('leaflet-container');

                var map;

                if (!already) {


                	L.Icon.Default.imagePath = '/bower_components/leaflet/dist/images/'

                    map = new L.map(id, {
                        center: [54.9802, 82.8980],
                        zoom: 18
                    });

                    root[0]['mapObject'] = map;

                } else {
                	map = root[0]['mapObject'];
                }

                callback(map);
            },

            grab_money : function($event, $scope, vm) {
                $event.preventDefault();

                dataFactory.grabMoney()
                	.then(function(result) {

						$scope.grabMessage = result.data.Message;
                	}
                );
            },

        	page_home : function($scope, vm) {
        	    var funcs = this;

                $scope.gridOptions = {
                    enableSorting: true,
                    onRegisterApi: function( gridApi ) {
                      $scope.grid2Api = gridApi;
                    },
                    columnDefs: [
                      {
                        field: 'BranchName',
                        displayName : 'Город',
                        type :'string',
                        cellTemplate : '<div class="ui-grid-cell-contents"><a ui-sref="app.city({id:row.entity.city_id})">{{grid.getCellValue(row, col)}}</a></div>'
                      },
                      {
                        field: 'TerritoryName',
                        displayName : 'Зона',
                        type :'string',
                        cellTemplate : '<div class="ui-grid-cell-contents"><a ui-sref="app.city({id:row.entity.TerritoryId})">{{grid.getCellValue(row, col)}}</a></div>'
                      },
                      {
                        field: 'Collected',
                        displayName : 'Всего собрано',
                        type :'number'
                      },
                      {
                        field: 'OnCheck',
                        displayName : 'На проверке',
                        type :'number'
                      },
                      {
                        field: 'Accepted',
                        displayName : 'Принято',
                        type :'number'
                      },
                      {
                        field: 'Declined',
                        displayName : 'Отклонено',
                        type :'number'
                      },
                      {
                        field: 'TotalEarned',
                        displayName : 'Заработано',
                        type :'number'
                      },
                      {
                        field: 'TotalPayed',
                        displayName : 'Оплачено',
                        type :'number'
                      }
                    ]
                };

                dataFactory.getUserHistory()
                	.then(function(result) {
                		$scope.gridOptions.data = result.data.Territories;
                	}
                );

                dataFactory.getMoney()
                	.then(function(result) {
                		$scope.data = result.data;
                	}
                );

                $scope.grabWasDid = false;

                vm.grab_money = function($event) {
                	funcs.grab_money($event, $scope, vm);
                };
        	},


        	page_money : function($scope, vm) {
        	    var funcs = this;
        	    var that = this;

                $scope.gridMoneyHistory = {
                    enableSorting: true,
                    onRegisterApi: function( gridApi ) {
                      $scope.grid2Api = gridApi;
                    },
                    columnDefs: [
                      {
                        field: 'Date',
                        displayName : 'Дата',
                        type :'string',
                        cellTemplate : '<div class="ui-grid-cell-contents">{{grid.getCellValue(row, col)*1000 | date:\'dd.MM.yyyy\'}}</div>'
                      },
                      {
                        field: 'Payment',
                        displayName : 'Сумма',
                        type :'string'
                      },
                      {
                        field: 'PaymentMethodTitle',
                        displayName : 'способ',
                        type :'string',
                      },
                      {
                        field: 'TypeTitle',
                        displayName : 'тип',
                        type :'string'
                      }
                    ]
                };

                dataFactory.getMoney()
                	.then(function(result) {
                		$scope.data = result.data;

                		var c = $scope.data['BillingItems'];
                		var i, l = c.length, e;
                		for (i=0; i < l; i++) {
                			e = c[i];
                			e.PaymentMethodTitle = that.PaymentMethod2title[e.PaymentMethod];
                			e.TypeTitle = that.PaymentType2title[e.Type];
                		}

                		$scope.gridMoneyHistory.data = c;
                	}
                );

                $scope.grabMessage = '';
                vm.grab_money = function($event) {
                	funcs.grab_money($event, $scope, vm);
                };

                vm.get_moneyHistory = function($event) {
                    $event.preventDefault();

               		$scope.is_visible_moneyHistory = true;
                };

        	},



        	page_zone : function($scope, vm) {
        	    var funcs = this;
        	    var that = this;

                $scope.gridOptions = {
                    enableSorting: true,
                    onRegisterApi: function( gridApi ) {
                      $scope.grid2Api = gridApi;
                    },
                    columnDefs: [
                      {
                        field: 'Name',
                        displayName : 'Организация',
                        type :'string',
                        cellTemplate : '<div class="ui-grid-cell-contents"><a ui-sref="app.{{row.entity.url}}({id:row.entity.Id})">{{grid.getCellValue(row, col)}}</a></div>'
                      },
                      {
                        field: 'TypeTitle',
                        displayName : 'Тип',
                        type :'string'
                      },
                      {
                        field: 'CreationDateUtc',
                        displayName : 'Создана',
                        type :'date',
                        cellTemplate : '<div class="ui-grid-cell-contents">{{grid.getCellValue(row, col) | date:\'dd.MM.yyyy\'}}</div>'
                      },
                      {
                        field: 'StatusTitle',
                        displayName : 'Статус',
                        type :'string'
                      },
                      {
                        field: 'LastComment',
                        displayName : 'Комментарии',
                        type :'string'
                      }
                    ]
                };

                dataFactory.getZoneData()
                	.then(function(result) {

                		var c = result.data;
                		var i, l = c.length, e;
                		for (i=0; i < l; i++) {
                			e = c[i];
                			e.StatusTitle = that.zone_status2title[e.Status];
                			e.TypeTitle = that.zoneType2title[e.Type];
                			e.url = e.Type == 'Card' ? 'org' : 'geo';
                		}

                		$scope.gridOptions.data = c;

                		$scope.cityTitle = result.data.cityTitle;
                		$scope.zoneTitle = result.data.zoneTitle;
                	}
                );

        	},

        	Schedule_convert : function(item) {

				if(item.Work) {
					item.workStartHour = moment(item.Work[0]).hour();
					item.workStartMin = moment(item.Work[0]).minute();

					item.workEndHour = moment(item.Work[1]).hour();
					item.workEndMin = moment(item.Work[1]).minute();
				}

				item.Break = item.Break || new Array();


				item.breakStartHour = moment(item.Break[0]).hour();
				item.breakStartMin = moment(item.Break[0]).minute();

				item.breakEndHour = moment(item.Break[1]).hour();
				item.breakEndMin = moment(item.Break[1]).minute();

        	},

        	page_org : function($scope, vm, CardType) {
        	    var funcs = this;
        	    var that = this;

        	    var id = $stateParams.id;
        	    var entityType = 4;


        	    $scope.workHours = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];
        	    $scope.workMinutes = [0,10,20,30,40,50];

        	    var repaintOrg = function() {
        	    	var d = $scope.data;

                	$scope.titleOrg = d.CardName;
					$scope.data.CreationDateUtc = moment(d.CreationDateUtc).toDate();
                	$scope.statusOrg = that.status2title[d.Status] || "not find";
                	$scope.statusClassOrg = 'org-info-status-' + that.status2class[d.Status] || "notfind";
        	    };

           		$scope.FeatureList = that.FeatureList;

                dataFactory.getWorkingTpls()
                	.then(function(result) {
                		var d = result.data;

                		$scope.working_tpls = d;
                	}
                );

                dataFactory.getOrgData(id, CardType)
                	.then(function(result) {
                		var d = result.data;

                		d.type = CardType;



        				var o = d.Schedule;

						if(o) {
							o.forEach(function (item, index) {
								that.Schedule_convert(item);
							});
						}



                		$scope.data = d;

                		repaintOrg();

                	    funcs.map_init('mapOrg', $scope, vm, function(map) {

                	    	$scope.map = map;

                	    	if (d.Coordinates && d.Coordinates.Lat && d.Coordinates.Lon) {

                	    		map.setView([d.Coordinates.Lat, d.Coordinates.Lon], 16);

                	    		$scope.marker = L.marker([d.Coordinates.Lat, d.Coordinates.Lon]);

                	    		map.addLayer($scope.marker);
                	    	}
                	    });




                		vm.hasWorkingErrors = false;

                        vm.geo_edit = function($event, id) {
                            funcs.popup_create(
                                $event,
                                vm,
                                $scope,
                                'orgGeo.html',
                                '1024px',
                                '',
                                'orggeoHandler'
                            );
                        };


                        $scope.saveForm = function(isValid) {
                            var o = $scope.data;


                            dataFactory.saveOrgData(o.Id, CardType, o)
                                .then(function(response) {
                                    if (response.status === 200) {
										console.log(response);

                                		$scope.data = o;
                                		repaintOrg();

                                        $scope.messageStatusVisible = true;
                                        $timeout(function() {
	                                    	$scope.messageStatusVisible = false;
                                        }, 2000);

                                    }
                                }
                            );

                        };

                        $scope.sendToCheckForm = function(isValid) {
                            var o = $scope.data;

                            var s = {};
                            s['Id'] = o.id;
                            s['Status'] = 'OnCheck';


                            dataFactory.sendCheckOrg(o)
                                .then(function(response) {
                                    if (response.status === 200) {

                                    	$scope.data['Status'] = 'OnCheck';

                                		repaintOrg();

                                        $scope.messageStatusVisible = true;
                                        $timeout(function() {
	                                    	$scope.messageStatusVisible = false;
                                        }, 2000);

                                    	return that.page_org($scope, vm);
                                    } else {
                                        $scope.messageStatusErrorVisible = true;
                                        $timeout(function() {
	                                    	$scope.messageStatusErrorVisible = false;
                                        }, 2000);
                                    }
                                }
                            );

                        };



                        $scope.checkForm = function(invalid) {
                            var o = $scope.data;

                            if (!o.Contacts.length || !o.Schedule.length) {
                            	invalid = true;
                            } else {
                            	o.Contacts.forEach(function(item) {
                            		if (!item.Value) {
		                            	invalid = true;
		                            	return false;
                            		} else {

                            			if ((item.Type == 'phone' || item.Type == 'fax') && !item.Value.match(/^[\d\s]+$/i)) {
    		                            	invalid = true;
    		                            	return false;
                            			}

                            			if (item.Type == 'email' && !item.Value.match(/^[_a-z0-9]+(\.[_a-z0-9]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i)) {
    		                            	invalid = true;
    		                            	return false;
                            			}

                            			if (item.Type == 'site' && !item.Value.match(/^[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i)) {
    		                            	invalid = true;
    		                            	return false;
                            			}
                            		}
                            	});

                            	var working_check_result = that.checkWorking(o);
                            	vm.hasWorkingErrors = working_check_result.status != 'ok' ? true : false;

                            	if (vm.hasWorkingErrors) {
                            		invalid = true;
                            	}

                            	if (o.status == 'ok') {
                            		invalid = true;
                            	}

                            }

                            return invalid;
                        };

                        $scope.cancelForm = function($event) {
                        	var TerritoryId = $scope.data.TerritoryId;

			                $state.go('app.zone', {id:TerritoryId});
                        };


                        vm.contactDel = function($event, index) {
			                $scope.data.Contacts.splice(index, 1);
                        };

                        vm.contactAdd = function($event) {
                        	var type = vm.contactAddVal;
			                $scope.data.Contacts.push({
                    				"Type" : type,
                    				"Value" : "",
                    				"Comment" : ""
                    			}
			                );

			                vm.contactAddVal = '';
                        };



                        vm.workingDayToggle = function(index, val) {
			                var c = $scope.data.Schedule[index].ScheduleDays;

			                var j = c.indexOf(val);
			                if (j == -1) {
								c.push(val);
			                } else {
				                c.splice(j, 1);
			                }
                        };
                        vm.workingDel = function($event, index) {
			                $scope.data.Schedule.splice(index, 1);
                        };
                        vm.workingAdd = function($event) {
                            var o = {
                    			"ScheduleDays" : [],
                    			"Work" : [0,0],
                    			"Кoundday" : false,
                    			"Break" : [0,0],
                    			"BreakExists" : false
                    		};

                        	that.Schedule_convert(o);

			                $scope.data.Schedule.push(o);
                        };

                        vm.addWorking = function($event) {
                        	var o = vm.addWorkingVal.Schedule;

			                $scope.data.Schedule.push(o);

			                vm.addWorkingVal = '';
                        };



                        //---------------------
                        dataFactory.getComments(id, entityType)
                        	.then(function(result) {
                        		var d = result.data.data;

                        		$scope.Comments = d;
                        	}
                        );
                        vm.commentAdd = function($event) {
                            authFactory.getMe()
                                .then(function(userData) {

                                	var comment = {
                                		"EntityId" : id,
                                		"Type" : entityType,
										"CreatedBy" : userData.DisplayName,
                               			"Text" : vm.newcomment
                               		};

                                    dataFactory.addComment(comment)
                                    	.then(function(response) {
		                                    if (response.status === 200) {
    		           			                $scope.Comments.push(comment);
    		           			                vm.newcomment = '';
                                    		} else {

                                    		}
                                    	}
                                    );
                                }
                            );

                            $event.preventDefault();
                        };
                        //---------------------
                        //---------------------
                        dataFactory.getAttachments(id, entityType)
                        	.then(function(result) {
                        		var d = result.data.data;

                        		$scope.files = d;


                        		$scope.loadAttach = function($event, $attach) {
					                $event.preventDefault();

                                    dataFactory.getAttachmentContent($attach['Uid'])
                                    	.then(function(result) {
                                    		var d = result.data.data;

                                    		$scope.files = d;


                                    		$scope.loadAttach = function($event, $attach) {
            					                $event.preventDefault();

            					                console.log($attach);

                                    		};
                                    	}
                                    );

                        		};
                        	}
                        );



                	}
                );

        	},

        	page_orgGeo : function($scope, vm) {
        	    var funcs = this;


        	    var d = $scope.data;

                $scope.data2 = d;

                $scope.position = {};
       	    	if (d.Coordinates.Lat && d.Coordinates.Lon) {
	                $scope.position.lat = d.Coordinates.Lat;
	                $scope.position.lng = d.Coordinates.Lon;
	            }

	            $scope.data2.search_near = {};

                var search_do = function(map) {
    				DG.then(function () {
                        var latLng = [$scope.position.lat, $scope.position.lng];

                        DG.ajax({
                            url: 'http://catalog.api.2gis.ru/geo/search',
                            data: {
                                key: funcs.gis_key,
                                version: 1.3,
                                q: latLng[1] + ',' + latLng[0]
                            },
                            success: function(data) {
                                var address = '';

                                var object = data.result && data.result.length ? data.result[0] : {};

                                if (object) {
                                    address = object.name;

                                    DG.ajax({
                                        url: 'http://catalog.api.2gis.ru/geo/search',
                                        data: {
                                            key: funcs.gis_key,
                                            version: 1.3,
                                            q: latLng[1] + ',' + latLng[0],
                                            types : 'house',
                                            radius: 250,
                                    		limit: 100
                                        },
                                        success: function(data) {

                                            $timeout(function() {
            	                                $scope.geo_search = data.result;
                                            });
                                        },
                                        error: function(error) {
                                            console.log(error);
                                        }
                                    });

                                } else {

                                }

                                $timeout(function() {
    	                            $scope.data2.address = address;
                                });

                            },
                            error: function(error) {
                                console.log(error);
                            }
                        });


                    });
                };

                $timeout(function() {
                    funcs.map_init('mapGeo', $scope, vm, function(map) {

        	            $scope.geo_select = function() {

        	            	var o = $scope.data2.search_near;

        	            	if (o) {

            	            	var point = DG.Wkt.toPoints(o.centroid);

                                var lat = point[1];
                                var lng = point[0];

            	                $scope.position.lat = lat;
            	                $scope.position.lng = lng;

                                $scope.data2.address = o.name;

                            	map.setView([lat, lng], 16);
                            	$scope.geo_marker.setLatLng([lat, lng]);

    	                        search_do(map);
    	                    }
        	            };

                    	if (d.Coordinates.Lat && d.Coordinates.Lon) {

                    		map.setView([d.Coordinates.Lat, d.Coordinates.Lon], 16);

                    		$scope.geo_marker = L.marker([d.Coordinates.Lat, d.Coordinates.Lon], {draggable : true});
                    		map.addLayer($scope.geo_marker);

                        	$scope.geo_marker.on('dragend', function(event) {
                            	var marker = event.target;
                            	var position = marker.getLatLng();

                                $timeout(function() {
                                    $scope.position.lat = position.lat;
                                    $scope.position.lng = position.lng;

                                    search_do(map);
                                });

                            });

                    	}

                        search_do(map);

                    });
                }, 500);

                vm.submit = function() {
                    var lat = $scope.position.lat;
                    var lng = $scope.position.lng;

                    $scope.data.Coordinates.Lat = lat;
                    $scope.data.Coordinates.Lon = lng;

                    $scope.data.Address.Address = $scope.data2.address;

                	var map = $scope.map;

                	map.setView([lat, lng], 16);
                	$scope.marker.setLatLng([lat, lng]);

                    $scope.popup_close();
                };

                vm.cancel = function($event) {
                    $scope.popup_close();

                    $event.preventDefault();
                };


        	},

        	page_city : function($scope, vm) {
        	    var funcs = this;
        	    var that = this;

        	    var id = $stateParams.id;

                $scope.gridOptions = {
                    enableSorting: true,
                    onRegisterApi: function( gridApi ) {
                      $scope.grid2Api = gridApi;
                    },
                    columnDefs: [
                      {
                        field: 'Name',
                        displayName : 'Зона',
                        type :'string',
                        cellTemplate : '<div class="ui-grid-cell-contents dropdown"><a ui-sref="app.zone({id:row.entity.Id})" class="dropdown-toggle">{{grid.getCellValue(row, col)}}</a>\
          						<ul class="dropdown-menu">\
          							<li>\
        								<a ng-click="grid.appScope.vm.zoneShowOnMap($event, row.entity.Id)" href="#">\
          							  	Показать на карте\
        								</a>\
          							</li>\
          							      \
          							<li ng-if="row.entity.Status == \'New\'">   \
        								<a ng-click="grid.appScope.vm.zoneTakeWork($event, row.entity.Id)" href="#">\
           							     Взять в работу                                         \
        								</a>                                                     \
          							</li>                                                         \
          							                                                               \
          							<li>                                                            \
        								<a ui-sref="app.zone({id:row.entity.Id})">                          \
          							     Открыть                                                      \
        								</a>                                                           \
          							</li>\
								</ul>     \
                        </div>'
                      },
                      {
                        field: 'BuildingsTotal',
                        displayName : 'Стр.',
                        type :'number'
                      },
                      {
                        field: 'TerritoryCost',
                        displayName : 'цена за единицу',
                        type :'number'
                      },
                      {
                        field: 'StatusTitle',
                        displayName : 'Статус',
                        type :'string'
                      }
                    ]
                };


                dataFactory.getCityZones(id)
                	.then(function(result) {
                		var zones = result.data.Territories;
                		$scope.gridOptions.data = zones;
                		$scope.cityTitle = result.data.cityTitle;

		        	    funcs.map_init('mapZone', $scope, vm, function(map) {

		        	        var geo_json = {};

                            vm.zoneShowOnMap = function($event, id) {

                            	var j = that.get_el_by_field(geo_json.features, 'id', id);

                            	var feature = geo_json.features[j];
                            	var layer = feature['featuresLayer'];

                                layer.setStyle({
                                    color: '#ffffff'
                                });

        						map.fitBounds(layer.getBounds());

    		    		        $rootScope.$broadcast('dropDownClose', {});

                            	countryMouseover(id, feature, layer);
                            };
                            vm.zoneTakeWork = function($event, id) {

                            	var j = that.get_el_by_field(geo_json.features, 'id', id);

                            	var feature = geo_json.features[j];
                            	var layer = feature['featuresLayer'];

                            	countryMouseover(id, feature, layer);
                            	countryClick($event, id, feature, layer);
        						map.fitBounds(layer.getBounds());

    		    		        $rootScope.$broadcast('dropDownClose', {});
                            };

                            var countryMouseover = function (id, feature, layer) {
                            	if (!$scope.mapAskWorkShow) {

									$timeout(function() {

                                        layer.setStyle({
                                            color: '#808080'
                                        });
                                        //layer.bringToFront();

                                        $scope.info = feature.properties.info;
                                        $scope.mapInfoShow = true;
                                    });
                                }
                            };
                            var countryMouseout = function (id, feature, layer) {
                            	if (!$scope.mapAskWorkShow) {
									$timeout(function() {

        	                            $scope.mapInfoShow = false;

                                        layer.setStyle({
                                            color: feature.properties.color
                                        });
                                    });
    	                        }
                            };
                            var countryClick = function ($event, id, feature, layer) {

                            	vm.cancel = function($event) {
    	                            $scope.mapAskWorkShow = false;
    	                            $scope.mapInfoShow = false;

                                    layer.setStyle({
                                        color: feature.properties.color
                                    });

                                };

                                vm.submit = function($event) {
                                    dataFactory.setWorkZone(id)
                                        .then(function(res) {
                                            if (res.data.status == 'ok') {

                        						var j = that.get_el_by_field($scope.gridOptions.data, 'Id', id);

                        						$scope.gridOptions.data[j]['Status'] = 'InWork';
                        						$scope.gridOptions.data[j]['StatusTitle'] = that.city_status2title['InWork'];
                                            }
                                        }
                                    );

    	                            $scope.mapInfoShow = false;
    	                            $scope.mapAskWorkShow = false;
                                };

								$timeout(function() {
	                                $scope.mapAskWorkShow = true;
	                            });
                            };



                            geo_json = {
                                "type": "FeatureCollection",
                                "features": []
                            };
                            var i, e, l = result.data.Territories.length, gj, featuresLayer, crds, fillColor;
                            for (i=0; i < l; i++) {
                            	e = result.data.Territories[i];

                            	e.StatusTitle = that.city_status2title[e.Status];

                            	crds = that.kml2crds(e.Kml);
                            	fillColor = e.Color;

                                gj = {
                                      "type": "Feature",
                                      "id": e.Id,
                                      "properties": {name: e.Name, info: e, color: fillColor},
                                      "geometry": {
                                        "type": "Polygon",
                                        "coordinates": [crds]
                                      }
                                };

                    			featuresLayer = new L.geoJson(gj, {
                    				style: function(feature) {
    									return {color: feature.properties.color};
    								},

    								onEachFeature: function (feature, layer) {
                        				//layer.bindPopup(feature.properties.name);

                                        layer.on('click', function(event) {
                                            var o = event.target;

                                            var f = o.feature;

			                                countryClick(event, f.id, f, o);
                                		})

                                        layer.on('mouseover', function(event) {
                                            var o = event.target;

                                            var f = o.feature;

			                                countryMouseover(f.id, f, o);
                                		})
                                        layer.on('mouseout', function(event) {
                                            var o = event.target;

                                            var f = o.feature;

		    	                            countryMouseout(f.id, f, o);
                                		})
                    				}
                                });

                                featuresLayer.addTo(map);

                                gj['featuresLayer'] = featuresLayer;

                                geo_json.features.push(gj);
                            }



                            function geocoding(text, callResponse) {
    		                    //var latLng = [$scope.position.lat, $scope.position.lng];

                    			DG.ajax({
                                    url: 'http://catalog.api.2gis.ru/geo/search',
                                    data: {
                                        key: funcs.gis_key,
                                        version: 1.3,
                                        //q: latLng[1] + ',' + latLng[0],
                                        q: text,
                                        //types: 'house',
                                        radius: 250,
                                        limit: 100
                                    },
                                    success: function(data) {
                                        if (typeof data.result != 'undefined') {
                                            data.result.forEach(function(metro) {
                                                // считываем строку в WKT-формате
                                                //point = L.Wkt.toPoints(metro.centroid);

                                                // извлекаем координаты для маркера
                                                //var lng = point[0];
                                                //var lat = point[1];

                                            });

                                            callResponse(data.result);
                                        } else {

                                        }
                                    },
                                    error: function(error) {
                                        console.log(error);
                                    }
                                });
                            };

                            function formatJSON(rawjson) {
                            	var json = {},
                            		key, loc, disp = [];

                            	for(var i in rawjson) {
                            		key = rawjson[i].name;

                                    var point = DG.Wkt.toPoints(rawjson[i].centroid);

                                    // извлекаем координаты для маркера
                                    var lng = point[0];
                                    var lat = point[1];

                            		loc = DG.latLng(lat, lng);

                            		json[ key ] = loc;	//key,value format
                            	}

                            	return json;
                            };

                            /*
                            map.addControl( new L.Control.Search({
                            		sourceData: geocoding,
                            		formatData: formatJSON,
                            		markerLocation: true,
                            		autoType: false,
                            		autoCollapse: true,
                            		minLength: 2
                            	})
                            );
                            */



                            var latlngs = [];
                            l = geo_json.features.length;
                            for (i=0; i < l; i++) {
                            	e = geo_json.features[i];

                                for (var ii in e.geometry.coordinates) {
                                    var coord = e.geometry.coordinates[ii];

                                    for (var j in coord) {
                                        var points = coord[j];
                                        latlngs.push([points[1], points[0]]);
                                    }
                                }
                            }

    	                    map.fitBounds(latlngs);


		        	    });







                	}
                );
            },

        	page_cities : function($scope, vm) {
        	    var funcs = this;

                $scope.gridOptions = {
                    enableSorting: true,
                    onRegisterApi: function( gridApi ) {
                      $scope.grid2Api = gridApi;
                    },
                    columnDefs: [
                      {
                        field: 'Name',
                        displayName : 'Город',
                        type :'string',
                        cellTemplate : '<div class="ui-grid-cell-contents"><a ui-sref="app.city({id:row.entity.Id})">{{grid.getCellValue(row, col)}}</a></div>'
                      },
                      {
                        field: 'TerritoriesTotal',
                        displayName : 'Всего территорий',
                        type :'number'
                      },
                      {
                        field: 'TerritoriesAvaliable',
                        displayName : 'Доступно территорий',
                        type :'number'
                      }
                    ]
                };



                dataFactory.getCities()
                	.then(function(result) {
                		$scope.gridOptions.data = result.data;
                	}
                );








        	},

        	page_account : function($scope, vm) {
        	    var funcs = this;

                $scope.genreList = this.genreList;

                authFactory.getMe()
                    .then(function(result) {

                    	result.BirthDate_set = moment(result.BirthDate).format('DD.MM.YYYY');

                        $scope.user = result;
                        vm.user = $scope.user;


                        $scope.popup_upload_photo = function($event) {
                            funcs.modal_create(
                            	$event,
                            	vm,
                            	$scope,
                            	'account/uploadPhoto.html',
                            	'slide-in-up',
                            	'uploadPhotoHandler'
                           	);
                        };

                        vm.hasStoreValue = store.get('userAvatar');
                        if (vm.hasStoreValue) {
                            vm.userAvatarText = 'Edit Picture';
                            vm.userAvatarStatus = vm.hasStoreValue;
                        }
                        else{
                            vm.userAvatarText = 'How about adding Picture';
                        }

                        vm.userAvatarSave = function() {
                            store.set('userAvatar', vm.myCroppedImage);
                            vm.userAvatarStatus = store.get('userAvatar');
                            $scope.closeModal();
                        };



                        $scope.saveForm = function(isValid) {
                            var o = vm.user;

                            var isFormErrors = [];

                            if (o.Email != o.Email_too) {
	                            isFormErrors.push('Email не совпадают');
	                        }

                            if (!isFormErrors.length) {
                                $scope.errorMessage = '';

				            	o.birthday = moment(o.birthday_set, 'DD.MM.YYYY').unix();

                                dataFactory.updateProfile(o)
                                    .then(function(response) {

                                        if (response.status === 200) {
                                        	$scope.messageStatusVisible = true;
                                        	$timeout(function() {
	                                        	$scope.messageStatusVisible = false;
                                        	}, 2000);
                                        }
                                    }
                                );
                            } else {
                                $scope.errorMessage = isFormErrors.join('<br />');
                            }
                        };


                    }
                );
            },


            afterLogin : function(vm, $scope, userData) {

        	    var funcs = this;

                if (typeof $scope.modal != 'undefined') {
	                $scope.modal.hide();
                }

                $state.transitionTo('app.cities', null, {'reload': true});
            },

            popup_create : function($event, vm, $scope, $tpl, width, cssMobile, handlerMethod, isCheckLogin) {
                var that = this;

                if (typeof isCheckLogin == 'undefined') {
                	isCheckLogin = true;
                }

            	var timeout = 0;
                if ($scope.popup_close) {
                	$scope.popup_close();
                	$scope.popup_close = null;
                	timeout = 300;
                }

                $timeout(function() {
                    var popup = ngDialog.open({
                        template: that.getTemplate(null, null, $tpl, isCheckLogin),
                        scope : $scope,
                        width: !width ? '770px' : width,
                        className: that.isDesktop() ? 'ngdialog-theme-default' : cssMobile
                    });

                    $scope.popup_close = function($event) {
                    	$event = $event || null;

                        popup.close();

                        if (vm.popup_closed) {
                        	vm.popup_closed($event);
                        }

                        if ($event) {
        	                $event.preventDefault();
        	            }

	                	$scope.popup_close = null;
                    };

                    if (handlerMethod) {
	                    $injector.get('handlersFactory')[handlerMethod](vm, $scope, $event);
	                }
                }, timeout);

                if ($event) {
	                $event.preventDefault();
	            }
            },

            modal_create : function($event, vm, $scope, $tpl, animation, handlerMethod) {
                var that = this;

            	var timeout = 0;
                if ($scope.popup_close) {
                	$scope.popup_close();
                	$scope.popup_close = null;
                	timeout = 300;
                }

                $timeout(function() {
                    if (that.isDesktop()) {
                    	that.popup_create($event, vm, $scope, $tpl, '', '', handlerMethod);

                    } else {
                    	//animation: animation
                        var popup = ngDialog.open({
                            template: that.getTemplate(null, null, $tpl, isCheckLogin),
                            scope : $scope,
                            width: '770px',
                            className: 'ngdialog-theme-default'
                        });


                        $scope.popup_close = function($event) {
                        	$event = $event || null;

                            popup.close();

                            if (vm.popup_closed) {
                            	vm.popup_closed($event);
                            }

                            if ($event) {
            	                $event.preventDefault();
            	            }

    	                	$scope.popup_close = null;
                        };

		                if (handlerMethod) {
        		            $injector.get('handlersFactory')[handlerMethod](vm, $scope, $event);
        		        }
                    }
                }, timeout);

                if ($event) {
	                $event.preventDefault();
	            }
            },

            kml2crds : function(kml) {
            	var crds = [];

            	var m = kml.match(/^.*?<coordinates>([^<]+)<\/coordinates>.*?$/im);
            	if (m) {
            		m = m[1].split(/[\r\n]+/im);

            		var l = m.length, i, e;
            		if (l) {
            			for (i=0; i < l; i++) {
            				e = m[i].split(',');

            				crds.push(e);
            			}
            		}
            	}

                return crds;
            },

            get_el_by_field : function(arr, f, v) {
            	for (var i=0, m = arr.length; i < m; i++) {
            		if (typeof arr[i] != 'undefined' && arr[i][f] == v) {
            			return i;
            		}
            	}
            	return -1;
            },

            array_diff : function(array) {	// Computes the difference of arrays
            	//
            	// +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)

            	var arr_dif = [], i = 1, argc = arguments.length, argv = arguments, key, key_c, found=false;

            	// loop through 1st array
            	for ( key in array ) {
            		// loop over other arrays
            		for (i = 1; i< argc; i++) {
            			// find in the compare array
            			found = false;
            			for (key_c in argv[i]) {
            				if (argv[i][key_c] == array[key]) {
            					found = true;
            					break;
            				}
            			}

            			if (!found) {
            				arr_dif[key] = array[key];
            			}
            		}
            	}

            	return arr_dif;
            },

            array_intersect : function(arr1) { // eslint-disable-line camelcase
              //  discuss at: http://locutus.io/php/array_intersect/
              // original by: Brett Zamir (http://brett-zamir.me)
              //      note 1: These only output associative arrays (would need to be
              //      note 1: all numeric and counting from zero to be numeric)
              //   example 1: var $array1 = {'a' : 'green', 0:'red', 1: 'blue'}
              //   example 1: var $array2 = {'b' : 'green', 0:'yellow', 1:'red'}
              //   example 1: var $array3 = ['green', 'red']
              //   example 1: var $result = array_intersect($array1, $array2, $array3)
              //   returns 1: {0: 'red', a: 'green'}

              var retArr = {}
              var argl = arguments.length
              var arglm1 = argl - 1
              var k1 = ''
              var arr = {}
              var i = 0
              var k = ''

              arr1keys: for (k1 in arr1) { // eslint-disable-line no-labels
                arrs: for (i = 1; i < argl; i++) { // eslint-disable-line no-labels
                  arr = arguments[i]
                  for (k in arr) {
                    if (arr[k] === arr1[k1]) {
                      if (i === arglm1) {
                        retArr[k1] = arr1[k1]
                      }
                      // If the innermost loop always leads at least once to an equal value,
                      // continue the loop until done
                      continue arrs// eslint-disable-line no-labels
                    }
                  }
                  // If it reaches here, it wasn't found in at least one array, so try next value
                  continue arr1keys// eslint-disable-line no-labels
                }
              }

              return retArr
            },

            get_max_id : function(arr) {
            	var ret = 1;
              	for (var i=0, m = arr.length; i < m; i++) {
              		if (arr[i]['id'] > ret) {
              			ret = arr[i]['id'];
              		}
              	}
              	return ret;
            },

            fixedEncodeURIComponent : function(str) {
            	return encodeURIComponent(str).replace(/[!'()*]/g, function(c) {
                	return '%' + c.charCodeAt(0).toString(16);
              	});
            },

            setCursorPosition : function(input) {
            	input.selectionStart = input.value.length;
            },

            arrayJoinByField : function(arr, field) {
            	var ret = [];
              	for (var i=0, m = arr.length; i < m; i++) {
              		ret.push(arr[i][field]);
              	}

                return ret.join(' ');
            },

            arrayFindElByField : function(c, ffield, val, field, def) {
                var ret = def;
            	var j = this.get_el_by_field(c, ffield, val);
            	if (j != -1) {
            		ret = c[j][field];
            	}

                return ret;
            },

            arrayClone : function(c) {
            	var r = [];
            	for (var i=0, l = c.length; i < l; i++) {
            		r.push(c[i]);
            	}
                return r;
            },

            arraysEqual : function(a, b) {
            	if (a === b) {
              		return true;
              	}
              	if (a == null || b == null) {
              		return false;
              	}
              	if (a.length != b.length) {
              		return false;
              	}

              	// If you don't care about the order of the elements inside
              	// the array, you should sort both arrays here.

              	for (var i = 0; i < a.length; ++i) {
                	if (a[i] !== b[i]) {
                		return false;
                	}
              	}
              	return true;
            },

            dataURItoBlob : function(dataURI) {
                var byteString, mimestring;
                if (dataURI.split(',')[0].indexOf('base64') !== -1) {
                    byteString = atob(dataURI.split(',')[1]);
                } else{
                    byteString = decodeURI(dataURI.split(',')[1]);
                }
                mimestring = dataURI.split(',')[0].split(':')[1].split(';')[0];
                var content = [];
                for(var i = 0; i < byteString.length; i++) {
                    content[i] = byteString.charCodeAt(i);
                }
                return new Blob([new Uint8Array(content)], {type: mimestring});
            },

            uploadFileToUrl : function(file, uploadUrl, callback_success, callback_error) {
                var fd = new FormData();
                fd.append('image', file);
                $http({
                    method: 'POST',
                    url: uploadUrl,
                    data: fd,
                    transformRequest: angular.identity,
                    headers: {
                        'Content-Type': undefined,
                        'Authorization': authFactory.authToken()
                    }
                })
                    .success(function(res) {
                        callback_success();
                    })
                    .error(function(res) {
                        callback_error();
                    });
            },

            getQueryString : function(Param, url) {
                return decodeURI(url.replace(new RegExp("^(?:.*[&?]" + encodeURI(Param).replace(/[.+*]/g, "$&") + "(?:=([^&]*))?)?.*$", "i"), "$1"));
            }


            //------------------
        };

    }

}());
