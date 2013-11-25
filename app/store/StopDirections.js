Ext.define('SeptaMobi.store.StopDirections', {
	extend: 'Ext.data.Store',
	requires: ['SeptaMobi.model.StopDirection'],

	config: {
		model: 'SeptaMobi.model.StopDirection',
		proxy: {
			type: 'ajax',
			pageParam: false,
			limitParam: false,
			startParam: false,
			reader: {
				type: 'json'
			},
			rootUrl: (window.SeptaMobi_API && SeptaMobi_API.stop_directions) || (location.protocol == 'http:' ? './api/stop-directions' : 'http://v3.septa.mobi/api/stop-directions'),
			extraParams: {
				'api_key': 't40P65kd'
			}
		}
	}
});