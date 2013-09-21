Ext.define('SeptaMobi.store.RouteDetails', {
	extend: 'Ext.data.Store',
	requires: ['SeptaMobi.model.RouteDetail'],

	config: {
		model: 'SeptaMobi.model.RouteDetail',
		proxy: {
			type: 'ajax',
			pageParam: false,
			limitParam: false,
			startParam: false,
			url: location.protocol == 'http:' ? '/routedetails' : 'http://opentrips.codeforphilly.org/opentripplanner-api-webapp/ws/transit/routeData',
			reader: {
				type: 'json',
				rootProperty: 'routeData'
			}
		}
	}
});