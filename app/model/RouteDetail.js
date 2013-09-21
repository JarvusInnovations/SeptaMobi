Ext.define('SeptaMobi.model.RouteDetail', {
	extend: 'Ext.data.Model',
	requires: ['SeptaMobi.model.Variant'],

	config: {
		idProperty: 'id',

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
		}]
	}
});