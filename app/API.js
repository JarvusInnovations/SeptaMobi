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
			url: 'https://api.smartystreets.com/street-address',
			method: 'GET',
			extraParams: {
				'auth-id': '828707b0-f9b3-4b92-860c-d0fa73e00b21',
				'auth-token': 'H2Nyq%2BIJMvt9QwSDdZolSEQilBHI899RDTWZ4vkv95UN0Uek3jgX79%2FcfUQbIWhR4NU5mFwiijidds48xij6sg%3D%3D',
				street: address.get('street_line'),
				city: address.get('city'),
				state: address.get('state'),
				candidates: 1
			}
			callback: function(options, success, response) {
				debugger
				if ((response.getResponseHeader('content-type') || '').indexOf('application/json') == 0 && response.responseText) {
					response.data = Ext.decode(response.responseText, true);
				}

				Ext.callback(callback, scope, [options, success, response]);
			}
		});
	},

	getDirections: function(fromLat, fromLon, toLat, toLon, departTime, callback, scope) {

	}
});