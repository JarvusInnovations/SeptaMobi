Ext.define('SeptaMobi.view.extras.NavView', {
	extend: 'Ext.navigation.View',
	xtype: 'extrasview',
	requires: [
	],

	config: {
		items: [{
			xtype: 'panel',
			title: 'Extras',
			cls: 'extras',
		
			items: [{
				xtype: 'button',
				cls: 'perks-btn',
				iconCls: 'perk',
				text: 'Septa Pass Perks',
				action: 'showPerks'
			},{
				xtype: 'button',
				cls: 'tokens-btn',
				iconCls: 'token',
				text: 'Token Locator',
				action: 'showTokenLocator'
			}]

		}]
	}

	
})