//TODO Show selected options on trip detail
Ext.define('SeptaMobi.view.TripPlanner.TripList', {
    extend: 'Ext.Container',
    xtype: 'triplist',

    config: {
        tripPlan: null,
        itineraries: null,
        scrollable: true,

        items: [{
            xtype: 'container',
            itemId: 'tripDetails',
            tpl: [
                '<dl class="trip-details">',
                    '<div class="dli">',
                        '<dt>From</dt>',
                        '<dd>{fromName}</dd>',
                    '</div>',
                    '<div class="dli">',
                        '<dt>To</dt>',
                        '<dd>{toName}</dd>',
                    '</div>',
                    '<div class="dli">',
                        '<dt>Departure</dt>',                           
                        '<dd>{departTime:date("m/d/Y g:i A")}</dd>',
                    '</div>',
                '</dl>'
            ]
        }, {
            xtype: 'dataview',
            store: 'Itineraries',
            cls: 'itineraries-list list-style',
            itemCls: 'itinerary-list-item',
            scrollable: null,
            itemTpl: [
                '<div class="itinerary-times">',
                    '<span class="departure">Depart <time>{startTime:date("g:i a")}</time></span> ',
                    '<span class="arrival">Arrive <time>{endTime:date("g:i a")}</time></span>',
                '</div>',
                '<div class="itinerary-details">',
                    '<span class="itinerary-detail duration">{[ Math.round(values.duration/1000/60) ]}&nbsp;min</span>, ',
                    '<span class="itinerary-detail walk-distance">{[ (values.walkDistance*0.000621371).toFixed(1) ]}&nbsp;mi of walking</span>, ',
                    '<span class="itinerary-detail transfers">{transfers}&nbsp;transfer<tpl if="transfers!=1">s</tpl></span>',
                '</div>'
            ]
        }]
    },

    updateTripPlan: function(plan) {
        this.down('#tripDetails').setData(plan);
    }
});