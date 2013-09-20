Ext.define('SeptaMobi.model.Variant', {
	extend: 'Ext.data.Model',	

	config: {
		fields:[{
			name: 'name',
			type: 'string'
		}],

		hasMany: {
			model: 'Trip',
			name: 'trips'
		},

		hasMany: {
			model: 'Stop',
			name: 'Stops'
		}
	}
});