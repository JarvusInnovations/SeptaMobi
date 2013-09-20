Ext.define('SeptaMobi.controller.TripPlanner', {
	extend: 'Ext.app.Controller',

	requires: [
		'Ext.util.Geolocation',
		'SeptaMobi.API'
	],

	config: {
		toAddress: null,
		fromAddress: null,

		views: [
			'TripPlanner.Form',
			'TripPlanner.SelectAddress'
		],
		stores: [
			'AutocompleteAddress'
		],
		refs: {
			tripPlannerForm: 'tripplanner',
			fromField: 'tripplanner #fromField',
			toField: 'tripplanner #toField',
			fromUseCurrent: 'tripplanner #fromUseCurrent',
			toUseCurrent: 'tripplanner #toUseCurrent',
			tripPlannerDatetimeField: 'tripplanner datetimepickerfield',
			selectAddressPanel: {
				selector: 'selectaddresspanel',
				autoCreate: true,

				xtype: 'selectaddresspanel'
			}
		},
		control: {
			'tripplanner #fromField': {
				focus: 'onAddressFieldFocus',
				keyup: 'onAddressFieldKeyUp'
			},
			'tripplanner #toField': {
				focus: 'onAddressFieldFocus',
				keyup: 'onAddressFieldKeyUp'
			},
			'tripplanner #fromUseCurrent': {
				change: 'onUseCurrentChange'
			},
			'tripplanner #toUseCurrent': {
				change: 'onUseCurrentChange'
			},
			'tripplanner button[action=reverse]': {
				tap: 'onReverseTap'
			},
			'tripplanner button[action=route]': {
				tap: 'onRouteTap'
			},
			'selectaddresspanel button[action=cancel]': {
				tap: 'onSelectAddressPanelCancelTap'
			},
			'selectaddresspanel dataview': {
				select: 'onSelectAddressPanelAddressSelect'
			}
		}
	},

	onAddressFieldFocus: function(field) {
		var me = this,
			autocompleteAddressStore = Ext.getStore('AutocompleteAddress'),
			selectAddressPanel = me.getSelectAddressPanel();

		autocompleteAddressStore.getProxy().setExtraParam('prefix', field.getValue());
		autocompleteAddressStore.load();

		selectAddressPanel.setField(field);
		selectAddressPanel.showBy(field);
	},

	onAddressFieldKeyUp: function(field) {
		var me = this,
			autocompleteAddressStore = Ext.getStore('AutocompleteAddress');

		autocompleteAddressStore.getProxy().setExtraParam('prefix', field.getValue());
		autocompleteAddressStore.load();
	},

	onUseCurrentChange: function(field, newValue) {
		var me = this,
			fromCheckField = me.getFromUseCurrent(),
			toCheckField = me.getToUseCurrent(),
			otherCheckField, textField;

		if (field == fromCheckField) {
			otherCheckField = toCheckField,
			textField = me.getFromField();
		} else if (field == toCheckField) {
			otherCheckField = fromCheckField;
			textField = me.getToField();
		}

		this.setUseCurrent(newValue, otherCheckField, textField);

		if (!me.geo) {
			me.geo = Ext.create('Ext.util.Geolocation', {
				autoUpdate: false,
				listeners: {
					locationupdate: function(geo) {
						if (field == fromCheckField) {
							me.setFromAddress(Ext.create('SeptaMobi.model.Address', {
								lat: geo.getLatitude(),
								lon: geo.getLongitude()
							}));
						} else if (field == toCheckField) {
							me.setToAddress(Ext.create('SeptaMobi.model.Address', {
								lat: geo.getLatitude(),
								lon: geo.getLongitude()
							}));
						}
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
			originalFromAddress = me.getFromAddress(),
			originalFromValue = fromField.getValue(),
			originalFromUseCurrentValue = fromUseCurrent.getChecked();

		fromField.setValue(toField.getValue());
		fromUseCurrent.setChecked(toUseCurrent.getChecked());

		toField.setValue(originalFromValue);
		toUseCurrent.setChecked(originalFromUseCurrentValue);

		me.setFromAddress(me.getToAddress());
		me.setToAddress(originalFromValue);
	},

	onRouteTap: function() {
		var me = this,
			fromAddress = me.getFromAddress(),
			toAddress = me.getToAddress(),
			tripPlannerForm = me.getTripPlannerForm(),
			tripPlannerDatetimeField = me.getTripPlannerDatetimeField(),
			lat, lon;

		//Validate
		if (!fromAddress) {
			Ext.Msg.alert('Please enter a valid from address');
			return;
		}
		if (!toAddress) {
			Ext.Msg.alert('Please enter a valid from address');
			return;
		}

		if(!me.validateAddress(fromAddress)) {
			return;
		}
		if(!me.validateAddress(toAddress)) {
			return;
		}

		tripPlannerForm.setMasked({
			xtype: 'loadmask',
			message: 'Loading Routes&hellip;'
		});

		SeptaMobi.API.getDirections(fromAddress, toAddress, tripPlannerDatetimeField.getValue(), function(options, success, response) {
			if(success) {
				alert(response.data.plan);
			}
			else {
				Ext.Msg.alert('Could not load directions, please try again later');
				//TODO Deal with error
			}
			tripPlannerForm.setMasked(false);
		});
	},

	validateAddress: function(address) {
		var me = this,
			tripPlannerForm = me.getTripPlannerForm();

		if (!address.get('lat') || !address.get('lon')) {
			tripPlannerForm.setMasked({
				xtype: 'loadmask',
				message: 'Geocoding Address&hellip;'
			});

			SeptaMobi.API.getGeocode(address, function(options, success, response) {
				if(success && response.data && response.data.length > 0) {
					lat = response.data[0].metadata.latitude;
					lon = response.data[0].metadata.longitude;

					if (lat && lon) {
						address.set('lon', lon);
						address.set('lat', lat);
						me.onRouteTap();
					} else {
						Ext.Msg.alert('Could not geocode from address: ' + address.get('text'));
					}
				}
				else {
					//TODO deal with error
				}
			}, me);

			return false;
		}
		return true;
	},

	onSelectAddressPanelCancelTap: function() {
		this.getSelectAddressPanel().hide();
	},

	onSelectAddressPanelAddressSelect: function(dataview, record) {
		var me = this,
			selectAddressPanel = me.getSelectAddressPanel(),
			selectAddressPanelField = selectAddressPanel.getField(),
			toField = me.getToField(),
			fromField = me.getFromField();

		if (selectAddressPanelField) {
			selectAddressPanelField.setValue(record.get('text'));

			if (selectAddressPanelField == toField) {
				me.setToAddress(record);
			} else if (selectAddressPanelField == fromField) {
				me.setFromAddress(record);
			}
		}

		me.getSelectAddressPanel().hide();
	}
});