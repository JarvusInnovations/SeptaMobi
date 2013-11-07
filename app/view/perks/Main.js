Ext.define('SeptaMobi.view.perks.Main', {
	extend: 'Ext.tab.Panel',
	xtype: 'perksview',
	requires: [
		'Ext.field.Select',
		'SeptaMobi.view.Map'
	],

	config: {
		perkMarkers: null,

		title: 'Septa Pass Perks',
		cls: 'perks',
		items: [{
			xtype: 'container',
			title: 'List',
			layout: {
				type: 'vbox'
			},

			items: [{
				xtype: 'selectfield',
				itemId: 'perkSorter',
				label: 'Sort By:',
				labelWidth: '70px',
				options: [
					{text: 'End Date', value: 'endDate_DSC'}
					,{text: 'Locations Near Me', value: 'nearme'}
				]
			},{
				xtype: 'list',
				store: 'Perks',
				itemId: 'perksList',
				itemTpl: [
					'<div class="perk loc-name">{loc_name}</div>',
					'<div class="perk name">{name}</div>',
					'<div class="perk date">Offer ends on {endDate}</div>',
					'<div class="perk address">{address1}</div>',
					'<div class="perk description>{description}</div>'
				],
				flex: 1
			}]
		}, {
			xtype: 'map'
		}]
	}
	
})