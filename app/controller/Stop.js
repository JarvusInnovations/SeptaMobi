Ext.define('SeptaMobi.controller.Stop', {
	extend: 'Ext.app.Controller',
	requires: [
	   'Jarvus.util.Polyline'
	],

	config: {
		busDirections: ['NorthBound', 'SouthBound', 'EastBound', 'WestBound'],
		views: [
			'stops.RouteList',
			'stops.RouteMap',
			'schedule.RouteDirections',
			'schedule.RouteDetails',
			'schedule.StopTimes'
		],
		stores: [
			'Buses',
			'BusRoutes',
			'LegacyRoutes',
			'NearByStops',
			'Trains',
			'Trolleys',
			'Stops',
			'StopDirections',
			'StopTimes',
			'Subways'
		],
		models: [
			'RouteDetails'
		],
		refs: {
			mainTabView: 'main',
			navView: 'stops-navview',
			stopsMainView: 'stops-main',
			stopRouteList: {
				selector: 'stops-routelist',
				autoCreate: true,

				xtype: 'stops-routelist'
			},
			routeMap: {
				selector: 'stops-routemap',
				autoCreate: true,

				xtype: 'stops-routemap'
			},
			stopRouteDetailsMap: 'stops-routemap',
			stopTimes: {
				selector: 'schedule-stoptimes',
				autoCreate: true,

				xtype: 'schedule-stoptimes'
			},
			scheduleRoutesList: 'schedule-routeslist',
			routeDirections: {
				selector: 'schedule-routedirections',
				autoCreate: true,

				xtype: 'schedule-routedirections'
			},
			routeDetails: {
				selector: 'schedule-routedetails',
				autoCreate: true,

				xtype: 'schedule-routedetails'
			},
			routeDetailsList: 'schedule-routedetails dataview',
			routeDetailsMap: 'schedule-routedetails leafletmap'
		},
		control: {
			navView: {
				activate: 'onStopsNavViewActivate',
				show: 'onStopsShow'
			},
			stopsMainView: {
				leavescreen: 'onStopsMainLeaveScreen'
			},
			'stops-nearbylist': {
				select: 'onNearbyStopListSelect'
			},
			stopRouteList: {
				activate: 'onRouteListActivate',
				select: 'onStopRoutesSelect'
			},
			routeMap: {
				maprender: 'onRouteMapRender'
			},
			scheduleRoutesList: {
				show: 'onScheduleShow',
				select: 'onScheduleRoutesListSelect',
				leavescreen: 'onListLeaveScreen'
			},
			'schedule-routeslist segmentedbutton': {
				toggle: 'onScheduleRoutesListSegmentedButtonToggle'
			},
			scheduleRouteDetails: {
				leavescreen: 'onListLeaveScreen'
			},
			routeDirections: {
				leavescreen: 'onListLeaveScreen',
				select: 'onScheduleRouteDirectionsSelect'
			},
			routeDetails: {
				leavescreen: 'onScheduleRouteDetailsLeaveScreen'
			},
			'schedule-routedetails dataview': {
				select: 'onScheduleRouteDetailsSelect'
			},
			routeDetailsMap: {
				maprender: 'onRouteDetailsMapRender'
			},
			'schedule-navview button[action=toggleBookmark]': {
				tap: 'onScheduleToggleBookmarkTapped'
			}
		},
		routes: {
			'stops': 'showStops',
			'stops/:id': 'showStopDetails'
		}
	},

	showStops: function() {
		var me = this,
			mainTabView = me.getMainTabView(),
			navView = me.getNavView(),
			stopsMainView = me.getStopsMainView();

		mainTabView.setActiveItem(1);
		navView.pop(stopsMainView);
	},

	showStopDetails: function(id) {
		var me = this,
			nearByStopsStore = Ext.getStore('NearByStops'),
			i = 0, stop;

		if(!nearByStopsStore.isLoaded()) {
			me.updateLocation(function() { me.showStops(id) });
		}
		
		stop = nearByStopsStore.getById(id);

		if (!stop) {
			SeptaMobi.API.routesForStop(id, function(records) {
				me.loadRoutes(id, records);
			});
		} else {
			me.loadRoutes(id, stop.get('routes'));
		}
	},

	loadRoutes: function(stopId, routes) {

		var me = this,
			stopRouteList = me.getStopRouteList(),
			navView = me.getNavView();

		if(routes.length == 1) {
			me.onStopRoutesSelect(stopRouteList, routes[0]);
		}
		else {
			me.pushPath('stops/' + stopId);
			stopRouteList.setStopId(stopId);
			//TODO why is this not showing just the routes that I'm explicitly setting here
			stopRouteList.setData(Ext.Array.map(routes, function(r) {
				if(r.isModel) {
					return r.getData();
				}
				//TODO should this occur in the API method?
				return Ext.create('SeptaMobi.model.Route', r).getData();
			}));
			navView.push(stopRouteList);
		}
	},

	onStopsShow: function(navView, scheduleIndex) {
		var me = this,
			routeStore = Ext.getStore('LegacyRoutes');

		if (!routeStore.isLoaded()) {
			navView.setMasked({
				xtype: 'loadmask',
				message: 'Loading Routes&hellip;'
			});

			routeStore.load({
				callback: function(records, operation, success) {
					navView.setMasked(false);
					me.updateLocation();
				}
			});
		}
	},

	onStopsNavViewActivate: function() {
		this.pushPath('stops');
	},

	onListLeaveScreen: function(list) {
		list.deselectAll();
	},

	onStopsMainLeaveScreen: function(panel) {
		panel.down('stops-nearbylist').deselectAll();
		panel.down('schedule-routeslist').deselectAll()
	},

	updateLocation: function(callback, scope) {
		var me = this,
			navView = me.getNavView(),
			nearByStopsStore = Ext.getStore('NearByStops'),
			stopsLength, routesLength, i, j, routes;

		if (!nearByStopsStore.isLoaded()) {

			navView.setMasked({
				xtype: 'loadmask',
				message: 'Loading Near-By Stops&hellip;'
			});

			if (!me.geo) {
				me.geo = Ext.create('Ext.util.Geolocation', {
					autoUpdate: false,
					listeners: {
						locationupdate: function(geo) {
							SeptaMobi.API.getNearByStops(geo.getLatitude(), geo.getLongitude(), function() {
								navView.setMasked(false);
								if(callback) {
									Ext.callback(callback, scope, nearByStopsStore);
								}
							});
						},
						locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
							if (bTimeout) {
								alert('Location timeout occurred.');
							} else {
								alert('Location error occurred.');
							}
							navView.setMasked(false);
						}
					}
				});
			}
		}

		me.geo.updateLocation();
	},

	onNearbyStopListSelect: function(list, record) {
		var routes = record.get('routes');

		this.loadRoutes(record.get('id'), routes);
		// var me = this,
		// 	navView = me.getNavView(),
		// 	routeStore = Ext.getStore('Routes'),
		// 	routeList = me.getRouteList(),
		// 	routes = record.get('routes'),
		// 	routeLength = routes.length,
		// 	i = 0;

		// if (routeLength == 1) {
		// 	me.onStopRoutesSelect(routeList, routes[0]);
		// } else {
		// 	routeList.setData(Ext.Array.map(routes, function(r) {
		// 		return r.getData()
		// 	}));
		// 	navView.push(routeList);
		// }
	},

	onRouteListActivate: function(list) {
		this.pushPath('stops/' + list.getStopId());
	},

	onStopRoutesSelect: function(list, record) {
		var me = this,
			ll = window.L,
			navView = me.getNavView(),
			busesStore = Ext.getStore('Buses'),
			encodedPoints = [],
			routeMap = me.getRouteMap();

		me.pushPath('stops/routes/' + record.get('id'));

		navView.setMasked({
			xtype: 'loadmask',
			message: 'Loading Route&hellip;'
		});
		
		if (record.get('routeType') == 3) {
			//Load Bus Positions
			busesStore.load({
				params: {
					route: record.get('routeShortName')
				}
			});
		}

		SeptaMobi.model.RouteDetails.load(record.getId(), {
			callback: function(detailsRecord) {
				// detailsRecord.variants().each(function(variant, vindex) {
				// 	encodedPoints.push(variant.get('encodedPoints'));
				// });

				// routeMap.setEncodedPoints(encodedPoints);

				// navView.setMasked(false);
				// navView.push(routeMap);
			}
		});
	},

	/* The following code is very similar to the schedule route map, should consider refactoring shared
		logic in next release */
	onRouteMapRender: function(routeMap) {
		var me = this,
			ll = window.L,
			mapCmp = me.getRouteMap(),
			map = mapCmp.getMap(),
			busStore = Ext.getStore('Buses'),
			buses = busStore.getRange(),
			busLength = buses.length,
			encodedPoints = routeMap.getEncodedPoints(),
			encodedPointsLength = encodedPoints.length,
			stopMarkers = [],
			busMarkers = [],
			i = 0,
			stop, latLng, bounds, decodedPoints, polyLine, infoTemplate, direction;

		for (; i < encodedPointsLength; i++) {
			decodedPoints = Jarvus.util.Polyline.decode(encodedPoints[i]);
			polyLine = ll.polyline(decodedPoints).addTo(map);
			//TODO figure out a better way to get bounds
			if (i == 0) {
				bounds = polyLine.getBounds();
			}
		}

		// polyLine = ll.polyline(decodedPoints).addTo(map);		

		routeMap.setStopMarkers(stopMarkers);
		// routeDetails.setRoutePolyLine(polyLine);

		routeMap.removeBusMarkers();

		//TODO move template to view cfg?
		infoTemplate = Ext.create('Ext.XTemplate', [
			'bus {label}', '<br> to {[values.destination||"<em>unknown destination</em>"]}', '<br>reported {[values.Offset ? (values.Offset+" minutes ago") : "just now"]}'
		]);

		buses.forEach(function(bus) {
			direction = bus.get('Direction');
			if(!Ext.Array.contains(me.config.busDirections, direction)) {
				direction = 'unknown';
			}

			latLng = [bus.get('lat'), bus.get('lng')];

			var marker = ll.marker(latLng, {
				icon: ll.icon({
					iconUrl: 'resources/images/bus-marker-' + direction + '.png',
					iconRetinaUrl: 'resources/images/bus-marker-' + direction + '-2x.png',
					iconSize: [28, 31],
					iconAnchor: [14, 30]
				})
			}).addTo(map);

			setTimeout(function() {
				marker.bindPopup(infoTemplate.apply(bus.getData()));
			}, 1000);

			busMarkers.push(marker);
		});

		routeMap.setBusMarkers(busMarkers);

		Ext.defer(function() {
			map.fitBounds(bounds);
		}, 1000, this);
	},

	onScheduleShow: function(navView, scheduleIndex) {
		var busRouteStore = Ext.getStore('BusRoutes');

		if (!busRouteStore.isLoaded()) {
			navView.setMasked({
				xtype: 'loadmask',
				message: 'Loading Buses&hellip;'
			});

			busRouteStore.load({
				callback: function(records, operation, success) {
					navView.setMasked(false);
				}
			});
		}
	},

	onScheduleRoutesListSegmentedButtonToggle: function(segmentedButton, button, isPressed) {
		var me = this,
			navView = me.getNavView(),
			scheduleRouteList = me.getScheduleRoutesList(),
			busStore = Ext.getStore('BusRoutes'),
			trolleyStore = Ext.getStore('Trolleys'),
			subwayStore = Ext.getStore('Subways'),
			trainStore = Ext.getStore('Trains'),
			selectedStore, routeSlug;

		if (isPressed) {
			routeSlug = button.config.routeSlug;

			if (routeSlug) {
				switch(routeSlug) {
					case 'buses':
						selectedStore = busStore;
						break;
					case 'trolleys':
						selectedStore = trolleyStore;
						break;
					case 'subways':
						selectedStore = subwayStore;
						break;
					case 'trains':
						selectedStore = trainStore;
						break;
				}

				if(!selectedStore.isLoaded()) {
					selectedStore.load();
				}

				scheduleRouteList.setStore(selectedStore);
			}
		}
	},

	onScheduleRoutesListSelect: function(list, record) {
		var me = this,
			navView = me.getNavView(),
			routeDirections = me.getRouteDirections(),
			stopDirectionsStore = Ext.getStore('StopDirections'),
			stopDirectionsStoreProxy = stopDirectionsStore.getProxy(),
			url;

		routeDirections.setMasked({
			xtype: 'loadmask',
			message: 'Loading Details&hellip;'
		});

		routeDirections.setRoute(record);

		navView.push(routeDirections);
		url = stopDirectionsStoreProxy.config.rootUrl + '/' + record.get('routeId') + '/directions/0/stops';

		stopDirectionsStoreProxy.setUrl(url);

		//TODO Store previously loaded routeId and only load if it is different or not loaded
		stopDirectionsStore.load({
			callback: function() {
				routeDirections.setMasked(false);
			}
		});
	},

	onScheduleRouteDirectionsSelect: function(list, record) {
		var me = this,
			stopsStore = Ext.getStore('Stops'),
			navView = me.getNavView(),
			routeDirections = me.getRouteDirections(),
			route = routeDirections.getRoute(),
			routeId = route.get('routeId'),
			directionId = record.get('direction'),
			routeDetails = me.getRouteDetails(),
			routeDetailsModel = SeptaMobi.model.RouteDetails,
			routeDetailsProxy = SeptaMobi.model.RouteDetails.getProxy(),
			routeAlertIdentifier, alerts;

		if(route.get('routeType') == 3) {
			routeAlertIdentifier = 'bus_route_';
		}
		else {
			routeAlertIdentifier = 'rr_route_';
		}
		routeAlertIdentifier += route.get('routeShortName');

		routeDetails.setMasked({
			xtype: 'loadmask',
			message: 'Loading Route Details&hellip;'
		});

		routeDetails.setRouteId(routeId);
		routeDetails.setDirectionId(record.get('direction'));
		routeDetails.setRouteName(route.get('routeShortName'));

		//TODO Store previously loaded routeId/direction and only load if it is different or not loaded

		routeDetailsProxy.setExtraParams({
			route_id: routeId,
			direction_id: directionId,
			alert_id: routeAlertIdentifier,
			api_key: 't40P65kd'
		});

		SeptaMobi.model.RouteDetails.load(routeId, {
            callback: function(record) {
            	alerts = record.get('alerts');

            	stopsStore.setData(record.get('stops'));
            	routeDetails.setMasked(false);

            	if(alerts.length && alerts[0].advisory_message) {
					routeDetails.setAlert(alerts[0].advisory_message);
				}
				else {
					routeDetails.setAlert(false);
				}

				routeDetails.setPolylinePoints(record.get('shape'));
            }
        });

		navView.push(routeDetails);
	},

	onRouteDetailsMapRender: function() {
		var me = this,
			ll = window.L,
			routeDetails = me.getRouteDetails(),
			mapCmp = me.getRouteDetailsMap(),
			map = mapCmp.getMap(),
			busStore = Ext.getStore('Buses'),
			buses = busStore.getRange(),
			busLength = buses.length,
			polyLinePoints = routeDetails.getPolylinePoints(),
			polyLinePointsLength = polyLinePoints ? polyLinePoints.length : 0,
			stopMarkers = [], busMarkers = [],
			i = 0, stop, latLng, bounds, decodedPoints, polyLine, infoTemplate;

		for(; i < polyLinePointsLength; i++) {
			polyLine = ll.polyline(polyLinePoints[i]).addTo(map);
			//TODO figure out a better way to get bounds
			if(i == 0) {
				bounds = polyLine.getBounds();
			}
		}

		routeDetails.setStopMarkers(stopMarkers);

		routeDetails.removeBusMarkers();

		//TODO move template to view cfg?
		infoTemplate = Ext.create('Ext.XTemplate', [
			'bus {label}'
			,'<br> to {[values.destination||"<em>unknown destination</em>"]}'
			,'<br>reported {[values.Offset ? (values.Offset+" minutes ago") : "just now"]}'
		]);
		busStore.getProxy().setExtraParams({
			route: routeDetails.getRouteName()
		});
		busStore.load(function(buses) {
			buses.forEach(function(bus) {
				direction = bus.get('Direction');
				if(!Ext.Array.contains(me.config.busDirections, direction)) {
					direction = 'unknown';
				}

				latLng = [bus.get('lat'), bus.get('lng')];

				var marker = ll.marker(latLng, {
					icon: ll.icon({
					    iconUrl: 'resources/images/bus-marker-' + direction + '.png',
						iconRetinaUrl: 'resources/images/bus-marker-' + direction + '-2x.png',
						iconSize: [28, 31],
						iconAnchor: [14, 30]
					})
				}).addTo(map);

				setTimeout(function() {
					marker.bindPopup(infoTemplate.apply(bus.getData()));
				}, 1000);

				busMarkers.push(marker);
			});
		});

		routeDetails.setBusMarkers(busMarkers);

		if(bounds) {
			Ext.defer(function() {
				map.fitBounds(bounds);
			}, 1000, this);
		}
	},

	onScheduleRouteDetailsSelect: function(list, record) {
		var me = this,
			stopTimes = me.getStopTimes(),
			navView = me.getNavView(),
			stopTimesStore = Ext.getStore('StopTimes'),
			stopTimesStoreProxy = stopTimesStore.getProxy(),
			routeDetails = me.getRouteDetails(),
			url;

		url = stopTimesStoreProxy.config.rootUrl + '/' + routeDetails.getRouteId() 
			+ '/directions/' + routeDetails.getDirectionId() + '/stops/' + record.get('id') 
			+ '/trips';

		stopTimesStoreProxy.setUrl(url);

		stopTimes.setMasked({
			xtype: 'loadmask',
			message: 'Loading Stop Times&hellip;'
		});

		stopTimesStore.load(function() {
			stopTimes.setMasked(false);
		});

		navView.push(stopTimes);
	},

	onScheduleToggleBookmarkTapped: function() {
		console.log('bookmark toggle tapped');

		var me = this,
			navView = me.getNavView(),
			activeItem = navView.getActiveItem();
	},

	onScheduleRouteDetailsLeaveScreen: function(panel) {
		panel.down('dataview').deselectAll();
	}
});