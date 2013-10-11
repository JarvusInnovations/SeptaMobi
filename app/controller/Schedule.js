Ext.define('SeptaMobi.controller.Schedule', {
	extend: 'Ext.app.Controller',
	requires: [
	   'Jarvus.util.Polyline'
	],

	config: {
		views: [
			'schedule.RouteVariants',
			'schedule.RouteDetails',
			'schedule.StopTimes'
		],
		stores: [
			'Buses',
			'Routes',
			'StopTimes'
		],
		models: [
			'RouteDetails'
		],
		refs: {
			navView: 'stops-navview',
			routesList: 'schedule-routeslist',
			routeVariants: {
				selector: 'schedule-routevariants',
				autoCreate: true,

				xtype: 'schedule-routevariants'
			},
			routeDetails: {
				selector: 'schedule-routedetails',
				autoCreate: true,

				xtype: 'schedule-routedetails'
			},
			routeDetailsList: 'schedule-routedetails dataview',
			routeDetailsMap: 'schedule-routedetails leafletmap',
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
				select: 'onRoutesListSelect',
				leavescreen: 'onRoutesListLeaveScreen'
			},
			routeDetails: {
				leavescreen: 'onRouteDetailsLeaveScreen'
			},
			routeVariants: {
				select: 'onRoutesVariantsSelect'
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
			routeVariants = me.getRouteVariants(),
			navView = me.getNavView(),
			i = 0,
			routeDetails = me.getRouteDetails(),
			i = 0,
			bestVariant = null,
			maxStopsLength = 0,
			variant,
			variantsLength,
			previousIndex = -1,
			stops = new Ext.util.MixedCollection(),
			encodedPoints = [];

		routeDetails.setMasked({
			xtype: 'loadmask',
			message: 'Loading Details&hellip;'
		});

		navView.push(routeDetails);

		SeptaMobi.model.RouteDetails.load(record.getId(), {
			callback: function(detailsRecord) {
				detailsRecord.variants().each(function (variant, vindex) {
					console.log('Variant Index', vindex);
				    variant.stops().each(function(stop, index) {
				    	if(stops.contains(stop)) {
				    		previousIndex = stops.indexOf(stop);
				    	}
				    	else if(previousIndex == -1) {
				    		stops.add(stop);
				    		previousIndex = -1;
				    	}
				    	else {
				    		stops.insert(previousIndex, stop);
				    	}
				    });
				    encodedPoints.push(variant.get('encodedPoints'));
				});
				
				routeDetails.setEncodedPoints(encodedPoints);
				routeDetails.setStops(stops);
				routeDetails.setMasked(false);
			}
		});
	},

	onRoutesListLeaveScreen: function(list) {
		list.deselectAll();
	},

	onRouteDetailsLeaveScreen: function(routeDetails) {
		this.getRouteDetailsList().deselectAll();
	},

	onRoutesVariantsSelect: function(list, record) {
		var me = this,
			routeDetails = me.getRouteDetails(),
			routeVariants = me.getRouteVariants(),
			detailsRecord = routeVariants.getDetailsRecord(),
			navView = me.getNavView(),
			busesStore = Ext.getStore('Buses'),
			busMarkers = [], i = 0, busLength;

		routeDetails.setStops(record.get('stops'));
		routeDetails.setEncodedPoints(record.get('encodedPoints'));

		navView.push(routeDetails);

		if(record.get('type') == 3) {
			//Load Bus Positions
			busesStore.load({
				params: {
					route: record.get('routeShortName')
				}
			});
		}
	},

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
			stops = routeDetails.getStops(),
			mapCmp = me.getRouteDetailsMap(),
			map = mapCmp.getMap(),
			stopLength = stops.getRange().length,
			busStore = Ext.getStore('Buses'),
			buses = busStore.getRange(),
			busLength = buses.length,
			encodedPoints = routeDetails.getEncodedPoints(),
			encodedPointsLength = encodedPoints.length,
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

		Ext.defer(function() {
			map.fitBounds(bounds);
		}, 1000, this);
	},

	onScheduleToggleBookmarkTapped: function() {
		console.log('bookmark toggle tapped');

		var me = this,
			navView = me.getNavView(),
			activeItem = navView.getActiveItem();
	}
});