Ext.define('SeptaMobi.view.tripplanner.SelectAddress', {
	extend: 'Ext.Sheet',
	requires: [],

	xtype: 'selectaddresspanel',

	config: {
	    cls: 'address-autocomplete-panel',
		field: null,

		stretchX: true,
		stretchY: true,

		fullscreen: true,

		layout: {
			type: 'vbox'
		},

		items: [
            {
                xtype: 'titlebar',
                docked: 'top',
                title: 'Address',
                items: [
                    {
                        xtype: 'button',
                        action: 'cancel',
                        text: 'Cancel'
                    }
                ]
            },
            {
                xtype: 'textfield',
                itemId: 'selectAddressField'
            },
            {
                xtype: 'dataview',
				store: 'AutocompleteAddress',
				emptyText: 'No Results',
				itemTpl: '{text}',
				cls: 'autocomplete-options list-style',
				itemCls: 'autocomplete-option',
				flex: 1
            }
        ]
	},

	updateShowAnimation: function(newAnimation, oldAnimation) {
		var me = this,
			selectedField, selectAddressField;

		newAnimation.on('animationend', function() { 
			selectedField = me.getField();
			selectAddressField = me.down('#selectAddressField');

			if(selectedField) {
				selectAddressField.setValue(selectedField.getValue());
			}

			selectAddressField.focus();
		}, me, {delay: 50});
    }
});