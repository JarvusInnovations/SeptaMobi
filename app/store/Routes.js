Ext.define('SeptaMobi.store.Routes', {
	extend: 'Ext.data.Store',
	requires: ['SeptaMobi.model.Route'],

	config: {
		model: 'SeptaMobi.model.Route',
		proxy: {
			type: 'ajax',
			pageParam: false,
			limitParam: false,
			startParam: false,
			reader: {
				type: 'json',
				rootProperty: 'data'
			},
			extraParams: {
				'api_key': 't40P65kd'
			}
		}
	}
});