Ext.define('SeptaMobi.model.Address', {
	extend: 'Ext.data.Model',

	config: {
		fields:[{
			name: 'text',
			type: 'string'
		},{
			name: 'street_line',
			type: 'string'
		},{
			name: 'city',
			type: 'string'
		},{
			name: 'state',
			type: 'string'
		},{
			name: 'lat',
			type: 'double'
		},{
			name: 'lon',
			type: 'double'
		}]
	}
});