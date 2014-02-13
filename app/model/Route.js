Ext.define('SeptaMobi.model.Route', {
	extend: 'Ext.data.Model',	

	config: {
		idProperty: 'route_type_id',
		
		fields:[{
			name: 'id',
			type: 'int'
		}, {
			name: 'routeId',
			mapping: 'route_id',
			type: 'int'
		}, {
			name: 'routeType',
			mapping: 'route_type',
			type: 'int'
		},{
			name: 'routeShortName',
			mapping: 'route_short_name',
			type: 'string'
		},{
			name: 'routeLongName',
			mapping: 'route_long_name',
			type: 'string'
		},{
			name: 'slug',
			mapping: 'route_type_slug',
			type: 'string'
		},{
			name: 'displayName',
			convert: function(v,r) {
				if(r.get('routeType') == 3  || r.get('routeType') == 0 || !r.get('routeShortName')) {
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