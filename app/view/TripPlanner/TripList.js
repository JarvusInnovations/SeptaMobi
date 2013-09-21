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
            	'</dl>',
        	]
		}, {
			xtype: 'list',
			flex: 1,
			store: 'Itineraries',
			itemTpl: [
				'<div>',
					'<span class="departure-time">{startTime:date("g:i A")}</span>',
					'D <span class="duration">{duration}</span>',
					'WD <span class="walkDistance">{walkDistance}</span>',
					'T <span class="transfers">{transfers}</span>',
				'</div>'
			]
		}]
	},

	updateTripPlan: function(plan) {
		this.down('#tripDetails').setData(plan);
	}
});