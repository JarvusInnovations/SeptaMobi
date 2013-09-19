Ext.define('SeptaMobi.controller.TripPlanner', {
	extend: 'Ext.app.Controller',

	config: {
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
			},
			'tripplanner button[action=reverse]': {
				tap: 'onReverseTap'
			}
		}
	},

	onFromUseCurrentChange: function(fromUseCurrent, newValue) {
		var me = this,
			otherCheckField = me.getToUseCurrent(),
			textField = me.getFromField();

		this.setUseCurrent(newValue, otherCheckField, textField);

		if (!me.geo) {
			me.geo = Ext.create('Ext.util.Geolocation', {
				autoUpdate: false,
				listeners: {
					locationupdate: function(geo) {
						// alert('New latitude: ' + geo.getLatitude());
						me.lat = geo.getLatitude();
						me.lon = geo.getLongitude();
					},
					locationerror: function(geo, bTimeout, bPermissionDenied, bLocationUnavailable, message) {
						if (bTimeout) {
							alert('Timeout occurred.');
						} else {
							alert('Error occurred.');
						}
					}
				}
			});
		}

		me.geo.updateLocation();
	},

	onToUseCurrentChange: function(toUseCurrent, newValue) {
		var me = this,
			otherCheckField = me.getFromUseCurrent(),
			textField = me.getToField();

		this.setUseCurrent(newValue, otherCheckField, textField);
	},

	setUseCurrent: function(value, otherCheckField, textField) {
		var me = this;

		if (value) {
			otherCheckField.setChecked(false);
			textField.setValue('Current Location');
		} else if (textField.getValue() == 'Current Location') {
			textField.setValue('');
		}
	},

	onReverseTap: function() {
		var me = this,
			fromField = me.getFromField(),
			toField = me.getToField(),
			toUseCurrent = me.getToUseCurrent(),
			fromUseCurrent = me.getFromUseCurrent(),
			originalFromValue = fromField.getValue(),
			originalFromUseCurrentValue = fromUseCurrent.getChecked();

		fromField.setValue(toField.getValue());
		fromUseCurrent.setChecked(toUseCurrent.getChecked());

		toField.setValue(originalFromValue);
		toUseCurrent.setChecked(originalFromUseCurrentValue);
	}
});