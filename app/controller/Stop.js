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
			'schedule.RouteStopDetails',
			'schedule.RouteTimeDetails',
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
			stopsNearbyList: 'stops-nearbylist',
			stopRouteDetailsMap: 'stops-routemap',
			// stopTimes: {
			// 	selector: 'schedule-stoptimes',
			// 	autoCreate: true,

			// 	xtype: 'schedule-stoptimes'
			// },
			routeDirections: {
				selector: 'routedirections#stop-routedirections',
				autoCreate: true,

				xtype: 'routedirections',
				itemId: 'stop-routedirections',
			},			
			routeTimeDetails: {
				selector: 'schedule-routetimedetails',
				autoCreate: true,

				xtype: 'schedule-routetimedetails'
			},
			// routeStopDetailsList: 'schedule-routestopdetails dataview',
			// routeStopDetailsMap: 'schedule-routestopdetails leafletmap',
			routeTimeDetailsList: 'schedule-routetimedetails dataview',
			routeTimeDetailsMap: 'schedule-routetimedetails leafletmap'

		},
		control: {
			navView: {
				activate: 'onStopsNavViewActivate',
				show: 'onStopsShow'
			},
			stopsMainView: {
				activate: 'onStopsMainViewActivate',
				leavescreen: 'onStopsMainLeaveScreen'
			},
			stopsNearbyList: {
				select: 'onNearbyStopListSelect'
			},
			stopRouteList: {
				activate: 'onRouteListActivate',
				select: 'onStopRoutesSelect'
			},
			routeMap: {
				maprender: 'onRouteMapRender'
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
			routeTimeDetailsList: {
				select: 'onScheduleRouteDetailsSelect'
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
			// 'stops/:stopId/route/:routeId': 'showDirections',
			'stops/:stopId/route/:routeId/direction/:directionId': 'showTimes'
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
			i = 0,
			stop;

		if (!nearByStopsStore.isLoaded()) {
			me.updateLocation(function() {
				me.showStops(id)
			});
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

	showStopDetails: function(stopId) {
		var me = this,
			stopRouteList = me.getStopRouteList(),
			navView = me.getNavView(),
			//TODO need to load from Stop Store if user 
			stop = Ext.getStore('NearByStops').getById(stopId),
			routes;

		if (!stop) {
			me.redirectTo('stops');
			return;
		} else {
			routes = stop.get('routes')
		}
		if (routes.length == 1) {
			me.showDirections(stop, routes[0]);
		} else {
			// me.pushPath('stops/' + stopId);
			stopRouteList.setStopId(stopId);
			//TODO why is this not showing just the routes that I'm explicitly setting here
			stopRouteList.setData(Ext.Array.map(routes, function(r) {
				if (r.isModel) {
					return r.getData();
				}
				//TODO should this occur in the API method?
				return Ext.create('SeptaMobi.model.Route', r).getData();
			}));
			navView.push(stopRouteList);
		}
	},

	onStopsShow: function(navView, scheduleIndex) {
		this.updateLocation();
	},

	onStopsMainViewActivate: function(list) {
		this.getStopsNearbyList().deselectAll();
		// this.pushPath('stops');
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
		var stopsNearbyList = this.getStopsNearbyList();

		this.showDirections(stopsNearbyList.getSelection()[0], record);
	},

	showDirections: function(stop, route) {
		var me = this,
			navView = me.getNavView(),
			routeDirections = me.getRouteDirections(),
			stopDirectionsStore = Ext.getStore('StopDirections'),
			stopDirectionsStoreProxy = stopDirectionsStore.getProxy(),
			url;

		me.pushPath('stops/' + stop.get('id') + '/route/' + route.get('id'));

		routeDirections.setMasked({
			xtype: 'loadmask',
			message: 'Loading Details&hellip;'
		});

		routeDirections.setRoute(route);

		navView.push(routeDirections);
		url = stopDirectionsStoreProxy.config.rootUrl + '/' + route.get('id') + '/directions/0/stops';

		stopDirectionsStoreProxy.setUrl(url);

		//TODO Store previously loaded routeId and only load if it is different or not loaded
		stopDirectionsStore.load({
			callback: function() {
				routeDirections.setMasked(false);
			}
		});
	},

	loadTimesForStopAndRouteAndDirection: function(stopId, routeId, directionId) {
		console.log('loadTimesForStopAndRouteAndDirection');
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

		routeMap.removeBusMarkers();

		//TODO move template to view cfg?
		infoTemplate = Ext.create('Ext.XTemplate', [
			'bus {label}', '<br> to {[values.destination||"<em>unknown destination</em>"]}', '<br>reported {[values.Offset ? (values.Offset+" minutes ago") : "just now"]}'
		]);

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

		routeMap.setBusMarkers(busMarkers);

		Ext.defer(function() {
			map.fitBounds(bounds);
		}, 1000, this);
	},

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