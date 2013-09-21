Ext.define('SeptaMobi.model.RouteDetails', {
	extend: 'Ext.data.Model',
	requires: ['SeptaMobi.model.Variant'],

	config: {
		fields: [{
			name: 'id',
			mapping: 'id.id',
			type: 'int'
		}, {
			name: 'directions'
		}, {
			name: 'routeShortName',
			mapping: 'route.routeShortName',
			type: 'string'
		}, {
			name: 'routeLongName',
			mapping: 'route.routeLongName',
			type: 'string'
		}, {
			name: 'type',
			mapping: 'route.routeType',
			type: 'int'
		}],

		associations: [{
			type: 'hasMany',
			model: 'SeptaMobi.model.Variant',
			name: 'variants'
		}],
		
		proxy: {
			type: 'ajax',
			pageParam: false,
			limitParam: false,
			startParam: false,
			url: location.protocol == 'http:' ? './api/routedetails' : 'http://opentrips.codeforphilly.org/opentripplanner-api-webapp/ws/transit/routeData',
			reader: {
				type: 'json',
				rootProperty: 'routeData'
			}
		}
	}
});