Ext.define('SeptaMobi.view.Dashboard', {
	extend: 'Ext.Container',
	requires: [],
	xtype: 'dashboard',
	
	config: {
		styleHtmlContent: true,
		layout: 'vbox',

		items: [{
			xtype: 'component',
			cls: 'septamobi-logo',
			html: '<img src="resources/images/septamobi-logo-big.png" alt="septa mobi logo" height="auto" width="100%" />'
		}, {
			xtype: 'button',
			text: 'New Route',
			cls: 'newroute-btn'
		}, {
			xtype: 'tabpanel',
			flex: 1,
			cls: 'dashboard',
			items: [{
				xtype: 'dataview',
				title: 'Alerts',
				itemTpl: [
					'<div>{message}</div>'
				],
				store: {
					fields: [{
						name: 'message',
						type: 'string'
					}],
					data: [{
						message: 'Alert 1'
					},{
						message: 'Schedules are not done yet'
					},{
						message: 'SEPTA'
					},{
						message: 'Another message'
					}]
				}
			}, {
				xtype: 'list',
				title: 'Bookmarks',
				cls: 'bookmarks',
				itemTpl: [
					'<div>',
						'<span class="line {lineName}">{lineName}</span>',
						'<h4>{name}</h4>',
						'<p>{to} <span class="arrow"></span> {from}</p>',
						'<span class="disclosure"/>',
					'</div>'
				],
				store: {
					fields: [{
						name: 'name',
						type: 'string'
					},{
						name: 'from',
						type: 'string'
					}, {
						name: 'to',
						type: 'string'
					}, {
						name: 'lineName',
						type: 'string'
					}],
					data: [{
						name: 'Home to Work',
						from: '304 Arch St',
						to: '908 North 3rd St',
						lineName: '***'
					},{
						name: 'Home to Center City',
						from: '3rd St',
						to: '15th St Station',
						lineName: 'MFL'
					},{
						name: 'Stadium to Center City',
						from: 'Att Station',
						to: '15th St Station',
						lineName: 'BSL'
					}]
				}
			}]
		}]
	}
});