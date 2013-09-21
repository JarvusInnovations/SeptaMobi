Ext.define('SeptaMobi.model.Trip', {
	extend: 'Ext.data.Model',	

	config: {
		fields:[{
			name: 'id',
			type: 'string'
		}, {
			name: 'headsign',
			type: 'string'
		},{
			name: 'numberOfTrips',
			type: 'int'
		}, {
			name: 'calendarId',
			type: 'string'
		}],

		belongsTo: 'Variant'
	}
});