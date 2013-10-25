Ext.define('SeptaMobi.controller.Schedule', {
	extend: 'Ext.app.Controller',
	requires: [
	   'Jarvus.util.Polyline'
	],

	config: {
		views: [
			'schedule.RouteDirections',
			'schedule.RouteDetails',
			'schedule.StopTimes'
		],
		stores: [
			'Buses',
			'Routes',
			'Stops',
			'StopTimes'
		],
		models: [
			'RouteDetails'
		],
		refs: {
			navView: 'stops-navview',
			routesList: 'schedule-routeslist',
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
			routeDetailsMap: 'schedule-routedetails leafletmap',
			stopRouteDetailsMap: 'stops-routemap',
			stopTimes: {
				selector: 'schedule-stoptimes',
				autoCreate: true,

				xtype: 'schedule-stoptimes'
			}
		},
		control: {
			navView: {
				show: 'onScheduleShow'
			},
			'schedule-routeslist segmentedbutton': {
				toggle: 'onRoutesListSegmentedButtonToggle'
			},
			routesList: {
				select: 'onRoutesListSelect'
			},
			routeDetails: {
				leavescreen: 'onRouteDetailsLeaveScreen'
			},
			routeDirections: {
				leavescreen: 'onRouteDirectionsLeaveScreen',
				select: 'onRouteDirectionsSelect'
			},
			'schedule-routedetails dataview': {
				select: 'onRouteDetailsSelect'
			},
			routeDetailsMap: {
				maprender: 'onRouteDetailsMapRender'
			}, 			
			'schedule-navview button[action=toggleBookmark]': {
				tap: 'onScheduleToggleBookmarkTapped'
			}
		}
	},

	onScheduleShow: function(navView, scheduleIndex) {
		var routeStore = Ext.getStore('Routes');

		if (!routeStore.isLoaded()) {
			navView.setMasked({
				xtype: 'loadmask',
				message: 'Loading Routes&hellip;'
			});

			routeStore.load({
				callback: function(records, operation, success) {
					routeStore.filter('routeType', 3);
					navView.setMasked(false);
				}
			});
		}
	},

	onRoutesListSegmentedButtonToggle: function(segmentedButton, button, isPressed) {
		var navView = this.getNavView(),
			routeStore = Ext.getStore('Routes'),
			routeType;

		if (isPressed) {
			routeType = button.config.routeType;

			routeStore.clearFilter( !! routeType); // pass true to suppress update if we're going to apply a routeType filter next

			if (routeType) {
				routeStore.filter('routeType', routeType);
			}
		}
	},

	onRoutesListSelect: function(list, record) {
		var me = this,
			navView = me.getNavView(),
			i = 0,
			routeDirections = me.getRouteDirections(),
			i = 0,
			bestVariant = null,
			maxStopsLength = 0,
			variant,
			variantsLength,
			previousIndex = -1,
			stops = new Ext.util.MixedCollection(),
			stopsStore = Ext.getStore('Stops'),
			encodedPoints = [],
			direction, stopDirections;

		routeDirections.setMasked({
			xtype: 'loadmask',
			message: 'Loading Details&hellip;'
		});

		routeDirections.setRoute(record);

		navView.push(routeDirections);

		SeptaMobi.model.RouteDetails.load(record.getId(), {
			callback: function(detailsRecord) {
				detailsRecord.variants().sort([{
			        property : 'stopCount',
			        direction: 'DESC'
			    }]);
				detailsRecord.variants().each(function (variant, vindex) {
				    variant.stops().each(function(stop, index) {
				    	direction = variant.get('direction');		    	
				    	if(stops.contains(stop)) {
				    		previousIndex = stops.indexOf(stop);
				    		stopDirections = stop.get('directions');
				    		if(!Ext.Array.contains(stopDirections, direction)) {
				    			stop.set('directions', stopDirections);
				    			stopDirections.push(direction);
				    		}
				    		// console.log('skip');
				    	}
				    	else if(previousIndex == -1) {				    		
				    		stops.add(stop);
				    		previousIndex = -1;
				    	}
				    	else {
				    		stops.insert(previousIndex, stop);
				    	}
				    	stop.set('directions', [direction]);
				    });

				    encodedPoints.push(variant.get('encodedPoints'));
				});
				
				stopsStore.setData(stops.getRange());

				routeDirections.setEncodedPoints(encodedPoints);
				routeDirections.setData([stops.first().getData(), stops.last().getData()]);
				routeDirections.setMasked(false);
			}
		});
	},

	onRoutesListLeaveScreen: function(list) {
		list.deselectAll();
	},

	onRouteDirectionsLeaveScreen: function(routeDirections) {
		routeDirections.deselectAll();
	},

	onRouteDetailsLeaveScreen: function(routeDetails) {
		this.getRouteDetailsList().deselectAll();
	},

	onRouteDirectionsSelect: function(list, record) {
		var me = this,
			stopsStore = Ext.getStore('Stops'),
			alertsStore = Ext.getStore('Alerts'),
			routeList = me.getRoutesList(),
			navView = me.getNavView(),
			routeDirections = me.getRouteDirections(),
			route = routeDirections.getRoute(),
			routeDetails = me.getRouteDetails(),
			routeAlertIdentifier;

		if(route.get('routeType') == 3) {
			routeAlertIdentifier = 'bus_route_';
		}
		else {
			routeAlertIdentifier = 'rr_route_';
		}
		routeAlertIdentifier += route.get('routeShortName');

		Ext.Ajax.request({
			url: (window.SeptaMobi_API && SeptaMobi_API.alert) || (location.protocol == 'http:' ? './api/alert' : 'http://www3.septa.org/hackathon/Alerts/get_alert_data.php'),
			method: 'GET',
			params: {
				req1: routeAlertIdentifier
			},
			callback: function(options, success, response) {
				var r = Ext.decode(response.responseText, true);

				if(r.length && r[0].advisory_message) {
					routeDetails.setAlert(r[0].advisory_message);
				}
				else {
					routeDetails.setAlert(false);
				}
			}
		});

		routeDetails.setEncodedPoints(routeDirections.getEncodedPoints());
		navView.push(routeDetails);
	},
	// onRoutesVariantsSelect: function(list, record) {
	// 	var me = this,
	// 		routeDetails = me.getRouteDetails(),
	// 		routeVariants = me.getRouteVariants(),
	// 		detailsRecord = routeVariants.getDetailsRecord(),
	// 		navView = me.getNavView(),
	// 		busesStore = Ext.getStore('Buses'),
	// 		busMarkers = [], i = 0, busLength;

	// 	routeDetails.setStops(record.get('stops'));
	// 	routeDetails.setEncodedPoints(record.get('encodedPoints'));

	// 	navView.push(routeDetails);

	// 	if(record.get('type') == 3) {
	// 		//Load Bus Positions
	// 		busesStore.load({
	// 			params: {
	// 				route: record.get('routeShortName')
	// 			}
	// 		});
	// 	}
	// },

	onRouteDetailsSelect: function(list, record) {
		var me = this,
			stopTimes = me.getStopTimes(),
			navView = me.getNavView(),
			stopTimesStore = Ext.getStore('StopTimes'),
			now = new Date(),
			tomorrow = (new Date()).setDate(now.getDate() + 1);

		stopTimesStore.getProxy().setExtraParams({
			id: record.get('id'),
			agency: 'SEPTA',
			startTime: now.getTime(),
			endDate: tomorrow
		});

		stopTimesStore.load();

		navView.push(stopTimes);
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
			encodedPoints = routeDetails.getEncodedPoints(),
			encodedPointsLength = encodedPoints ? encodedPoints.length : 0,
			stopMarkers = [], busMarkers = [],
			i = 0, stop, latLng, bounds, decodedPoints, polyLine, infoTemplate;

		//TODO remove any prexisting stop markers?
		//TODO Option to show stops?
		// for(; i < stopLength; i++) {
		// 	stop = stops.getAt(i);

		// 	latLng = [stop.get('lat'), stop.get('lon')];

		// 	marker = ll.marker(latLng).addTo(map);
		// 	marker.bindPopup(stop.get('name')).openPopup();

		// 	stopMarkers.push(marker);
		// }

		for(; i < encodedPointsLength; i++) {
			decodedPoints = Jarvus.util.Polyline.decode(encodedPoints[i]);
			polyLine = ll.polyline(decodedPoints).addTo(map);			
			//TODO figure out a better way to get bounds
			if(i == 0) {
				bounds = polyLine.getBounds();
			}
		}
		
		// polyLine = ll.polyline(decodedPoints).addTo(map);		

		routeDetails.setStopMarkers(stopMarkers);
		// routeDetails.setRoutePolyLine(polyLine);

		routeDetails.removeBusMarkers();

		//TODO move template to view cfg?
		infoTemplate = Ext.create('Ext.XTemplate', [
			'bus {label}'
			,'<br> to {[values.destination||"<em>unknown destination</em>"]}'
			,'<br>reported {[values.Offset ? (values.Offset+" minutes ago") : "just now"]}'
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

		routeDetails.setBusMarkers(busMarkers);

		if(bounds) {
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
	}
});