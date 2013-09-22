Ext.define('SeptaMobi.controller.Schedule', {
	extend: 'Ext.app.Controller',

	config: {
		views: [
			'schedule.RouteVariants',
			'schedule.RouteDetails',
			'schedule.StopTimes'
		],
		stores: [
			'Routes',
			'StopTimes'
		],
		models: [
			'RouteDetails'
		],
		refs: {
			navView: 'schedule-navview',
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
				select: 'onRoutesListSelect'
			},
			routeVariants: {
				select: 'onRoutesVariantsSelect'
			},
			routeDetails: {
				select: 'onRouteDetailsSelect'
			},
			routeDetailsMap: {
				maprender: 'onRouteDetailsMapRender'
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
			routeType = button.routeType;

			routeStore.clearFilter( !! routeType); // pass true to suppress update if we're going to apply a routeType filter next

			if (routeType) {
				routeStore.filter('routeType', routeType);
			}
		}
	},

	onRoutesListSelect: function(list, record) {
		var me = this,
			routeVariants = me.getRouteVariants(),
			navView = me.getNavView();

		routeVariants.setMasked({
			xtype: 'loadmask',
			message: 'Loading Details&hellip;'
		});

		navView.push(routeVariants);

		SeptaMobi.model.RouteDetails.load(record.getId(), {
			callback: function(detailsRecord) {
				routeVariants.setDetailsRecord(detailsRecord);
				routeVariants.setMasked(false);
			}
		});
	},

	onRoutesVariantsSelect: function(list, record) {
		var me = this,
			routeDetails = me.getRouteDetails(),
			routeVariants = me.getRouteVariants(),
			detailsRecord = routeVariants.getDetailsRecord(),
			navView = me.getNavView();

		routeDetails.setStops(record.get('stops'));
		routeDetails.setEncodedPoints(record.get('encodedPoints'));

		navView.push(routeDetails);
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
			routeDetails = me.getRouteDetails(),
			stops = routeDetails.getStops(),
			mapCmp = me.getRouteDetailsMap(),
			map = mapCmp.getMap(),
			stopLength = stops.getRange().length,
			markers = [],
			i = 0, stop, marker, latLng, bounds, decodedPoints, polyLine;

		for(; i < stopLength; i++) {
			stop = stops.getAt(i);

			latLng = [stop.get('lat'), stop.get('lon')];

			marker = L.marker(latLng).addTo(map);
			marker.bindPopup(stop.get('name')).openPopup();

			markers.push(marker);
		}

		decodedPoints = mapCmp.decode(routeDetails.getEncodedPoints());

		polyLine = L.polyline(decodedPoints).addTo(map);

		bounds = polyLine.getBounds();

		routeDetails.setStopMarkers(markers);
		routeDetails.setRoutePolyLine(polyLine);

		Ext.defer(function() {
			map.fitBounds(bounds);
		}, 1000, this);
	}
});