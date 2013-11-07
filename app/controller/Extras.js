Ext.define('SeptaMobi.controller.Extras', {
	extend: 'Ext.app.Controller',
	requires: [
		'Ext.device.Geolocation',
		'SeptaMobi.view.perks.Map',
		'SeptaMobi.view.extras.Map'
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

			perksMap: {
				selector: 'perksmap',
				xtype: 'perksmap',
				autoCreate: true
			},

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
			'perksview #perksList': {
				select: 'onPerksListSelect'
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

			'perksview map': {
				maprender: 'onPerksViewMapRender'
			},
			perksMap: {
				maprender: 'onPerksMapRender',
				activate: 'onPerksMapActivate'
			},
			'tokensview map': {
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
			'extras/perks/:id': 'showPerkLocation',
			'extras/tokens/:id': 'showTokenLocation',
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
	showPerkLocation: function(id) {
		var me = this,
			extrasView = me.getExtrasNavView(),
			perksView = me.getPerksView(),
			perksMap = me.getPerksMap();

		var loadPerkMapView = function() {
			perksMap.setSelectedId(id);

			if(extrasView.getActiveItem() !== perksMap) {
				extrasView.push(perksMap);
			}
		}
		if(extrasView.getActiveItem() != perksView) {
			me.showExtras(function() {
				me.loadPerks(function() {
					loadPerkMapView();
				});
			});
		}
		else {
			loadPerkMapView();
		}
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

	onPerksListSelect: function(list, record) {
		var perkId = record.get('id');

		this.redirectTo('extras/perks/' + perkId);
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
			me.loadPerks(function() { 
				me.showPerksOnMap();	
			});
		}
		else {
			me.showPerksOnMap();
		}
	},

	onTokensViewMapRender: function(mapCmp) {
		var me = this,
			tokensStore = Ext.getStore('Tokens'),
			tokensView = me.getTokensView();

		me.applyTokensToMap(tokensStore.getRange(), mapCmp, tokensView);
	},

	onPerksMapRender: function(mapCmp) {
		var me = this,
			nearByPerksStore = Ext.getStore('NearByPerks'),
			selectedPerkId = mapCmp.getSelectedId(),
			showPerk = function() {
				nearByPerk = nearByPerksStore.getById(selectedPerkId);
				if(!nearByPerk) {
					//TODO Fix once we implement google geocoder
					alert('Perk not found');
					return;
				}
				me.applyPerksToMap([nearByPerk], mapCmp, mapCmp);
			},
			perk, nearByPerk;

		if(!nearByPerksStore.isLoaded()) {
			me.loadPerks(function() {
				showPerk();
			});
		}
		else {
			showPerk();
		}
	},

	onPerksMapActivate: function(mapCmp) {
		this.pushPath('extras/perks/' + mapCmp.getSelectedId());
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

	loadPerks: function(callback, scope) {
		var me = this,
			nearByPerksStore = Ext.getStore('NearByPerks');

		Ext.device.Geolocation.getCurrentPosition({
			success: function(position) {				
				nearByPerksStore.load({					
					params: {
						lat: position.coords.latitude,
						lon: position.coords.longitude
					},
					callback: function(perks) {
						if(callback) {
							Ext.callback(callback, scope);
						}
					},
					failure: function() {
						alert('Location error occurred.');
					}
				});
			}
		});
	},

	showPerksOnMap: function() {
		var me = this,
			mapCmp = me.getPerksMap(),
			nearByPerksStore = Ext.getStore('NearByPerks'),
			perks = nearByPerksStore.getRange(),
			perksView = me.getPerksView();

		me.applyPerksToMap(perks, mapCmp, perksView);
	},

	applyPerksToMap: function(perks, mapCmp, view) {
		var me = this,
			ll = window.L,
			map = mapCmp.getMap(),
			perksStore = Ext.getStore('Perks'),
			singlePerkLocation = perks.length == 1,
			perkMarkers = [];

		//TODO move template to view cfg?
		perkTemplate = Ext.create('Ext.XTemplate', [
			'{loc_name}<br/>',
			'{name}<br/>', 
			'{description}'
		]);
		
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

			if(singlePerkLocation) {
				map.panTo(latLng);
			}
		});

		view.setPerkMarkers(perkMarkers);
	}

});