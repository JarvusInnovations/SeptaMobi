Ext.define('SeptaMobi.model.RouteDetails', {
	extend: 'Ext.data.Model',

	config: {
		fields: [{
			name: 'stops'
		}, {
			name: 'alerts'
		}, {
			name: 'shape'
		}, {
			name: 'times'
		}],
		
		proxy: {
			type: 'ajax',
			pageParam: false,
			limitParam: false,
			startParam: false,
			url: (window.SeptaMobi_API && SeptaMobi_API.routeDetails) || (location.protocol == 'http:' ? './api/route-details' : 'http://v3.septa.mobi/api/route-details'),
			reader: {
				type: 'json'
			}
		}
	}
});