Ext.define('SeptaMobi.store.NearByPerks', {
	extend: 'Ext.data.Store',
	requires: [
		'SeptaMobi.model.NearByPerk'
	],

	config: {
		model: 'SeptaMobi.model.NearByPerk',

		proxy: {
			type: 'ajax',
			url: (window.SeptaMobi_API && SeptaMobi_API.perksNearPoint) || (location.protocol == 'http:' ? './api/perksNearPoint' : 'http://www3.septa.org/hackathon/locations/get_locations.php'),
			reader: {
				type: 'json'
			},
			extraParams: {
				'type': 'perk_locations',
				'radius': 3
			}
		}
	}
})