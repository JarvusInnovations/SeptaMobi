Ext.define('SeptaMobi.model.SystemLocation', {
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
			mapping: 'location_name'
		},{
			name: 'address',
			type: 'string',
			mapping: 'location_data.address1'
		},{
			name: 'address2',
			type: 'string',
			mapping: 'location_data.address2'
		},{
			name: 'city',
			type: 'string',
			mapping: 'location_data.city'
		},{
			name: 'zip',
			type: 'string',
			mapping: 'location_data.zip'
		},{
			name: 'hours',
			type: 'string'
		},{
			name: 'phone',
			type: 'string'
		},{
			name: 'lat',
			type: 'double',
			mapping:'location_lat'
		},{
			name: 'lon',
			type: 'double',
			mapping:'location_lon'
		}]
	}
});
