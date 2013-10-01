Ext.define('SeptaMobi.view.perks.NavView', {
	extend: 'Ext.Container',
	xtype: 'perksview',
	requires: [
		'Ext.field.Select'
	],

	config: {
		title: 'Septa Pass Perks',
		// items: [{
		// 	xtype: 'container',
			layout: {
				type: 'vbox'
			},

			items: [{
				xtype: 'selectfield',
				itemId: 'perkSorter',
				label: 'Sort By',
				options: [
					{text: 'End Date', value: 'endDate_DSC'}
					,{text: 'Locations Near Me', value: 'nearme'}
				],
				height: 40
				// scrollDock: 'top',
				// docked: 'top'
			},{
				xtype: 'list',
				store: 'Perks',
				// title: 'Septa Pass Perks',
				itemTpl: [
					'{perk_name}<br>',
					'{startDate} - {endDate}<br>',
					'{loc_name} - {address1}<br>',
					,'{description}'
				],
				flex: 1
			}]
		// }]
	}

	
})