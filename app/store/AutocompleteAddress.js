Ext.define('SeptaMobi.store.AutocompleteAddress', {
	extend: 'Ext.data.Store',
	requires: ['SeptaMobi.proxy.APIProxy', 'SeptaMobi.model.Address'],

	config: {
		model: 'SeptaMobi.model.Address',
		proxy: {
			type: 'ajax',
			pageParam: false,
			limitParam: false,
			startParam: false,
			url: (window.SeptaMobi_API && SeptaMobi_API.autocomplete) || (location.protocol == 'http:' ? './api/autocomplete' : 'https://maps.googleapis.com/maps/api/place/autocomplete/json'),
			reader: {
				type: 'json',
				rootProperty: 'predictions'
			},
			extraParams: {
				'key': 'AIzaSyD1uYQ7HZCNIpyuEW2eE8eANAel9LTym4g',
				'location': '39.9520,-75.1640',
				'radius': 500,
				'sensor': true
			}
		},

		filters: [{
			filterFn: function(r) {
		        return ['PA', 'DE', 'NJ'].indexOf(r.get('state')) != -1;
		    }
		}]
	}
});