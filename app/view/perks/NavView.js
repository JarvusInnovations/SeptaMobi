Ext.define('SeptaMobi.view.perks.NavView', {
	extend: 'Ext.Container',
	xtype: 'perksview',
	requires: [
		'Ext.field.Select'
	],

	config: {
		title: 'Septa Pass Perks',
		cls: 'perks',
		// items: [{
		// 	xtype: 'container',
			layout: {
				type: 'vbox'
			},

			items: [{
				xtype: 'selectfield',
				itemId: 'perkSorter',
				label: 'Sort By:',
				labelWidth: '60px',
				options: [
					{text: 'End Date', value: 'endDate_DSC'}
					,{text: 'Locations Near Me', value: 'nearme'}
				],
				// scrollDock: 'top',
				// docked: 'top'
			},{
				xtype: 'list',
				store: 'Perks',
				// title: 'Septa Pass Perks',
				itemTpl: [
					'<div class="perk loc-name">{loc_name}</div>',
					'<div class="perk name">{perk_name}</div>',
					'<div class="perk date">Offer ends on {endDate}</div>',
					'<div class="perk address">{address1}</div>',
					'<div class="perk description>{description}</div>'
				],
				flex: 1
			}]
		// }]
	}

	
})