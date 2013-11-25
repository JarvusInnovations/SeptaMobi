Ext.define('SeptaMobi.store.Trolleys', {
	extend: 'SeptaMobi.store.Routes',
	requires: ['SeptaMobi.store.Routes'],

	config: {
		proxy: {
			url: (window.SeptaMobi_API && SeptaMobi_API.trolleys) || (location.protocol == 'http:' ? './api/trolleys' : 'http://next-transit.com/route_types/trolleys/routes')
		}
	}
});