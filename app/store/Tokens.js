Ext.define('SeptaMobi.store.Tokens', {
	extend: 'Ext.data.Store',
	requires: ['SeptaMobi.model.SystemLocation'],

	config: {
		model: 'SeptaMobi.model.SystemLocation',

		proxy: {
			type: 'ajax',
			url: (window.SeptaMobi_API && SeptaMobi_API.systemLocationsNearPoint) || (location.protocol == 'http:' ? './api/systemLocationsNearPoint' : 'http://www3.septa.org/hackathon/locations/get_locations.php'),
			reader: {
				type: 'json'
			},
			extraParams: {
				'type': 'sales_locations',
				'radius': 3
			}
		}
	}
});