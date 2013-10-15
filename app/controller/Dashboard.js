Ext.define('SeptaMobi.controller.Dashboard', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
		},

		control: {
			'button[action=newRoute]': {
				tap: 'onNewRouteButtonTap'
			}
		}
	},

	onNewRouteButtonTap: function() {
		this.redirectTo('tripplanner');
	}

});