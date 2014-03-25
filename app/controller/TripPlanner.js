Ext.define('SeptaMobi.controller.TripPlanner', {
	extend: 'Ext.app.Controller',
	requires: [
		'Jarvus.util.Polyline'
	],

	requires: [
		'Ext.util.Geolocation',
		'SeptaMobi.API',
		'SeptaMobi.view.BookmarkPanel'
	],

	config: {
		toAddress: null,
		fromAddress: null,
		tripData: null,

		views: [
			'tripplanner.NavView',
			'tripplanner.SelectAddress',
			'tripplanner.TripDetail',
			'tripplanner.TripList'
		],
		stores: [
			'AutocompleteAddress',
			'Bookmarks',
			'Itineraries'
		],
		refs: {
			mainTabView: 'main',
			tripPlannerView: 'tripplanner',
			tripPlannerForm: 'tripplanner formpanel',
			fromField: 'tripplanner #fromField',
			toField: 'tripplanner #toField',
			fromUseCurrent: 'tripplanner #fromUseCurrent',
			toUseCurrent: 'tripplanner #toUseCurrent',
			tripPlannerDatetimeField: 'tripplanner datetimepickerfield',
			selectAddressPanel: {
				selector: 'selectaddresspanel',
				autoCreate: true,

				xtype: 'selectaddresspanel'
			},
			selectAddressList: 'selectaddresspanel dataview',
			selectAddressField: 'selectaddresspanel #selectAddressField',
			tripList: {
				selector: 'triplist',
				autoCreate: true,

				xtype: 'triplist'
			},
			tripDetail: {
				selector: 'tripdetail',
				autoCreate: true,

				xtype: 'tripdetail'
			},
			tripDetailMap: 'tripdetail leafletmap',
			toggleBookmarkButton: 'tripplanner button[action=toggleBookmark]',
			bookmarkPanel: {
				selector: 'bookmarkpanel',
				autoCreate: true,

				xtype: 'bookmarkpanel',
				fullScreen: true
			}
		},
		control: {
			tripPlannerView: {
				activate: 'onTripPlannerViewActivate'
			},
			fromField: {
				tap: 'onAddressFieldTap'
			},
			toField: {
				tap: 'onAddressFieldTap'
			},
			selectAddressField: {
				keyup: 'onSelectAddressFieldKeyUp'
			},
			'tripplanner #fromUseCurrent': {
				tap: 'onUseCurrentTap'
			},
			'tripplanner #toUseCurrent': {
				tap: 'onUseCurrentTap'
			},
			'tripplanner button[action=reverse]': {
				tap: 'onReverseTap'
			},
			'tripplanner button[action=route]': {
				tap: 'onRouteTap'
			},
			selectAddressPanel: {
				show: 'onSelectAddressPanelShow'
			},
			'selectaddresspanel button[action=cancel]': {
				tap: 'onSelectAddressPanelCancelTap'
			},
			selectAddressList: {
				select: 'onSelectAddressPanelAddressSelect'
			},
			triplist: {
				activate: 'onTripListActivate'
			},
			'triplist dataview': {
				select: 'onTripSelect'
			},
			'tripdetail leafletmap': {
				maprender: 'onTripDetailMapRender'
			},
			'tripdetail carousel': {
				activeitemchange: 'onCarouselActiveItemChange'
			},
			'tripplanner': {
				transitioncomplete: 'onTripPlannerNavTransitionComplete'
			},
			toggleBookmarkButton: {
				tap: 'onTripPlannerToggleBookmarkTapped'
			}
		},
		routes: {
			'tripplanner': 'showTripPlanner',
			'tripplanner/trip/:params': {
				action: 'showTrip',
				conditions: {
					':params': '[^/]+'
				}
			}
		}
	},

	showTripPlanner: function() {
		var me = this,
			mainTabView = me.getMainTabView(),
			tripPlannerForm = me.getTripPlannerForm(),
			tripPlannerNavView = me.getTripPlannerView();

		mainTabView.setActiveItem(3);
		tripPlannerNavView.pop(tripPlannerForm);
	},

	showTrip: function(params) {
		var me = this,
			params = Ext.Object.fromQueryString(params),
			fromText = params.fromName,
			fromLat = params.fromLat,
			fromLon = params.fromLon,
			toText = params.toName,
			toLat = params.toLat,
			toLon = params.toLon,
			fromField = me.getFromField(),
			toField = me.getToField(),
			tripPlannerDatetimeField = me.getTripPlannerDatetimeField(),
			fromAddress, toAddress;

		me.showTripPlanner();

		fromAddress = Ext.create('SeptaMobi.model.Address', {text: fromText, lat: fromLat, lon: fromLon});
		toAddress = Ext.create('SeptaMobi.model.Address', {text: toText, lat: toLat, lon: toLon});

		me.setFromAddress(fromAddress);
		me.setToAddress(toAddress);

		fromField.setValue(fromText);
		toField.setValue(toText);

		tripPlannerDatetimeField.setValue(new Date());
		
		me.onRouteTap();
	},

	onTripPlannerViewActivate: function() {
		this.pushPath('tripplanner');
	},

	onAddressFieldTap: function(field) {
		var me = this,
			autocompleteAddressStore = Ext.getStore('AutocompleteAddress'),
			selectAddressPanel = me.getSelectAddressPanel();

		me.updateAutoCompleteAddress(field);
		selectAddressPanel.setField(field);
		selectAddressPanel.show();
	},

	onSelectAddressFieldKeyUp: Ext.Function.createBuffered(function(field) {
		this.updateAutoCompleteAddress(field);
	}, 750),

	updateAutoCompleteAddress: function(field) {
		var me = this,
			autocompleteAddressStore = Ext.getStore('AutocompleteAddress');

		if(field.getValue()) {
			autocompleteAddressStore.getProxy().setExtraParam('input', field.getValue());
			autocompleteAddressStore.load();
		}
		else {
			autocompleteAddressStore.removeAll();
		}
	},

	onUseCurrentTap: function(checkButton) {
		var me = this,
			newValue = checkButton.getCls().indexOf('x-button-pressed') == -1,
			fromCheckButton = me.getFromUseCurrent(),
			fromTextField = me.getFromField(),
			toCheckButton = me.getToUseCurrent(),
			toTextField = me.getToField(),
			otherCheckButton, textField, otherTextField;

		if (checkButton == fromCheckButton) {
			otherCheckButton = toCheckButton;
			textField = fromTextField;
			otherTextField = toTextField;
		} else if (checkButton == toCheckButton) {
			otherCheckButton = fromCheckButton;
			textField = toTextField;
			otherTextField = fromTextField;
		}

		if (newValue) {
			checkButton.addCls('x-button-pressed');
			otherCheckButton.removeCls('x-button-pressed');
			textField.setValue('Current Location');
			textField.disable();

			if (otherTextField.isDisabled()) {
				otherTextField.enable();
				otherTextField.setValue('');
			}
		} else {
			checkButton.removeCls('x-button-pressed');
			textField.setValue('');
			textField.enable();
		}

		if (!me.geo) {
			me.geo = Ext.create('Ext.util.Geolocation', {
				autoUpdate: false,
				listeners: {
					locationupdate: function(geo) {
						me[checkButton == fromCheckButton ? 'setFromAddress' : 'setToAddress'](Ext.create('SeptaMobi.model.Address', {
							lat: geo.getLatitude(),
							lon: geo.getLongitude(),
							text: 'Current Location'
						}));
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

	onReverseTap: function() {
		var me = this,
			fromField = me.getFromField(),
			toField = me.getToField(),
			toUseCurrent = me.getToUseCurrent(),
			fromUseCurrent = me.getFromUseCurrent(),
			originalFromAddress = me.getFromAddress(),
			originalFromValue = fromField.getValue(),
			originalFromUseCurrentValue = fromUseCurrent.getCls().indexOf('x-button-pressed') != -1;

		fromField.setValue(toField.getValue());
		if (toUseCurrent.getCls().indexOf('x-button-pressed') != -1) {
			fromUseCurrent.addCls('x-button-pressed');
			if (!fromField.isDisabled()) {
				fromField.disable();
			}
		} else {
			fromUseCurrent.removeCls('x-button-pressed');
			if (fromField.isDisabled()) {
				fromField.enable();
			}
		}

		toField.setValue(originalFromValue);
		if (originalFromUseCurrentValue) {
			toUseCurrent.addCls('x-button-pressed');
			if (!toField.isDisabled()) {
				toField.disable();
			}
		} else {
			toUseCurrent.removeCls('x-button-pressed');
			if (toField.isDisabled()) {
				toField.enable();
			}
		}

		me.setFromAddress(me.getToAddress());
		me.setToAddress(originalFromAddress);
	},

	onRouteTap: function() {
		var me = this,
			fromAddress = me.getFromAddress(),
			toAddress = me.getToAddress(),
			tripPlannerView = me.getTripPlannerView(),
			tripPlannerDatetimeField = me.getTripPlannerDatetimeField(),
			departTime = tripPlannerDatetimeField.getValue(),
			tripList = me.getTripList(),
			itinerariesStore = Ext.getStore('Itineraries'),
			tripPlan, lat, lon;

		//Validate
		if (!fromAddress) {
			Ext.Msg.alert('Routing Problem', 'The “from” address entered was not recognized by the system. Try choosing an address from the suggested list.');
			return;
		}
		if (!toAddress) {
			Ext.Msg.alert('Routing Problem', 'The “to” address entered was not recognized by the system. Try choosing an address from the suggested list.');
			return;
		}

		if (!me.validateAddress(fromAddress)) {
			tripPlannerView.setMasked(false);
			return;
		}
		if (!me.validateAddress(toAddress)) {
			tripPlannerView.setMasked(false);
			return;
		}

		tripPlannerView.setMasked({
			xtype: 'loadmask',
			message: 'Loading Routes&hellip;'
		});

		SeptaMobi.API.getDirections(fromAddress, toAddress, departTime, function(options, success, response) {
			if (success) {
				if (response.data.error) {
					Ext.Msg.alert('Routing Problem', response.data.error.msg || "Unknown error.");
				} else {
					tripPlan = {
						toName: toAddress.get('text'),
						toLat: response.data.plan.to.lat,
						toLon: response.data.plan.to.lon,
						fromName: fromAddress.get('text'),
						fromLat: response.data.plan.from.lat,
						fromLon: response.data.plan.from.lon,
						departTime: departTime
					};

					tripList.setTripPlan(tripPlan);

					me.setTripData(tripPlan);

					itinerariesStore.setData(response.data.plan.itineraries);

					tripPlannerView.push(tripList);
				}
			} else {
				Ext.Msg.alert('Routing Problem', 'There was a problem loading directions. Please try again later.');
				//TODO Deal with error
			}
			tripPlannerView.setMasked(false);
		});
	},

	validateAddress: function(address) {
		var me = this,
			tripPlannerView = me.getTripPlannerView(),
			data;

		if (!address.get('lat') || !address.get('lon')) {
			tripPlannerView.setMasked({
				xtype: 'loadmask',
				message: 'Geocoding Address&hellip;'
			});

			SeptaMobi.API.getAutoCompleteDetail(address, function(options, success, response) {
				if (success && response.data && response.data.result) {
					data = response.data.result;

					lat = data.geometry.location.lat;
					lon = data.geometry.location.lng;

					// Fix issue that was preventing models from getting updated
					address.modified = true;
					address.set('lon', lon);
					address.set('lat', lat);
					// address.set('text', data.delivery_line_1 + ", " + data.last_line);

					me.onRouteTap();
				} else {
					Ext.Msg.alert('Routing Problem', 'Sorry, could not get a location for address: ' + address.get('text'));
				}
			}, me);

			return false;
		}
		return true;
	},

	onSelectAddressPanelShow: function(panel) {
		this.getSelectAddressList().deselectAll();		
		this.getSelectAddressField().setValue(panel.getField().getValue());
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
	},

	onTripListActivate: function(tripList) {
		tripList.down('dataview').deselectAll();
	},

	onTripSelect: function(list, record, eOpts) {
		var me = this,
			tripPlannerView = me.getTripPlannerView(),
			tripDetail = me.getTripDetail(),
			tripData = me.getTripData();

		tripData.duration = record.get('duration');

		record.set('fromName', tripData.fromName);
		record.set('toName', tripData.toName);

		tripDetail.setTripData(tripData, record);
		tripPlannerView.push(tripDetail);
	},

	onTripDetailMapRender: function() {
		var me = this,
			ll = window.L,
			mapCmp = me.getTripDetailMap(),
			map = mapCmp.getMap(),
			tripDetail = me.getTripDetail(),
			itenerary = tripDetail.getItenerary(),
			legsLength = itenerary.legs.length,
			i = 0,
			lines = [],
			lineSegments = [],
			decodedPoints, bounds, multiPolyLine;

		for (; i < legsLength; i++) {
			decodedPoints = Jarvus.util.Polyline.decode(itenerary.legs[i].legGeometry.points);
			lines.push(decodedPoints);
			lineSegments.push(ll.polyline(decodedPoints));
		}

		multiPolyLine = ll.multiPolyline(lines).addTo(map);

		tripDetail.setTripLine(multiPolyLine);
		tripDetail.setTripLines(lineSegments);

		Ext.defer(function() {
			map.fitBounds(multiPolyLine.getBounds());
		}, 1000, me);
	},

	onCarouselActiveItemChange: function(carousel, item) {
		var me = this,
			index = carousel.innerItems.indexOf(item) - 1,
			mapCmp = me.getTripDetailMap(),
			map = mapCmp.getMap(),
			tripDetail = me.getTripDetail(),
			tripLines = tripDetail.getTripLines();

		if(map && index >= 0 && index < tripLines.length) {
			map.fitBounds(tripLines[index].getBounds());
		}
	},

	onTripPlannerNavTransitionComplete: function(incomingItem, outgoingItem) {
		var bookmarkStore = Ext.getStore('Bookmarks'),
			toggleBookmarkButton = this.getToggleBookmarkButton(),
			plan, bookmark;

		if (outgoingItem.isXType('triplist')) {
			plan = outgoingItem.getTripPlan();
			bookmark = Ext.create('SeptaMobi.model.Bookmark', plan);

			this.pushPath(bookmark.toUrl());

			if(bookmarkStore.hasBookmark(bookmark)) {
				toggleBookmarkButton.addCls('bookmarked');
			}
			else {
				toggleBookmarkButton.removeCls('bookmarked');
			}

			toggleBookmarkButton.show();
		} else {
			toggleBookmarkButton.hide();
		}
	},

	onTripPlannerToggleBookmarkTapped: function(button) {
		var me = this,
			tripList = me.getTripList(),
			plan = tripList.getTripPlan(),
			bookmarkStore = Ext.getStore('Bookmarks'),
			bookmark = Ext.create('SeptaMobi.model.Bookmark', plan),
			bookmarkIndex, bookmarkPanel;

		if(button.getCls() && button.getCls().indexOf('bookmarked') != -1) {
			bookmarkIndex = bookmarkStore.findExact('uid', bookmark.get('uid'));
			if(bookmarkIndex != -1) {
				bookmarkStore.removeAt(bookmarkIndex);
				bookmarkStore.sync();

				button.removeCls('bookmarked');

				Ext.Msg.alert('Info', 'Bookmark has been removed.', Ext.emptyFn);
			}
			else {
				Ext.Msg.alert('Error', 'Bookmark could not be found.', Ext.emptyFn);
			}
		}
		else {
			bookmarkPanel = me.getBookmarkPanel(),

			bookmarkPanel.setButton(button);
			bookmarkPanel.setBookmark(bookmark);

			Ext.Viewport.add(bookmarkPanel); 
			
			bookmarkPanel.show();
		}
	}
});