Ext.define('SeptaMobi.store.Stops', {
	extend: 'Ext.data.Store',
	requires: ['SeptaMobi.model.Stop'],

	config: {
		model: 'SeptaMobi.model.Stop'
	}
});