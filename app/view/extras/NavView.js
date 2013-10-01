Ext.define('SeptaMobi.view.extras.NavView', {
	extend: 'Ext.navigation.View',
	xtype: 'extrasview',
	requires: [
	],

	config: {
		items: [{
			xtype: 'panel',
			title: 'Extras',
		
			items: [{
				xtype: 'button',
				cls: 'perks-btn',
				text: 'Septa Pass Perks',
				action: 'showPerks'
			},{
				xtype: 'button',
				cls: 'tokens-btn',
				text: 'Token Locator',
				action: 'showTokenLocator'
			}]

		}]
	}

	
})