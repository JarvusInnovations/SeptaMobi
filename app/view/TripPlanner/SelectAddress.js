Ext.define('SeptaMobi.view.TripPlanner.SelectAddress', {
	extend: 'Ext.Panel',
	requires: [],

	xtype: 'selectaddresspanel',

	config: {
		field: null,

		height: 200,
		width: '95%',

		modal: true,
		hideOnMaskTap: true,

		layout: {
			type: 'vbox'
		},

		items: [{
			xtype: 'dataview',
			store: 'AutocompleteAddress',
			emptyText: 'No Results',
			itemTpl: '<div>{text}</div>',
			flex: 1
		}, {
			xtype: 'button',
			text: 'Cancel',
			action: 'cancel'
		}]
	}
});