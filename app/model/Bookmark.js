Ext.define('SeptaMobi.model.Bookmark', {
	extend: 'Ext.data.Model',

	config: {
		// idProperty: 'uid',

		fields:[{
			name: 'uid',
			type: 'string',
			convert: function(v,r) {
				var data = Ext.clone(r.getData());

				delete data.id;
				delete data.uid;
				delete data.name;
				delete data.lineName;
				
				if(data.toName == 'Current Location') {
					delete data.toLat;
					delete data.toLon;
				}

				if(data.fromName == 'Current Location') {
					delete data.fromLat;
					delete data.fromLon;
				}

				return JSON.stringify(data);
			}
		}, {
			name: 'stopId',
			useNull: true,
			type: 'int'
		},{
			name: 'name',
			type: 'string'
		},{
			name: 'toName',
			type: 'string'
		},{
			name: 'toLat',
			type: 'double'
		},{
			name: 'toLon',
			type: 'double'
		},{
			name: 'fromName',
			type: 'string'
		},{
			name: 'fromLat',
			type: 'double'
		},{
			name: 'fromLon',
			type: 'double'
		},{
			name: 'lineName',
			convert: function() {
				return '***';
			}
		}]
	}
});