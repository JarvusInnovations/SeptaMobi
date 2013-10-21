Ext.define('SeptaMobi.controller.Extras', {
	extend: 'Ext.app.Controller',
	requires: [
		'Ext.device.Geolocation'
	],

	config: {
		views: [
			'perks.Main',
			'extras.NavView'
		],
		stores: [
			'Perks',
			'NearByPerks'
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
			}
		}
	},

	showPerks: function(btn) {
		var me = this,
			extrasView = me.getExtrasNavView(),
			perksView = me.getPerksView();

		extrasView.push(perksView);
		console.log('Showing perks', perksView, extrasView);
	},

	onPerksViewRender: function(navView) {
		console.warn('On Perks View render');
	},

	sortPerks: function(selectfield, value, oldValue) {
		console.warn('Sort Perks', value, oldValue, selectfield);
	},

	showTokenLocator: function(btn) {
		var me = this;

		console.log('Show Token Locator');
	},

	onPerksViewMapRender: function(mapCmp) {
		var me = this,
			perksStore = Ext.getStore('Perks'),
			nearByPerksStore = Ext.getStore('NearByPerks');

		if(!nearByPerksStore.isLoaded()) {
			me.showPerksOnMap();
		}
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
								marker.bindPopup(perkTemplate.apply(perkDetail.getData()));
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