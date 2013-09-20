Ext.define('SeptaMobi.store.Routes', {
	extend: 'Ext.data.Store',
	requires: ['SeptaMobi.proxy.APIProxy', 'SeptaMobi.model.Route'],

	config: {
		model: 'SeptaMobi.model.Route',
		proxy: {
			type: 'ajax',
			pageParam: false,
			limitParam: false,
			startParam: false,
			url: location.protocol == 'http:' ? '/routes' : 'http://opentrips.codeforphilly.org/opentripplanner-api-webapp/ws/transit/routes',
			reader: {
				type: 'json',
				rootProperty: 'routes'
			},
			extraParams: {
				'agency': 'SEPTA'
			}
		},

		sorters: 'routeLongName'
	}
});