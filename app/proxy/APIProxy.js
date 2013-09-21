Ext.define('SeptaMobi.proxy.APIProxy', {
	extend: 'Ext.data.proxy.Ajax',
	alias: 'proxy.api',
	requires: [
		'SeptaMobi.API'
	],

	config: {
		pageParam: false,
		limitParam: false,
		startParam: false,
		reader: {
			type: 'json'
		}
	},

	getUrl: function() {
		var url = this.callParent(arguments);
		return SeptaMobi.API.buildUrl(url);
	},

	getParams: function(operation) {
		var params = this.callParent(arguments);
		return SeptaMobi.API.buildParams(params);
	}
});