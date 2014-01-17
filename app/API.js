Ext.define('SeptaMobi.API', {
	extend: 'Ext.util.Observable',
	singleton: true,
	requires: [
		'Ext.Ajax'
	],

	config: {
		openTripPlanner: {
			baseUrl: 'http://opentrips.codeforphilly.org/opentripplanner-api-webapp/ws/'
		}
	},

	constructor: function() {
		this.callParent(arguments);

		Ext.Ajax.on('requestexception', 'onRequestException', this);
	},

	onRequestException: function(connection, response, options) {
		var me = this;

		if (response.timedout) {
			Ext.Msg.alert('Server Error', 'It appears that our servers are not avaliable. Please try again later.');
		} else if (response.status == 500) {
			Ext.Msg.alert('Server Error', 'An error has occured, please try again later.');
		} else {
			Ext.Msg.alert('Error', 'An error has occured, please try again later.');
		}
	},

	getAutoCompleteDetail: function(address, callback, scope) {
		var me = this;

		Ext.Ajax.request({
			url: (window.SeptaMobi_API && SeptaMobi_API.placeDetails) || (location.protocol == 'http:' ? './api/place-details' : 'https://maps.googleapis.com/maps/api/place/details/json'),
			method: 'GET',
			params: {
				sensor: true,
				key: 'AIzaSyD1uYQ7HZCNIpyuEW2eE8eANAel9LTym4g',
				reference: address.get('reference')
			},
			callback: function(options, success, response) {
				if ((response.getResponseHeader('content-type') || '').indexOf('application/json') == 0 && response.responseText) {
					response.data = Ext.decode(response.responseText, true);
				}

				Ext.callback(callback, scope, [options, success, response]);
			}
		});
	},

	getDirections: function(fromAddress, toAddress, departTime, callback, scope) {
		Ext.Ajax.request({
			url: (window.SeptaMobi_API && SeptaMobi_API.plan) || (location.protocol == 'http:' ? './api/plan' : 'http://opentrips.codeforphilly.org/opentripplanner-api-webapp/ws/plan'),
			method: 'GET',
			params: {
				fromPlace: fromAddress.get('lat') + ',' + fromAddress.get('lon'),
				toPlace: toAddress.get('lat') + ',' + toAddress.get('lon'),
				//TODO Add UI for this as an option / allow for user defaults
				maxWalkDistance: 1207 //Meters
				//TODO Add depart time
			},
			callback: function(options, success, response) {
				if ((response.getResponseHeader('content-type') || '').indexOf('application/json') == 0 && response.responseText) {
					response.data = Ext.decode(response.responseText, true);
				}

				Ext.callback(callback, scope, [options, success, response]);
			}
		});
	},

	routesForStop: function(stopId, callback, scope) {
		var records;

		Ext.Ajax.request({
			url: (window.SeptaMobi_API && SeptaMobi_API.routesForStop) || (location.protocol == 'http:' ? './api/routesForStop' : 'http://opentrips.codeforphilly.org/opentripplanner-api-webapp/ws/transit/routesForStop'),
			method: 'GET',
			params: {
				id: stopId
			},
			callback: function(options, success, response) {
				if ((response.getResponseHeader('content-type') || '').indexOf('application/json') == 0 && response.responseText) {
					response.data = Ext.decode(response.responseText, true);
				}

				records = response.data.routes;

				Ext.callback(callback, scope, [records, options, success, response]);
			}
		});
	},

	getNearByStops: function(lat, lon, callback, scope) {
		var routeStore = Ext.getStore('LegacyRoutes'),
			nearByStopsStore = Ext.getStore('NearByStops'),
			i = 0,
			records, stopsLength, routesLength, j, routes;

		Ext.Ajax.request({
			url: (window.SeptaMobi_API && SeptaMobi_API.stopsNearPoint) || (location.protocol == 'http:' ? './api/stopsNearPoint' : 'http://opentrips.codeforphilly.org/opentripplanner-api-webapp/ws/transit/stopsNearPoint'),
			method: 'GET',
			params: {
				lat: lat,
				lon: lon,
				radius: window.SeptaMobi_Defaults ? window.SeptaMobi_Defaults.stops_near_by_default_search_radius : 200
			},
			callback: function(options, success, response) {
				if (response.responseText && (response.getResponseHeader('content-type') || '').indexOf('application/json') == 0) {
					response.data = Ext.decode(response.responseText, true);
				}

				if (response.data && response.data.stops) {
					records = response.data.stops;
					stopsLength = records.length;

					for (; i < stopsLength; i++) {
						routes = records[i].routes;
						routesLength = routes.length;

						for (j = 0; j < routesLength; j++) {
							// routes[j] = routeStore.getData().getByKey(routes[j].id); // data.getByKey searches filtered records, getById doesn't
							routes[j] = Ext.create('SeptaMobi.model.LegacyRoute', routes[j]);
						}
					}

					nearByStopsStore.setData(records);
				} else {
					//todo show error message
				}
				Ext.callback(callback, scope, [options, success, response]);
			}
		});
	},

	geoCodeAddress: function(address, callback, scope) {
		var location = false,
			result, lat, lng;

		Ext.Ajax.request({
			url: (window.SeptaMobi_API && SeptaMobi_API.geocode) || (location.protocol == 'http:' ? './api/geocode' : 'https://maps.googleapis.com/maps/api/geocode/json'),
			method: 'GET',
			params: {
				address: address,
				sensor: true
			},
			callback: function(options, success, response) {
				if ((response.getResponseHeader('content-type') || '').indexOf('application/json') == 0 && response.responseText) {
					response.data = Ext.decode(response.responseText, true);
				}
				if (response.data.results && response.data.results.length > 0) {
					result = response.data.results[0];

					if (result.geometry && result.geometry.location) {
						lat = result.geometry.location.lat;
						lng = result.geometry.location.lng;

						location = [lat, lng];
					}
				}

				Ext.callback(callback, scope, [location, options, success, response]);
			}
		});
	}
});