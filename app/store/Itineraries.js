Ext.define('SeptaMobi.store.Itineraries', {
	extend: 'Ext.data.Store',
	requires: ['SeptaMobi.model.Itinerary'],

	config: {
		model: 'SeptaMobi.model.Itinerary',

		sorters: 'startTime'
	}
});