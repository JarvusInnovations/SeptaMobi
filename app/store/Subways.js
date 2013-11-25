Ext.define('SeptaMobi.store.Subways', {
	extend: 'Ext.data.Store',
	requires: ['SeptaMobi.model.Route'],

	config: {
		model: 'SeptaMobi.model.Route',
		data: [{
			route_long_name: 'Broad Street Line'
		}, {
			route_long_name: 'Market-Frankford Line'
		}]
	}
});