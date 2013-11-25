Ext.define('SeptaMobi.store.BusRoutes', {
	extend: 'SeptaMobi.store.Routes',
	requires: ['SeptaMobi.store.Routes'],

	config: {
		proxy: {
			url: (window.SeptaMobi_API && SeptaMobi_API.buses) || (location.protocol == 'http:' ? './api/buses' : 'http://next-transit.com/route_types/buses/routes')
		}
	}
});