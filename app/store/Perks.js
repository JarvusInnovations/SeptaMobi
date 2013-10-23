Ext.define('SeptaMobi.store.Perks', {
	extend: 'Ext.data.Store',
	requires: [
		'SeptaMobi.model.Perk'
	],

	config: {
		model: 'SeptaMobi.model.Perk',

		proxy: {
			type: 'ajax',
			url: (window.SeptaMobi_API && SeptaMobi_API.perks) || (location.protocol == 'http:' ? './api/perks' : 'http://appdev.septa.org/perk_data/perk_data.json'),
			reader: {
				type: 'json'
			},
			pageParam: false,
			limitParam: false,
			startParam: false,
			noCache: false
		},

		autoLoad: true
	}
})