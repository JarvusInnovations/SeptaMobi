//TODO Show selected options on trip detail
Ext.define('SeptaMobi.view.TripPlanner.TripDetail', {
    extend: 'Ext.Container',
    xtype: 'tripdetail',
	requires: [
	   'SeptaMobi.strings.TripPlanner',
	   'Jarvus.touch.ux.LeafletMap'
	],

	config: {
		title: 'Route Details',
		tripDetail: null,
		itenerary: null,
		tripLine: null,

        layout: {
            type: 'vbox'
        },
        items: [{
            xtype: 'container',
            itemId: 'tripDetail',
            tpl: ''
//          tpl: [
//              '<dl class="trip-details">',
//                  '<div class="dli">',
//                      '<dt>From</dt>',
//                      '<dd>{fromName}</dd>',
//                  '</div>',
//                  '<div class="dli">',
//                      '<dt>To</dt>',
//                      '<dd>{toName}</dd>',
//                  '</div>',
//                  '<div class="dli">',
//                      '<dt>Travel</dt>',
//                      '<dd>{modes}</dd>',
//                  '</div>',
//                  '<div class="dli">',
//                      '<dt>Time</dt>',
//                      '<dd>{[values.duration/1000/60]}&nbsp;min</dd>',
//                  '</div>',,
//              '</dl>'
//          ]
        }, {
            xtype: 'tabpanel',
            flex: 1,
            cls: 'route-map-tabs',
            items: [{
                xtype: 'container',
                title: 'Route',
                itemId: 'itenerary',
                scrollable: true,
                tpl: [
                    '<ol class="trip-legs">',
                        '<li class="trip-leg departure">',
                            '<div class="leg-description">',
                                '<span class="leg-instruction">Start at</span> ',
                                '<span class="leg-point">{fromName}</span>',
                            '</div>',
                        '</li>',
                        '<tpl for="legs">',
                            '<li class="trip-leg {[values.mode.toLowerCase()]}">',
                                '<div class="leg-description">',
                                    '<span class="leg-instruction">',
                                        '<span class="mode">{[SeptaMobi.strings.TripPlanner.modes[values.mode]]}</span> ',
                                        '<tpl if="route"><span class="route">{route}</span> </tpl>',
                                    '</span> to ',
                                    '<span class="trip-point">',
                                        '<tpl if="to.name">{to.name}<tpl else>{destination}</tpl>',
                                    '</span>',
                                '</div>',
                                '<div class="leg-length">',
                                    '<span class="time">About {[(values.duration/1000/60).toFixed()]}&nbsp;min</span>, ',
                                    '<span class="distance">{[(values.distance*.000621371).toFixed(1)]}&nbsp;mi</span>',
                                '</div>',
                                '<tpl if="steps">',
                                    '<div class="leg-details">',
                                        '<ol class="leg-steps">',
                                            '<tpl for="steps">',
                                                '<li class="leg-step">',
                                                    '<span class="step-direction">',
                                                        '<tpl if="relativeDirection">{[this.capitalize(SeptaMobi.strings.TripPlanner.directions[values.relativeDirection.toLowerCase()])]}',
                                                        '<tpl else>Walk {[SeptaMobi.strings.TripPlanner.directions[values.absoluteDirection.toLowerCase()]]}',
                                                        '</tpl>',
                                                    '</span> ',
                                                    '<tpl if="streetName">on <span class="step-street-name">{streetName}</span> </tpl>',
                                                    '<span class="step-distance">{[(values.distance*3.28084).toFixed(0)]}&nbsp;ft</span>',
                                                '</li>',
                                            '</tpl>',
                                        '</ol>',
                                    '</div>',
                                '</tpl>',
                            '</li>',
                        '</tpl>',
                        '<li class="trip-leg arrival">',
                            '<div class="leg-description">',
                                '<span class="leg-instruction">Arrive at</span> ',
                                '<span class="leg-point">{toName}</span>',
                            '</div>',
                        '</li>',
                    '</ol>',
                    {
                        capitalize: function(string) {
                            return string.charAt(0).toUpperCase() + string.slice(1);
                        }
                    }
                ]
            }, {
                xtype: 'leafletmap',

                title: 'Map',
                tileLayerOptions: { detectRetina: true},
                useCurrentLocation: true,
                autoMapCenter: false,
                enableOwnPositionMarker: true,
                mapOptions: {
                    zoom: 15
                }
            }]
        }]
    },

    setTripData: function(tripDetail, itenerary) {
        var iteneraryData = itenerary.getData();

        iteneraryData.legs[iteneraryData.legs.length - 1].destination = itenerary.get('toName');

        this.setTripDetail(tripDetail);
        this.setItenerary(iteneraryData);
    },

    updateTripDetail: function(tripDetail) {
        this.down('#tripDetail').setData(tripDetail);
    },

    updateItenerary: function(itenerary) {
        this.down('#itenerary').setData(itenerary);
    }
});