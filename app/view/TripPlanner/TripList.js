//TODO Show selected options on trip detail
Ext.define('SeptaMobi.view.TripPlanner.TripList', {
	extend: 'Ext.Container',
	xtype: 'triplist',

	config: {
		tripPlan: null,
		itineraries: null,

		layout: {
			type: 'vbox'
		},
		items: [{
			xtype: 'container',
			itemId: 'tripDetails',
			tpl: [
				'<dl class="trip-details">',
	                '<h1>Trip Details</h1>',
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
			flex: 1,
			store: 'Itineraries',
			cls: 'itineraries-list',
			itemCls: 'itinerary-list-item',
			itemTpl: [
			    '<div class="itinerary-detail departure">Depart {startTime:date("g:i A")}</div>',
			    '<div class="itinerary-detail duration">{[ (values.duration/1000/60).toFixed(1) ]}&nbsp;min</div>',
				'<div class="itinerary-detail walk-distance">Includes {[ (values.walkDistance/3.28084).toFixed(1) ]}&nbsp;ft of walking</div>',
				'<div class="itinerary-detail transfers">{transfers}&nbsp;transfer<tpl if="transfers!=1">s</tpl></div>',
			]
		}]
	},

	updateTripPlan: function(plan) {
		this.down('#tripDetails').setData(plan);
	}
});