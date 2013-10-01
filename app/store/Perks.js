Ext.define('SeptaMobi.store.Perks', {
	extend: 'Ext.data.Store',
	requires: [
		'SeptaMobi.model.Perk'
	],

	config: {
		model: 'SeptaMobi.model.Perk',

		proxy: {
			type: 'ajax',
			api: {
				read: 'perksdata.json'
			},
			reader: {
				type: 'json',
				// root: 'data'
			}
		},

		autoLoad: true
	}
})