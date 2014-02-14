Ext.define('SeptaMobi.store.RouteStopTimes', {
	extend: 'Ext.data.Store',
	requires: ['SeptaMobi.model.StopTime'],

	config: {
		model: 'SeptaMobi.model.StopTime',
		filters: [{
			fn: function(r) {
				return r.get('dateTime') > (new Date());
			}
		}]
	}

});