Ext.define('SeptaMobi.API', {
	extend: 'Ext.util.Observable',
	singleton: true,
	requires: [
		'Ext.Ajax'
	],

	config: {
		openTripPlanner: {
			baseUrl: 'http://opentrips.codeforphilly.org/opentripplanner-api-webapp/ws/'
		},
		smartyStreets: {
			authId: '828707b0-f9b3-4b92-860c-d0fa73e00b21',
			authToken: 'H2Nyq%2BIJMvt9QwSDdZolSEQilBHI899RDTWZ4vkv95UN0Uek3jgX79%2FcfUQbIWhR4NU5mFwiijidds48xij6sg%3D%3D',
			htmlAuthId: '5519210895803725602',
			autocompleteUrl: 'https://autocomplete-api.smartystreets.com/suggest',
			geoCodeUrl: 'https://api.smartystreets.com/street-address'
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

	getGeocode: function(address, callback, scope) {
		var me = this;
		
		Ext.Ajax.request({
			url: (window.SeptaMobi_API && SeptaMobi_API.geocode) || (location.protocol == 'http:' ? './api/geocode' : 'https://api.smartystreets.com/street-address'),
			method: 'GET',
			params: {
				'auth-id': '828707b0-f9b3-4b92-860c-d0fa73e00b21',
				'auth-token': 'H2Nyq+IJMvt9QwSDdZolSEQilBHI899RDTWZ4vkv95UN0Uek3jgX79/cfUQbIWhR4NU5mFwiijidds48xij6sg==',
				street: address.get('street_line'),
				city: address.get('city'),
				state: address.get('state'),
				candidates: 1
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
				lon: lon
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
						routes[j] = routeStore.getById(routes[j].id);
					}
				}
				
				nearByStopsStore.setData(records);

				Ext.callback(callback, scope, [options, success, response]);
			}
		});
	}
});