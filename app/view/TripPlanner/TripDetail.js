//TODO Show selected options on trip detail
Ext.define('SeptaMobi.view.TripPlanner.TripDetail', {
	extend: 'Ext.Container',
	xtype: 'tripdetail',

	config: {
		items: [{
			xtype: 'container',
			itemId: 'tripDetail',
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
	                    '<dt>Travel</dt>',
	                    '<dd>{modes}</dd>',
	                '</div>',
	                '<div class="dli">',
	                    '<dt>Time</dt>',
	                    '<dd>{[values.duration/1000/60]}&nbsp;min</dd>',
	                '</div>',,
            	'</dl>'
        	]
    	}, {
    		xtype: 'container',
    		itemId: 'itenerary',
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
	                                '<span class="mode">{mode}</span> ',
	                                '<tpl if="route"><span class="route">{route}</span> </tpl>',
	                            '</span> to ',
	                            '<span class="trip-point">',
	                                '<tpl if="to.name">{to.name}<tpl else>{destination}</tpl>',
	                            '</span>',
	                        '</div>',
	                        '<div class="leg-length">',
	                            '<span class="time">About {[values.duration/1000/60]}&nbsp;min</span>, ',
	                            '<span class="distance">{[(values.distance*.000621371).toFixed(1)]}&nbsp;mi</span>',
	                        '</div>',
	                        '<tpl if="steps">',
	                            '<div class="leg-details">',
	                                '<ol class="leg-steps">',
	                                    '<tpl for="steps">',
	                                        '<li class="leg-step">',
	                                            '<span class="step-rel-direction"><tpl if="relativeDirection">{relativeDirection}<tpl else>Walk</tpl></span> ',
	                                            '<span class="step-abs-direction">{absoluteDirection}</span> ',
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
	                        '<span class="leg-instruction">Arrive {toName}</span>',
	                    '</div>',
	                '</li>',
            	'</ol>'
			]
		}]
	},

	setTripData: function(tripDetail, itenerary) {
		var iteneraryData = itenerary.getData();

		iteneraryData.legs[iteneraryData.legs.length - 1].destination = itenerary.get('toName');

		this.down('#tripDetail').setData(tripDetail);
		this.down('#itenerary').setData(iteneraryData);
	}
});