Ext.define('SeptaMobi.store.Buses', {
	extend: 'Ext.data.Store'
	,requires: [
		'SeptaMobi.model.Bus'
	]
	
	,config: {
		model: 'SeptaMobi.model.Bus'
		,proxy: {
			type: 'ajax'
			,url: (window.SeptaMobi_API && SeptaMobi_API.busPositions) || ((window.location.protocol == 'http:' ? './api/bus-positions.json' : 'http://septa.mobi/api/bus-positions.json'))
			,reader: {
				type: 'json'
				,rootProperty: 'bus'
				,idProperty: 'trainno'
			}
		}
	}
});
