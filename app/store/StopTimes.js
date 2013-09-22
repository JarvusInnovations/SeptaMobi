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
			url: location.protocol == 'http:' ? './api/stoptimes' : 'http://opentrips.codeforphilly.org/opentripplanner-api-webapp/ws/transit/stopTimesForStop',
			reader: {
				type: 'json',
				rootProperty: 'stopTimes'
			},
			extraParams: {
				'agency': 'SEPTA'
			}
		}
	}
});