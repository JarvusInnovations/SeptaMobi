Ext.define('SeptaMobi.model.Bus', {
	extend: 'Ext.data.Model'
	
	,config: {
		fields: [{
			name: 'lat'
			,type: 'float'
		},{
			name: 'lng'
			,type: 'float'
		},{
			name: 'label'
			,type: 'string'
		},{
			name: 'VehicleID'
			,type: 'int'
		},{
			name: 'BlockID'
			,type: 'int'
		},{
			name: 'Direction'
			,type: 'string'
		},{
			name: 'destination'
			,type: 'string'
		},{
			name: 'Offset'
			,type: 'integer'
		},{
			name: 'title'
			,convert: function(v, r) {
				return '#'+r.get('label')+' to '+r.get('destination');
			}
		}]
	}
});