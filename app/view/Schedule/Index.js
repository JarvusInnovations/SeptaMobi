Ext.define('SeptaMobi.view.Schedule.Index', {
	extend: 'Ext.tab.Panel',
	xtype: 'scheduleindex',

	layout: {
		type: 'fit'
	},
	defaults: {
		xtype: 'list',
		itemTpl: [
			'<div>',
				'<span class="line-{lineName}">{lineName}</span>',
			'</div>'
		]

	},
	items: [{
		items: [{
			title: 'Bus'
		},{
			title: 'Subway'
		}]
	}]
});