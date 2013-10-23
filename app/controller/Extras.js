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

			perksMap: 'perksview leafletmap'
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
			},

			perksMap: {
				maprender: 'onPerksViewMapRender'
			},

			'tokensview leafletmap': {
				maprender: 'onTokensViewMapRender'
			}
		}
	},

	showPerks: function(btn) {
		var me = this,
			extrasView = me.getExtrasNavView(),
			perksView = me.getPerksView();

		extrasView.push(perksView);
	},

	onPerksViewRender: function(navView) {
		console.warn('On Perks View render');
	},

	sortPerks: function(selectfield, value, oldValue) {
		console.warn('Sort Perks', value, oldValue, selectfield);
	},

	showTokenLocator: function(btn) {
		var me = this,
			tokensStore = Ext.getStore('Tokens'),
			navView = me.getExtrasNavView(),
			tokensView = me.getTokensView();

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
			ll = window.L,
			map = mapCmp.getMap(),
			tokensStore = Ext.getStore('Tokens'),
			tokensView = me.getTokensView(),
			tokenMarkers = [];

		tokenTemplate = Ext.create('Ext.XTemplate', [
			'{name}<br/>',
			'{address}'
		]);

		tokensStore.getRange().forEach(function(token) {
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
			}, 1000);

			tokenMarkers.push(marker);
		});

		tokensView.setMarkers(tokenMarkers);
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
									iconUrl: 'resources/images/perk.png',
									iconRetinaUrl: 'resources/images/perk-2x.png'
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