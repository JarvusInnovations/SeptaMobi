Ext.define('SeptaMobi.controller.Stop', {
	extend: 'Ext.app.Controller',

	config: {
		busDirections: ['NorthBound', 'SouthBound', 'EastBound', 'WestBound'],
		views: [
			'stops.RouteList',
			'stops.RouteMap'
		],
		stores: [
			'Buses',
			'NearByStops'
		],
		refs: {
			mainTabView: 'main',
			navView: 'stops-navview',
			stopsMainView: 'stops-main',
			routeList: {
				selector: 'stops-routelist',
				autoCreate: true,

				xtype: 'stops-routelist'
			},
			routeMap: {
				selector: 'stops-routemap',
				autoCreate: true,

				xtype: 'stops-routemap'
			},
			scheduleRouteList: 'schedule-routeslist'
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
			routeList: {
				activate: 'onRouteListActivate',
				select: 'onStopRoutesSelect',
				leavescreen: 'onStopRoutesLeaveScreen'
			},
			routeMap: {
				maprender: 'onRouteMapRender'
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
			routeList = me.getRouteList(),
			navView = me.getNavView();

		if(routes.length == 1) {
			me.onStopRoutesSelect(routeList, routes[0]);
		}
		else {
			me.pushPath('stops/' + stopId);
			routeList.setStopId(stopId);
			//TODO why is this not showing just the routes that I'm explicitly setting here
			routeList.setData(Ext.Array.map(routes, function(r) {
				if(r.isModel) {
					return r.getData();
				}
				//TODO should this occur in the API method?
				return Ext.create('SeptaMobi.model.Route', r).getData();
			}));
			navView.push(routeList);
		}
	},

	onStopsShow: function(navView, scheduleIndex) {
		var me = this;

		var routeStore = Ext.getStore('Routes');

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

	onStopsMainLeaveScreen: function(panel) {
		panel.down('stops-nearbylist').deselectAll();
		this.getScheduleRouteList().deselectAll();
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
				detailsRecord.variants().each(function(variant, vindex) {
					encodedPoints.push(variant.get('encodedPoints'));
				});

				routeMap.setEncodedPoints(encodedPoints);

				navView.setMasked(false);
				navView.push(routeMap);
			}
		});
	},

	onStopRoutesLeaveScreen: function(list) {
		list.deselectAll();
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
	}
});