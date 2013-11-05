Ext.define('SeptaMobi.controller.Extras', {
	extend: 'Ext.app.Controller',
	requires: [
		'Ext.device.Geolocation'
	],

	config: {
		views: [
			'perks.Main',
			'extras.NavView',
			'extras.Tokens'
		],
		stores: [
			'Perks',
			'NearByPerks',
			'Tokens'
		],
		models: [
			'Perk'
		],
		refs: {
			mainTabView: 'main',
			extrasMainPanel: 'extrasview #mainPanel',
			perksView: {
				selector: 'perksview',
				xtype: 'perksview',
				autoCreate: true
			},

			tokensView: {
				selector: 'tokensview',
				xtype: 'tokensview',
				autoCreate: true
			},

			extrasNavView: 'extrasview',

			perksMap: 'perksview leafletmap',

			tokensMap: {
				selector: 'extrasmap',
				xtype: 'extrasmap',
				autoCreate: true
			}
		},
		control: {
			extrasNavView: {
				activate: 'onExtrasNavViewActivate'
			},
			perksView: {
				activate: 'onPerksViewActivate'
			},
			tokensView: {
				activate: 'onTokensViewActivate'
			},
			'tokensview #tokensList': {
				select: 'onTokenListSelect'
			},
			'selectfield#perkSorter': {
				change: 'sortPerks'
			},

			'button[action=showPerks]': {
				tap: 'showPerks'
			},

			'button[action=showTokenLocator]': {
				tap: 'showTokenLocator'
			},

			perksMap: {
				maprender: 'onPerksViewMapRender'
			},

			'tokensview leafletmap': {
				maprender: 'onTokensViewMapRender'
			},
			tokensMap: {
				maprender: 'onTokensMapRender',
				activate: 'onTokensMapActivate'
			}
		},
		routes: {
			'extras': 'showExtras',
			'extras/perks': 'showPerks',
			'extras/tokens': 'showTokens',
			'extras/tokens/:id': 'showTokenLocation'
		}
	},

	//controller methods

	showExtras: function(callback, scope) {
		var me = this,
			mainTabView = me.getMainTabView(),
			extrasNavView = me.getExtrasNavView(),
			extrasMainPanel = me.getExtrasMainPanel();

		mainTabView.setActiveItem(3);
		extrasNavView.pop(extrasMainPanel);

		if(callback) {
			Ext.callback(callback, scope);
		}
	},

	showPerks: function(btn) {
		var me = this,
			extrasView = me.getExtrasNavView(),
			perksView = me.getPerksView();

		me.showExtras(function() {
			if(!perksView.hasParent()) {
				extrasView.push(perksView);
			}
			if(extrasView.getActiveItem() !== perksView) {
				extrasView.pop(perksView);
			}
		});
	},

	showTokens: function() {
		var me = this;			

		me.showExtras(function() {
			me.loadTokens();
		});
	},
	showTokenLocation: function(id) {
		var me = this,
			extrasView = me.getExtrasNavView(),
			tokensView = me.getTokensView(),
			tokensMap = me.getTokensMap();

		var loadTokenMapView = function() {
			tokensMap.setSelectedId(id);
				
			if(extrasView.getActiveItem() !== tokensMap) {
				extrasView.push(tokensMap);
			}
		}
		if(extrasView.getActiveItem() != tokensView) {
			me.showExtras(function() {
				me.loadTokens(function() {
					loadTokenMapView();	
				});
			});
		}
		else {
			loadTokenMapView();
		}
	},

	onExtrasNavViewActivate: function() {
		this.pushPath('extras');
	},

	onPerksViewActivate: function() {
		this.pushPath('extras/perks');
	},

	onTokensViewActivate: function() {
		this.pushPath('extras/tokens');
	},

	onTokenListSelect: function(list, record) {
		var tokenLocationId = record.get('id');

		this.redirectTo('extras/tokens/' + tokenLocationId);
	},

	onPerksViewRender: function(navView) {
		console.warn('On Perks View render');
	},

	sortPerks: function(selectfield, value, oldValue) {
		console.warn('Sort Perks', value, oldValue, selectfield);
	},

	showTokenLocator: function(btn) {
		this.loadTokens();
	},

	loadTokens: function(callback, scope) {
		var me = this,
			tokensStore = Ext.getStore('Tokens'),
			navView = me.getExtrasNavView(),
			tokensView = me.getTokensView();

		if(tokensStore.isLoaded()) {
			Ext.callback(callback, scope);
		}
		else {
			tokensView.setMasked({
				xtype: 'loadmask',
				message: 'Loading Near By Token Stores&hellip;'
			});		

			Ext.device.Geolocation.getCurrentPosition({
				success: function(position) {
					tokensStore.load({
						params: {
							lat: position.coords.latitude,
							lon: position.coords.longitude
						},
						callback: function(perks) {
							tokensView.setMasked(false);
							if(callback) {
								Ext.callback(callback, scope);
							}
						},
						failure: function() {
							tokensView.setMasked(false);
							alert('Location error occurred.');
						}
					});
				},
				failure: function() {
					tokensView.setMasked(false);
					alert('Location error occurred.');
				}
			});
		}
		navView.push(tokensView);
	},

	onPerksViewMapRender: function(mapCmp) {
		var me = this,
			perksStore = Ext.getStore('Perks'),
			nearByPerksStore = Ext.getStore('NearByPerks');

		if(!nearByPerksStore.isLoaded()) {
			me.showPerksOnMap();
		}
	},

	onTokensViewMapRender: function(mapCmp) {
		var me = this,
			tokensStore = Ext.getStore('Tokens'),
			tokensView = me.getTokensView();

		me.applyTokensToMap(tokensStore.getRange(), mapCmp, tokensView);
	},

	onTokensMapRender: function(mapCmp) {
		var me = this,
			tokensStore = Ext.getStore('Tokens'),
			tokenLocation;

		tokenLocation = tokensStore.getById(mapCmp.getSelectedId());

		me.applyTokensToMap([tokenLocation], mapCmp, mapCmp);
	},

	onTokensMapActivate: function(mapCmp) {
		this.pushPath('extras/tokens/' + mapCmp.getSelectedId());
	},

	applyTokensToMap: function(tokenLocations, mapCmp, view) {
		var me = this,
			ll = window.L,
			map = mapCmp.getMap(),
			singleTokenLocation = tokenLocations.length == 1,
			tokenMarkers = [];

		tokenTemplate = Ext.create('Ext.XTemplate', [
			'{name}<br/>',
			'{address}'
		]);

		tokenLocations.forEach(function(token) {
			latLng = [token.get('lat'), token.get('lon')];

			var marker = ll.marker(latLng, {
				icon: ll.icon({
					iconUrl: 'resources/images/token.png',
					iconRetinaUrl: 'resources/images/token-2x.png'
					// iconSize: [28, 31],
					// iconAnchor: [14, 30]
				})
			}).addTo(map);

			setTimeout(function() {
				marker.bindPopup(tokenTemplate.apply(token.getData()));

				if(singleTokenLocation) {
					map.panTo(latLng);
				}
			}, 1000);

			tokenMarkers.push(marker);
		});

		view.setMarkers(tokenMarkers);
	},

	showPerksOnMap: function() {
		var me = this,
			ll = window.L,
			perksView = me.getPerksView(),
			mapCmp = me.getPerksMap(),
			map = mapCmp.getMap(),
			perksStore = Ext.getStore('Perks'),
			nearByPerksStore = Ext.getStore('NearByPerks'),
			perkMarkers = [];

		//TODO move template to view cfg?
		perkTemplate = Ext.create('Ext.XTemplate', [
			'{loc_name}<br/>',
			'{name}<br/>', 
			'{description}'
		]);

		Ext.device.Geolocation.getCurrentPosition({
			success: function(position) {				
				nearByPerksStore.load({					
					params: {
						lat: position.coords.latitude,
						lon: position.coords.longitude
					},
					callback: function(perks) {
						perks.forEach(function(perk) {
							latLng = [perk.get('lat'), perk.get('lon')];
							
							var marker = ll.marker(latLng, {
								icon: ll.icon({
									iconUrl: 'resources/images/perks.png',
									iconRetinaUrl: 'resources/images/perks-2x.png'
									// iconSize: [28, 31],
									// iconAnchor: [14, 30]
								})
							}).addTo(map);

							setTimeout(function() {
								var perkDetail = perksStore.getById(perk.get('id'));
								if(perkDetail) {
									marker.bindPopup(perkTemplate.apply(perkDetail.getData()));
								}
							}, 1000);

							perkMarkers.push(marker);
						});

						perksView.setPerkMarkers(perkMarkers);
					},
					failure: function() {
						alert('Location error occurred.');
					}
				});
			}
		});
	}

});