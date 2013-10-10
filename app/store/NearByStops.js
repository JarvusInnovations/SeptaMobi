Ext.define('SeptaMobi.store.NearByStops', {
	extend: 'Ext.data.Store',
	requires: ['SeptaMobi.model.NearByStop'],

	config: {
		model: 'SeptaMobi.model.NearByStop',
		// proxy: {
		// 	type: 'ajax',
		// 	pageParam: false,
		// 	limitParam: false,
		// 	startParam: false,
		// 	url: (window.SeptaMobi_API && SeptaMobi_API.stopsNearPoint) || (location.protocol == 'http:' ? './api/stopsNearPoint' : 'http://opentrips.codeforphilly.org/opentripplanner-api-webapp/ws/transit/stopsNearPoint'),
		// 	reader: {
		// 		type: 'json',
		// 		rootProperty: 'stops'
		// 	}
		// }
	}
});