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
			url: location.protocol == 'http:' ? '/autocomplete' : 'https://autocomplete-api.smartystreets.com/suggest',
			reader: {
				type: 'json',
				rootProperty: 'suggestions'
			},
			extraParams: {
				'auth-id': '5519210895803725602'
			}
		}
	}
});