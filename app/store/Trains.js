Ext.define('SeptaMobi.store.Trains', {
	extend: 'SeptaMobi.store.Routes',
	requires: ['SeptaMobi.store.Routes'],

	config: {
		proxy: {
			url: (window.SeptaMobi_API && SeptaMobi_API.trains) || (location.protocol == 'http:' ? './api/trains' : 'http://next-transit.com/route_types/trains/routes')
		}
	}
});