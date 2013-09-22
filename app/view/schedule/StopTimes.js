Ext.define('SeptaMobi.view.schedule.StopTimes', {
	extend: 'Ext.dataview.DataView',
	xtype: 'schedule-stoptimes',

	config: {
		times: null,

		title: 'Times',
		
		store: 'StopTimes',

		itemTpl: [
			'<div>',
				'<span>{time:date("m/d/Y g:i A")} {phase}</span>',
			'</div>'
		]
	}
});