Ext.define('SeptaMobi.view.Schedule.Index', {
	extend: 'Ext.navigation.View',

	requires: ['Ext.SegmentedButton', 'Ext.dataview.List'],

	xtype: 'scheduleindex',

	config: {
		items: [{
			title: 'Schedule',

			layout: {
				type: 'vbox'
			},
			items: [{

				xtype: 'segmentedbutton',
				items: [{
					//Todo remove , only using for testing
					text: 'All',
					pressed: true
				}, {
					text: 'Bus',
					routeType: 3 
				}, {
					text: 'Subway',
					routeType: 1
				}, {
					text: 'Rail',
					routeType: 2
				}]
			}, {
				xtype: 'list',
				store: 'Routes',
				flex: 1,
				itemTpl: [
					'<div>',
						'<span>{displayName}</span>',
					'</div>'
				]
			}]
		}]
	}
});