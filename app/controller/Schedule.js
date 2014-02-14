Ext.define('SeptaMobi.controller.Schedule', {
	extend: 'Ext.app.Controller',
	requires: [
		'Jarvus.util.Polyline'
	],

	config: {
		busDirections: ['NorthBound', 'SouthBound', 'EastBound', 'WestBound'],
		views: [
			'RouteDirections',
			'schedule.RouteStopDetails',
			'schedule.StopTimes'
		],
		refs: {
			navView: 'schedule-navview',
			scheduleRoutesList: 'schedule-routeslist',
			routeDirections: {
				selector: 'routedirections#schedule-routedirections',
				autoCreate: true,

				xtype: 'routedirections',
				itemId: 'schedule-routedirections'
			},
			routeStopDetails: {
				selector: 'schedule-routestopdetails',
				autoCreate: true,

				xtype: 'schedule-routestopdetails'
			},
			routeStopDetailsList: 'schedule-routestopdetails dataview',
			routeStopDetailsMap: 'schedule-routestopdetails leafletmap',
			stopTimes: {
				selector: 'schedule-stoptimes',
				autoCreate: true,

				xtype: 'schedule-stoptimes'
			}
		},
		control: {
			navView: {
				activate: 'onNavViewActivate'
			},
			'schedule-routeslist segmentedbutton': {
				toggle: 'onScheduleRoutesListSegmentedButtonToggle'
			},
			scheduleRoutesList: {
				activate: 'onScheduleRouteListActivate',
				show: 'onScheduleShow',
				select: 'onScheduleRoutesListSelect'
			},
			routeDirections: {
				activate: 'onRouteDirectionsActivate',
				select: 'onRouteDirectionsSelect'
			},
			routeStopDetails: {
				activate: 'onRouteStopDetailsActivate'
			},
			routeStopDetailsMap: {
				maprender: 'onRouteDetailsMapRender'
			},
			routeStopDetailsList: {
				select: 'onScheduleRouteDetailsSelect'
			}
		}
	},

	onNavViewActivate: function() {
		// this.pushPath('schedule');
	},

	onScheduleRouteListActivate: function(list) {
		list.deselectAll();
	},

	onScheduleShow: function(navView, scheduleIndex) {
		var busRouteStore = Ext.getStore('BusRoutes');

		// this.pushPath('schedule');

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
				switch (routeSlug) {
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

				if (!selectedStore.isLoaded()) {
					selectedStore.load();
				}

				scheduleRouteList.setStore(selectedStore);
			}
		}
	},

	onRouteDirectionsActivate: function(list) {
		list.deselectAll();
	},

	onScheduleRoutesListSelect: function(list, record) {
		var me = this,
			navView = me.getNavView(),
			routeDirections = me.getRouteDirections(),
			stopDirectionsStore = Ext.getStore('StopDirections'),
			stopDirectionsStoreProxy = stopDirectionsStore.getProxy(),
			url;

		this.pushPath('schedule/route/' + record.get('routeId'));

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

	onRouteStopDetailsActivate: function(routeDetails) {
		routeDetails.setActiveItem(routeDetails.items.getAt(0));
		this.getRouteStopDetailsList().deselectAll();
	},

	onRouteDirectionsSelect: function(list, record) {
		var me = this,
			routeDetails = me.getRouteStopDetails(),
			stopsStore = Ext.getStore('Stops'),
			navView = me.getNavView(),
			routeDirections = me.getRouteDirections(),
			route = routeDirections.getRoute(),
			routeId = route.get('routeId') || route.get('id'),
			directionId = record.get('direction'),
			routeDetailsModel = SeptaMobi.model.RouteDetails,
			routeDetailsProxy = SeptaMobi.model.RouteDetails.getProxy(),
			routeAlertIdentifier, alerts, routeDetails, stopId;

		if (route.get('routeType') == 3) {
			routeAlertIdentifier = 'bus_route_';
		} else {
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
				//TODO Set Times list off record.get('times')
				alerts = record.get('alerts');

				stopsStore.setData(record.get('stops'));

				routeDetails.setMasked(false);

				if (alerts.length && alerts[0].advisory_message) {
					routeDetails.setAlert(alerts[0].advisory_message);
				} else {
					routeDetails.setAlert(false);
				}
				routeDetails.setPolylinePoints(record.get('shape'));
			}
		});

		navView.push(routeDetails);
	},

	//TODO Move to a route details controller? lots of shared functionality between here and stops
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

	onScheduleRouteDetailsSelect: function(list, record) {
		var me = this,
			stopTimes = me.getStopTimes(),
			navView = me.getNavView(),
			stopTimesStore = Ext.getStore('StopTimes'),
			stopTimesStoreProxy = stopTimesStore.getProxy(),
			routeDetails = me.getRouteStopDetails(),
			url;

		url = stopTimesStoreProxy.config.rootUrl + '/' + routeDetails.getRouteId() + '/directions/' + routeDetails.getDirectionId() + '/stops/' + record.get('id') + '/all_trips';

		stopTimesStoreProxy.setUrl(url);

		stopTimes.setMasked({
			xtype: 'loadmask',
			message: 'Loading Stop Times&hellip;'
		});

		stopTimesStore.load(function() {
			stopTimes.setMasked(false);
		});

		navView.push(stopTimes);
	}
});