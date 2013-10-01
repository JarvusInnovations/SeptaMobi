Ext.define('SeptaMobi.model.Route', {
	extend: 'Ext.data.Model',	

	config: {
		idProperty: 'id',
		
		fields:[{
			name: 'id',
			mapping: 'id.id',
			type: 'int'
		}, {
			name: 'routeType',
			type: 'int'
		},{
			name: 'routeShortName',
			type: 'string'
		},{
			name: 'routeLongName',
			type: 'string'
		},{
			name: 'displayName',
			convert: function(v,r) {
				if(r.get('routeType') == 3) {
					return r.get('routeLongName');
				}
				else if(r.get('routeShortName') == r.get('routeLongName')) {
					return r.get('routeShortName');
				}
				else {
					return r.get('routeShortName') + ' ' + r.get('routeLongName');
				}
			}
		}]
	}
});