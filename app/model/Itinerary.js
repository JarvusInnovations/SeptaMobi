Ext.define('SeptaMobi.model.Itinerary', {
	extend: 'Ext.data.Model',

	config: {
		fields:[{
			name: 'duration',
			type: 'int'
		},{
			name: 'walkDistance',
			type: 'float'
		},{
			name: 'transfers',
			type: 'int'
		}]
	}
});