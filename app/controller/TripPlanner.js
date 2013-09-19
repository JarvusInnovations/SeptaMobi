Ext.define('SeptaMobi.controller.TripPlanner', {
	extend: 'Ext.app.Controller',
	
	config:{
		views: [
			'TripPlanner.Form'
		],
		refs: {
			fromField: 'tripplanner #fromField',
			toField: 'tripplanner #toField',
			fromUseCurrent: 'tripplanner #fromUseCurrent',
			toUseCurrent: 'tripplanner #toUseCurrent'
		},
		control: {
			'tripplanner #fromUseCurrent': {
				change: 'onFromUseCurrentChange'
			},
			'tripplanner #toUseCurrent': {
				change: 'onToUseCurrentChange'
			}
		}
	},

	onFromUseCurrentChange: function( fromUseCurrent, newValue ) {
		var me = this,
			otherCheckField = me.getToUseCurrent(),
			textField = me.getFromField();

		this.setUseCurrent(newValue, otherCheckField, textField);
	},

	onToUseCurrentChange: function( toUseCurrent, newValue ) {
		var me = this,
			otherCheckField = me.getFromUseCurrent(),
			textField = me.getToField();

		this.setUseCurrent(newValue, otherCheckField, textField);
	},

	setUseCurrent: function(value, otherCheckField, textField) {
		var me = this;

		if(value) {
			otherCheckField.setChecked(false);
			textField.setValue('Current Location');
		} else {
			textField.setValue('');
		}
	}
});