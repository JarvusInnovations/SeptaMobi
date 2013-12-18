Ext.define('SeptaMobi.store.Subways', {
	extend: 'Ext.data.Store',
	requires: ['SeptaMobi.model.Route'],

	config: {
		model: 'SeptaMobi.model.Route',
		data: [{
			id: 21442,
            route_id: "12025",
			route_long_name: 'Broad Street Line'
		}, {
			id: 21442,
            route_id: "12025",
			route_long_name: 'Market-Frankford Line'
		}]
	}
});