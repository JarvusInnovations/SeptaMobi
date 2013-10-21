Ext.define('SeptaMobi.model.Perk', {
	extend: 'Ext.data.Model',

	config: {
		idProperty: 'id',

		fields:[{
			name: 'id',
			type: 'string',
			mapping: 'perk_id'
		},{
			name: 'name',
			type: 'string',
			mapping: 'perk_name'
		},{
			name: 'status',
			type: 'string'
		},{
			name: 'state',
			type: 'string'
		},{
			name: 'description',
			type: 'string'
		},{
			name: 'startDate',
			type: 'string'
		},{
			name: 'endDate',
			type: 'string'
		},{
			name: 'loc_name',
			type: 'string'
		},{
			name: 'address1',
			type: 'string'
		},{
			name: 'address2',
			type: 'string'
		},{
			name: 'city',
			type: 'string'
		},{
			name: 'zip',
			type: 'string'
		},{
			name: 'hours',
			type: 'string'
		},{
			name: 'phone',
			type: 'string'
		}]
	}
});
