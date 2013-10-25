Ext.define('SeptaMobi.controller.Dashboard', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
		},
		stores: [
			'Alerts'
		],

		control: {
			'dashboard': {
				activate: 'onDashboardActivate'
			},
			'button[action=newRoute]': {
				tap: 'onNewRouteButtonTap'
			},
			'dashboard #bookmarkslist': {
				select: 'onBookmarkSelected'
			}
		}
	},

	onDashboardActivate: function() {
		this.pushPath('dashboard');
	},

	onNewRouteButtonTap: function() {
		this.redirectTo('tripplanner');
	},

	onBookmarkSelected: function(list, record) {
		this.redirectTo(record.toUrl());
	}

});