Ext.define('SeptaMobi.view.extras.Tokens', {
	extend: 'Ext.tab.Panel',
	xtype: 'tokensview',
	requires: [
		'Ext.field.Select',
		'Jarvus.touch.ux.LeafletMap'
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

				itemTpl: [
					'<div class="token name">{name}</div>',
					'<div class="token address">{address1}</div>',
					'<div class="token description>{description}</div>'
				],
				flex: 1
			}]
		}, {
			xtype: 'leafletmap',
			title: 'Map',
	        tileLayerOptions: { detectRetina: true},
			useCurrentLocation: true,
			autoMapCenter: false,
			enableOwnPositionMarker: true,
			mapOptions: {
				zoom: 15
			}
		}]
	}
	
})