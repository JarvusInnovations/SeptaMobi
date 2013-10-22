Ext.define('SeptaMobi.view.Dashboard', {
	extend: 'Ext.Container',
	requires: ['SeptaMobi.store.Alerts'],
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
			cls: 'newroute-btn',
			action: 'newRoute'
		}, {
			xtype: 'tabpanel',
			flex: 1,
			cls: 'dashboard',
			items: [{
				xtype: 'dataview',
				title: 'Alerts',
				cls: 'alerts',
				itemTpl: [
					'<div>{message}</div>',
					'<span class="bus-number">{route_name}</span>',
					'<span>{[this.getMessage(values)]}</span>',
					{
						getMessage: function(record) {
							return record.advisory_message || record.detour_message;
						}
					}
				],
				store: 'Alerts'
			}, {
				xtype: 'list',
				title: 'Bookmarks',
				cls: 'bookmarks',
				itemTpl: [
					'<div class="bookmark">',
						//removed {lineName} '<div class="line {lineName}">{lineName}</div>',
						'<div class="line {lineName}"></div>',
						'<div class="text"><h4>{name}</h4>',
						'<p>{fromName} <span class="arrow"></span> {toName}</p>',
						'<span class="disclosure"/></div>',
					'</div>'
				],
				store: 'Bookmarks',
				emptyText: 'No bookmarks yet!'
				// store: {
				// 	fields: [{
				// 		name: 'name',
				// 		type: 'string'
				// 	},{
				// 		name: 'from',
				// 		type: 'string'
				// 	}, {
				// 		name: 'to',
				// 		type: 'string'
				// 	}, {
				// 		name: 'lineName',
				// 		type: 'string'
				// 	}],
				// 	data: [{
				// 		name: 'Home to Work',
				// 		from: '304 Arch St',
				// 		to: '908 North 3rd St',
				// 		lineName: '***'
				// 	},{
				// 		name: 'Home to Center City',
				// 		from: '3rd St',
				// 		to: '15th St Station',
				// 		lineName: 'MFL'
				// 	},{
				// 		name: 'Stadium to Center City',
				// 		from: 'Att Station',
				// 		to: '15th St Station',
				// 		lineName: 'BSL'
				// 	}]
				// }
			}]
		}]
	}
});