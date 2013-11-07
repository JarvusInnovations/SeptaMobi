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

	/**
	 * Wrapper for Ext.Ajax.request that applies baseUrl and session headers, and decodes application/json responses
	 */
	// request: function(method, path, jsonData, callback, scope) {
	// 	var me = this;

	// 	Ext.Ajax.request({
	// 		url: me.buildUrl(path),
	// 		method: method,
	// 		jsonData: jsonData,
	// 		callback: function(options, success, response) {
	// 			if ((response.getResponseHeader('content-type') || '').indexOf('application/json') == 0 && response.responseText) {
	// 				response.data = Ext.decode(response.responseText, true);
	// 			}

	// 			Ext.callback(callback, scope, [options, success, response]);
	// 		}
	// 	});
	// },

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
		var	routeStore = Ext.getStore('Routes'),
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
				if ((response.getResponseHeader('content-type') || '').indexOf('application/json') == 0 && response.responseText) {
					response.data = Ext.decode(response.responseText, true);
				}

				records = response.data.stops;
				stopsLength = records.length;

				for (; i < stopsLength; i++) {
					routes = records[i].routes;
					routesLength = routes.length;

					for (j = 0; j < routesLength; j++) {
						routes[j] = routeStore.getData().getByKey(routes[j].id); // data.getByKey searches filtered records, getById doesn't
					}
				}
				
				nearByStopsStore.setData(records);

				Ext.callback(callback, scope, [options, success, response]);
			}
		});
	}
});