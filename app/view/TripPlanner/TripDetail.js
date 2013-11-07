//TODO Show selected options on trip detail
Ext.define('SeptaMobi.view.tripplanner.TripDetail', {
    extend: 'Ext.Container',
    xtype: 'tripdetail',
	requires: [
       'Ext.carousel.Carousel',
	   'SeptaMobi.strings.TripPlanner',
       'SeptaMobi.template.TripPoint',
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
                xtype: 'container',
                layout: 'fit',
                title: 'Map',
                items: [{
                    xtype: 'leafletmap',
    
                    title: 'Map',
                    tileLayerOptions: { detectRetina: true},
                    useCurrentLocation: true,
                    autoMapCenter: false,
                    enableOwnPositionMarker: true,
                    mapOptions: {
                        zoom: 15
                    }                    
                },{
                    xtype: 'container',
                    cls: 'directions-carousel-ct',
                    bottom: 16,
                    width: '100%',
                    height: '100%',
                    maxHeight: 150,
                    layout: { type: 'hbox', align: 'middle' },
                    items: [{
                        xtype: 'carousel',
                        height: '100%',
                        flex: 1
                    }]
                }]
            }]
        }]
    },

    setTripData: function(tripDetail, itenerary) {
        var me = this,
            carousel = me.down('carousel'),
            iteneraryData = itenerary.getData(),
            tripElementLength = iteneraryData.legs.length,
            tpl = Ext.create('SeptaMobi.template.TripPoint'), 
            i = 0, tplHtml, carouselItems = [];

        iteneraryData.legs[iteneraryData.legs.length - 1].destination = itenerary.get('toName');

        me.setTripDetail(tripDetail);
        me.setItenerary(iteneraryData);

        for(; i < tripElementLength + 2; i++) {
            if( i == 0) {
                iteneraryData.type = 'startPoint';
                tplHtml = tpl.apply(iteneraryData);
            }
            else if(i == tripElementLength + 1) {
                iteneraryData.type = 'endPoint';
                tplHtml = tpl.apply(iteneraryData);
            }
            else {
                iteneraryData.legs[i - 1].type = 'leg';
                tplHtml = tpl.apply(iteneraryData.legs[i - 1]);
            }
            carouselItems.push({html: tplHtml});
        }
        carousel.setItems(carouselItems);
    },

    updateTripDetail: function(tripDetail) {
        this.down('#tripDetail').setData(tripDetail);
    },

    updateItenerary: function(itenerary) {
        this.down('#itenerary').setData(itenerary);
    }
});