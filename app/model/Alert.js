Ext.define('SeptaMobi.model.Alert', {
	extend: 'Ext.data.Model',

	config: {
		fields:[{
			name: 'route_id',
			type: 'string'
		},{
			name: 'route_name',
			type: 'string'
		},{
			name: 'current_message',
			type: 'string'
		},{
			name: 'advisory_message',
			type: 'string'
		},{
			name: 'detour_message',
			type: 'string'
		},{
			name: 'detour_start_location',
			type: 'string'
		},{
			name: 'detour_start_date_time',
			type: 'string'
		},{
			name: 'detour_end_date_time',
			type: 'string'
		},{
			name: 'detour_reason',
			type: 'string'
		},{
			name: 'last_updated',
			type: 'string'
		}]
	}
});