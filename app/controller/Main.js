Ext.define('SeptaMobi.controller.Main', {
	extend: 'Ext.app.Controller',

	config: {
		refs: {
			mainTabView: 'main'
		},

		control: {
			mainTabView: {
				activeitemchange: 'onMainTabViewActiveItemChange'
			}
		}
	},

	onMainTabViewActiveItemChange: function(tabpanel, item) {
		var me = this;

		switch(tabpanel.indexOf(item)) {
			case 0: {
				me.pushPath('dashboard');
				break;
			}
			case 3: {
				me.pushPath('tripplanner');
				break;
			}
		}
	}
});