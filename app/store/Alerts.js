Ext.define('SeptaMobi.store.Alerts', {
	extend: 'Ext.data.Store',
	requires: ['SeptaMobi.proxy.APIProxy', 'SeptaMobi.model.Alert'],

	config: {
		autoLoad: true,
		model: 'SeptaMobi.model.Alert',
		proxy: {
			type: 'ajax',
			pageParam: false,
			limitParam: false,
			startParam: false,
			url: (window.SeptaMobi_API && SeptaMobi_API.alert) || (location.protocol == 'http:' ? './api/alert' : 'http://www3.septa.org/hackathon/Alerts/get_alert_data.php?req1=all'),
			reader: {
				type: 'json'
			},
			noCache: false
		},

		filters: [{
			filterFn: function(r) {
		        return r.get('advisory_message') != '' || r.get('detour_message') != '';
		    }
		}]
	}
});