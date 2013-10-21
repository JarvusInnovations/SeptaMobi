Ext.define('SeptaMobi.model.Variant', {
	extend: 'Ext.data.Model',
	requires: ['SeptaMobi.model.Stop', 'SeptaMobi.model.Trip'],

	config: {
		fields: [{
			name: 'name',
			type: 'string'
		}, {
			name: 'direction',
			type: 'int'
		}, {
			name: 'encodedPoints',
			mapping: 'geometry.points',
			type: 'string'
		}, {
			name: 'stopCount',
			convert: function(v,r) {
				return r.raw.stops.length;
			}
		}],

		associations: [{
			type: 'hasMany',
			model: 'SeptaMobi.model.Stop',
			name: 'stops'
		}, {
			type: 'hasMany',
			model: 'SeptaMobi.model.Trip',
			name: 'trips'
		}],

		belongsTo: 'RouteDetail'
	}
});