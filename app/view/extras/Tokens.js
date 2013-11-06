Ext.define('SeptaMobi.view.extras.Tokens', {
	extend: 'Ext.tab.Panel',
	xtype: 'tokensview',
	requires: [
		'Ext.field.Select',
		'SeptaMobi.view.Map'
	],

	config: {
		markers: null,

		title: 'Septa Tokens',
		cls: 'tokens',
		items: [{
			xtype: 'container',
			title: 'List',
			layout: {
				type: 'vbox'
			},

			items: [{
				xtype: 'list',
				store: 'Tokens',
				itemId: 'tokensList',
				itemTpl: [
					'<div class="token name">{name}</div>',
					'<div class="token address">{address1}</div>',
					'<div class="token description>{description}</div>'
				],
				flex: 1
			}]
		}, {
			xtype: 'map'
		}]
	}
	
})