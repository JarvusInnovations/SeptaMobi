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
			'RouteDirections',
			'stops.RouteTimeDetails'
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
			'RouteStopTimes',
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
			stopsNearbyList: 'stops-nearbylist',
			stopRouteDetailsMap: 'stops-routemap',
			routeDirections: {
				selector: 'routedirections#stop-routedirections',
				autoCreate: true,

				xtype: 'routedirections',
				itemId: 'stop-routedirections',
			},			
			routeTimeDetails: {
				selector: 'stops-routetimedetails',
				autoCreate: true,

				xtype: 'stops-routetimedetails'
			},
			routeTimeDetailsMap: 'stops-routetimedetails leafletmap'

		},
		control: {
			navView: {
				activate: 'onStopsNavViewActivate'
			},
			stopsNearbyList: {
				activate: 'onStopsNearbyListActivate',
				select: 'onNearbyStopListSelect'
			},
			stopsMainView: {
				activate: 'onStopsMainViewActivate',
				leavescreen: 'onStopsMainLeaveScreen'
			},
			stopRouteList: {
				activate: 'onRouteListActivate',
				select: 'onStopRoutesSelect'
			},
			scheduleRouteDetails: {
				leavescreen: 'onListLeaveScreen'
			},
			routeDirections: {
				leavescreen: 'onListLeaveScreen',
				select: 'onScheduleRouteDirectionsSelect'
			},
			routeStopDetails: {
				leavescreen: 'onScheduleRouteDetailsLeaveScreen'
			},
			routeTimeDetails: {
				activate: 'onRouteTimeDetailsActivate',
				leavescreen: 'onScheduleRouteDetailsLeaveScreen'
			},
			routeTimeDetailsMap: {
				maprender: 'onRouteDetailsMapRender'
			},
			'schedule-navview button[action=toggleBookmark]': {
				tap: 'onScheduleToggleBookmarkTapped'
			}
		},
		routes: {
			'stops': 'showStops',
			'stops/:id': 'showStopDetails',
			'stops/:stopId/route/:routeId': 'showDirections',
			'stops/:stopId/route/:routeId/direction/:directionId': 'showTimes'
		}
	},

	showStops: function(callback, scope) {
		var me = this,
			nearByStopsStore = Ext.getStore('NearByStops'),
			mainTabView = me.getMainTabView(),
			navView = me.getNavView(),
			stopsMainView = me.getStopsMainView();

		me.pushPath('stops');

		mainTabView.setActiveItem(navView);
		navView.pop(stopsMainView);

		if (!nearByStopsStore.isLoaded()) {
			me.updateLocation(function() {
				if(callback) {
					Ext.callback(callback, scope);
				}
			}, me);
		} else if(callback) {
			Ext.callback(callback, scope);
		}
	},

	onStopsNearbyListActivate: function(list) {
		var me = this,
			mainTabView = me.getMainTabView(),
			navView = me.getNavView();

		if(navView.getActiveItem() == mainTabView) {
			me.pushPath('stops');
		}
		list.deselectAll();
	},

	showStopDetails: function(stopId, callback, scope) {
		var me = this,
			stopRouteList = me.getStopRouteList(),
			navView = me.getNavView(),
			//TODO need to load from Stop Store if user 
			nearByStopsStore = Ext.getStore('NearByStops'),
			stop = nearByStopsStore.getById(stopId),
			routes;

		me.pushPath('stops/' + stopId);

		if(!nearByStopsStore.isLoaded()) {
			me.showStops(function() {
				me.showStopDetails(stopId, callback, scope);
			}, me);
			return;
		}

		if (!stop) {
			//Stop is no longer nearby, give up
			me.redirectTo('stops');
			return;
		} else {
			routes = stop.get('routes')
		}
		if (routes.length == 1) {
			me.showDirections(stop.get('id'), routes[0].get('id'), callback, scope);
		} else {
			stopRouteList.setStopId(stopId);
			//TODO why is this not showing just the routes that I'm explicitly setting here
			stopRouteList.setData(Ext.Array.map(routes, function(r) {
				if (r.isModel) {
					return r.getData();
				}
				//TODO should this occur in the API method?
				return Ext.create('SeptaMobi.model.Route', r).getData();
			}));
			if(callback){
				Ext.callback(callback, scope);	
			}
			navView.push(stopRouteList);
		}
	},

	// onStopsShow: function(navView, scheduleIndex) {
	// 	this.updateLocation();
	// },

	onStopsMainViewActivate: function(list) {
		this.getStopsNearbyList().deselectAll();
		this.pushPath('stops');
	},
	onStopsNavViewActivate: function() {
		// this.pushPath('stops');
	},

	onListLeaveScreen: function(list) {
		list.deselectAll();
	},

	onStopsMainLeaveScreen: function(panel) {
		// panel.down('stops-nearbylist').deselectAll();
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
								if (callback) {
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
		this.redirectTo('stops/' + record.get('id'));
		// var routes = record.get('routes');

		// this.loadRoutes(record.get('id'), routes);

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
		list.deselectAll();
		this.pushPath('stops/' + list.getStopId());
	},

	onStopRoutesSelect: function(list, record) {
		var stopRouteList = this.getStopRouteList(),
			stopId = stopRouteList.getStopId();

		this.redirectTo('stops/' + stopId + '/route/' + record.get('id'));
	},

	showDirections: function(stopId, routeId, callback, scope) {
		var me = this,
			navView = me.getNavView(),
			routeDirections = me.getRouteDirections(),
			nearByStopsStore = Ext.getStore('NearByStops'),
			stopDirectionsStore = Ext.getStore('StopDirections'),
			stopDirectionsStoreProxy = stopDirectionsStore.getProxy(),
			url;

		me.pushPath('stops/' + stopId + '/route/' + routeId);

		if(!nearByStopsStore.isLoaded()) {
			me.showStopDetails(stopId, function() {
				me.showDirections(stopId, routeId, callback, scope);
			}, me);
			return;
		}

		routeDirections.setMasked({
			xtype: 'loadmask',
			message: 'Loading Details&hellip;'
		});

		routeDirections.setStopId(stopId);
		routeDirections.setRouteId(routeId);

		navView.push(routeDirections);
		url = stopDirectionsStoreProxy.config.rootUrl + '/' + routeId + '/directions/0/stops';

		stopDirectionsStoreProxy.setUrl(url);

		//TODO Store previously loaded routeId and only load if it is different or not loaded
		stopDirectionsStore.load({
			callback: function() {
				routeDirections.setMasked(false);
				if(callback){
					Ext.callback(callback, scope);	
				}
			}
		});
	},

	onScheduleRouteDirectionsSelect: function(list, record) {
		var me = this,
			routeDirections = me.getRouteDirections(),
			route = routeDirections.getRouteId(),
			stop = routeDirections.getStopId();
		
		me.redirectTo('stops/' + stop + '/route/' + route + '/direction/' + record.get('direction'));
	},

	showTimes: function(stopId, routeId, directionId) {
		var me = this,
			navView = me.getNavView(),
			nearByStopsStore = Ext.getStore('NearByStops'),
			routeDetails = me.getRouteTimeDetails(),
			routeTimeDetails = me.getRouteTimeDetails(),
			stopTimesStore = Ext.getStore('RouteStopTimes'),
			routeDetailsModel = SeptaMobi.model.RouteDetails,
			routeDetailsProxy = SeptaMobi.model.RouteDetails.getProxy(),
			i = 0,
			routeAlertIdentifier, stop, routes, route;

		if(!nearByStopsStore.isLoaded()) {
			me.showDirections(stopId, routeId, function() {
				me.showTimes(stopId, routeId, directionId);
			}, me);
			return;
		}

		stop = nearByStopsStore.getById(stopId);
		routes = stop.get('routes');

		for(; i < routes.length; i++) {
			if(routes[i].get('id') == routeId) {
				route = routes[i];
				break;
			}
		}
		if(!route) {
			me.redirectTo('stops');
			return;
		}

		routeDetails.setMasked({
			xtype: 'loadmask',
			message: 'Loading Route&hellip;'
		});

		//TODO need route object here
		if (route.get('routeType') == 3) {
			routeAlertIdentifier = 'bus_route_';
		} else {
			routeAlertIdentifier = 'rr_route_';
		}

		routeDetailsProxy.setExtraParams({
			route_id: routeId,
			direction_id: directionId,
			alert_id: routeAlertIdentifier,
			api_key: 't40P65kd',
			stop_id: stopId
		});

		SeptaMobi.model.RouteDetails.load(routeId, {
			callback: function(record) {
				if(record) {
					stopTimesStore.setData(record.get('times'));

					alerts = record.get('alerts');

					if (alerts.length && alerts[0].advisory_message) {
						routeDetails.setAlert(alerts[0].advisory_message);
					} else {
						routeDetails.setAlert(false);
					}
					routeDetails.setPolylinePoints(record.get('shape'));
				}
				//TODO display error if no record?
				routeDetails.setMasked(false);
			}
		});

		navView.push(routeDetails);
	},

	loadTimesForStopAndRouteAndDirection: function(stopId, routeId, directionId) {
		console.log('loadTimesForStopAndRouteAndDirection');
	},

	/* The following code is very similar to the schedule route map, should consider refactoring shared
		logic in next release */
	onRouteDetailsMapRender: function(mapCmp) {
		var me = this,
			ll = window.L,
			routeDetails = mapCmp.getParent(),
			map = mapCmp.getMap(),
			busStore = Ext.getStore('Buses'),
			buses = busStore.getRange(),
			busLength = buses.length,
			polyLinePoints = routeDetails.getPolylinePoints(),
			polyLinePointsLength = polyLinePoints ? polyLinePoints.length : 0,
			stopMarkers = [],
			busMarkers = [],
			i = 0,
			stop, latLng, bounds, decodedPoints, polyLine, infoTemplate;

		for (; i < polyLinePointsLength; i++) {
			polyLine = ll.polyline(polyLinePoints[i]).addTo(map);
			//TODO figure out a better way to get bounds
			if (i == 0) {
				bounds = polyLine.getBounds();
			}
		}

		routeDetails.setStopMarkers(stopMarkers);

		routeDetails.removeBusMarkers();

		//TODO move template to view cfg?
		infoTemplate = Ext.create('Ext.XTemplate', [
			'bus {label}', '<br> to {[values.destination||"<em>unknown destination</em>"]}', '<br>reported {[values.Offset ? (values.Offset+" minutes ago") : "just now"]}'
		]);
		busStore.getProxy().setExtraParams({
			route: routeDetails.getRouteName()
		});
		busStore.load(function(buses) {
			buses.forEach(function(bus) {
				direction = bus.get('Direction');
				if (!Ext.Array.contains(me.config.busDirections, direction)) {
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

		if (bounds) {
			Ext.defer(function() {
				map.fitBounds(bounds);
			}, 1000, this);
		}
	},

	onScheduleToggleBookmarkTapped: function() {
		console.log('bookmark toggle tapped');

		var me = this,
			navView = me.getNavView(),
			activeItem = navView.getActiveItem();
	},

	onRouteTimeDetailsActivate: function(routeDetails) {
		routeDetails.setActiveItem(routeDetails.items.getAt(0));
	},
	
	onScheduleRouteDetailsLeaveScreen: function(panel) {
		panel.down('dataview').deselectAll();
	}
});