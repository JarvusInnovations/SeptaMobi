Ext.define('SeptaMobi.model.Itinerary', {
	extend: 'Ext.data.Model',

	config: {
		fields:[{
			name: 'duration',
			type: 'int'
		},{
			name: 'toName',
			type: 'string'
		},{
			name: 'fromName',
			type: 'string'
		},{
			name: 'walkDistance',
			type: 'float'
		},{
			name: 'transfers',
			type: 'int'
		},{
			name: 'legs'
		},{
			name: 'startTime',
			dateFormat: 'time',
			type: 'date'
		},{
			name: 'endTime',
			dateFormat: 'time',
			type: 'date'
		}]
	}
});