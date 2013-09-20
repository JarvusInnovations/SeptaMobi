Ext.define('SeptaMobi.model.Trip', {
	extend: 'Ext.data.Model',

	config: {
		fields:[{
			name: 'name',
			type: 'string'
		},{
			name: 'mode',
			type: 'string'
		},{
			name: 'number',
			type: 'int'
		},{
			name: 'duration',
			type: 'int'
		},{
			name: 'ordinal',
			type: 'int'
		},{
			name: 'viewed',
			type: 'bool'
		},{
			name: 'unlocked',
			type: 'bool'
		}]
	}
});