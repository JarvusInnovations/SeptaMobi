Ext.define('SeptaMobi.store.StopTimes', {
	extend: 'Ext.data.Store',
	requires: ['SeptaMobi.model.StopTime'],

	config: {
		model: 'SeptaMobi.model.StopTime',
		proxy: {
			type: 'ajax',
			pageParam: false,
			limitParam: false,
			startParam: false,
			reader: {
				type: 'json',
				rootProperty: 'data'
			},
			rootUrl: (window.SeptaMobi_API && SeptaMobi_API.stopTimes) || (location.protocol == 'http:' ? './api/stoptimes' : 'http://next-transit.com/routes/'),
			extraParams: {
				'api_key': 't40P65kd'
			}
		}
	}
});