Ext.define('SeptaMobi.controller.Stop', {
	extend: 'Ext.app.Controller',

	config: {
		views: [
			'stops.RouteList',
			'stops.RouteMap'
		],
		stores: [
			'Buses',
			'NearByStops'
		],
		refs: {
			navView: 'stops-navview',
			routeList: {
				selector: 'stops-routelist',
				autoCreate: true,

				xtype: 'stops-routelist'
			},
			routeMap: {
				selector: 'stops-routemap',
				autoCreate: true,

				xtype: 'stops-routemap'
			}
		},
		control: {
			navView: {
				show: 'onStopsShow'
			},
			'stops-main': {
				leavescreen: 'onStopsMainLeaveScreen'
			},
			'stops-nearbylist': {
				select: 'onNearbyStopListSelect'
			},
			routeList: {
				select: 'onStopRoutesSelect',
				leavescreen: 'onStopRoutesLeaveScreen'
			},
			routeMap: {
				maprender: 'onRouteMapRender'
			}
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

	onStopsMainLeaveScreen: function(panel) {
		panel.down('stops-nearbylist').deselectAll();
	},

	updateLocation: function() {
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
		var me = this,
			navView = me.getNavView(),
			routeStore = Ext.getStore('Routes'),
			routeList = me.getRouteList(),
			routes = record.get('routes'),
			routeLength = routes.length,
			i = 0;

		if (routeLength == 1) {
			me.onStopRoutesSelect(routeList, routes[0]);
		} else {
			routeList.setData(Ext.Array.map(routes, function(r) {
				return r.getData()
			}));
			navView.push(routeList);
		}
	},

	onStopRoutesSelect: function(list, record) {
		var me = this,
			ll = window.L,
			navView = me.getNavView(),
			busesStore = Ext.getStore('Buses'),
			encodedPoints = [],
			routeMap = me.getRouteMap();

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
			stop, latLng, bounds, decodedPoints, polyLine, infoTemplate;

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
			latLng = [bus.get('lat'), bus.get('lng')];

			var marker = ll.marker(latLng, {
				icon: ll.icon({
					iconUrl: 'resources/images/bus-marker.png',
					iconRetinaUrl: 'resources/images/bus-marker-2x.png',
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