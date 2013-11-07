Ext.define('SeptaMobi.view.tripplanner.SelectAddress', {
	extend: 'Ext.Panel',
	requires: [],

	xtype: 'selectaddresspanel',

	config: {
	    cls: 'address-autocomplete-panel',
		field: null,

		height: 200,
		width: '100%',

		modal: true,
		hideOnMaskTap: true,

		layout: {
			type: 'vbox'
		},

		items: [{
			xtype: 'dataview',
			store: 'AutocompleteAddress',
			emptyText: 'No Results',
			itemTpl: '{text}',
			cls: 'autocomplete-options list-style',
			itemCls: 'autocomplete-option',
			flex: 1
		}, {
			xtype: 'button',
			text: 'Cancel',
			action: 'cancel'
		}]
	}
});