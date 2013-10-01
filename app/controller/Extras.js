Ext.define('SeptaMobi.controller.Extras', {
	extend: 'Ext.app.Controller',
	requires: [
	   
	],

	config: {
		views: [
			'perks.NavView',
			'extras.NavView'
		],
		stores: [
			'Perks'
		],
		models: [
			'Perk'
		],
		refs: {
			perksNavView: {
			    selector: 'perksview',
			    xtype: 'perksview',
			    autoCreate: true
			},

			extrasNavView: 'extrasview'
		},
		control: {
			
			'selectfield#perkSorter': {
				change: 'sortPerks'
			},

			'button[action=showPerks]': {
				tap: 'showPerks'
			},

			'button[action=showTokenLocator]': {
				tap: 'showTokenLocator'
			}
		}
	},

	showPerks: function(btn) {
	    var me = this
	    	,extrasView = me.getExtrasNavView()
	    	,perksView = me.getPerksNavView();

	    extrasView.push(perksView);
	    console.log('Showing perks', perksView, extrasView);
	},

	onPerksViewRender: function (navView) {
		console.warn('On Perks View render');
	},

	sortPerks: function(selectfield, value, oldValue) {
		console.warn('Sort Perks', value, oldValue, selectfield);
	},

	showTokenLocator: function(btn) {
	    var me = this;

	    console.log('Show Token Locator');
	}


});