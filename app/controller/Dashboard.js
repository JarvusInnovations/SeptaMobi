Ext.define('SeptaMobi.controller.Dashboard', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			mainTabView: 'main',
			dashboardView: 'dashboard'
		},
		stores: [
			'Alerts'
		],

		control: {
			mainTabView: {
				activeitemchange: 'onMainTabViewActiveItemChange'
			},
			'button[action=newRoute]': {
				tap: 'onNewRouteButtonTap'
			},
			'dashboard #bookmarkslist': {
				select: 'onBookmarkSelected'
			}
		}
	},

	onMainTabViewActiveItemChange: function(tabpanel, item) {
		if(tabpanel.indexOf(item) == 0) {
			this.pushPath('dashboard');
		}
	},

	onNewRouteButtonTap: function() {
		this.redirectTo('tripplanner');
	},

	onBookmarkSelected: function(list, record) {
		this.redirectTo(record.toUrl());
	}

});