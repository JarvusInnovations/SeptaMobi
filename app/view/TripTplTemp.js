Ext.define('SeptaMobi.view.TripTplTemp', {
    extend: 'Ext.Component',
    xtype: 'triptpltemp',
    
    config: {
        startPointName: 'Origin',
        endPointName: 'Destination',

        tpl: [
            '<dl class="trip-details">',
                '<h1>Trip Details</h1>',
                '<div class="dli">',
                    '<dt>From</dt>',
                    '<dd>[Origin]</dd>',
                '</div>',
                '<div class="dli">',
                    '<dt>To</dt>',
                    '<dd>[Destination]</dd>',
                '</div>',
                '<div class="dli">',
                    '<dt>Travel</dt>',
                    '<dd>[Mode]</dd>',
                '</div>',
                '<div class="dli">',
                    '<dt>Time</dt>',
                    '<dd>{[values.duration/1000/60]}&nbsp;min</dd>',
                '</div>',
            '</dl>',

            '<ol class="trip-legs">',
                '<li class="trip-leg departure">',
                    '<div class="leg-description">',
                        '<span class="leg-instruction">Start at</span> ',
                        '<span class="leg-point">[Origin]</span>',
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
                                '<tpl if="to.name">{to.name}<tpl else>[Destination]</tpl>',
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
                        '<span class="leg-instruction">Arrive</span>',
                    '</div>',
                '</li>',
            '</ol>'
        ]
    },
    
    initComponent: function() {
        var me = this,
            url = 'TripTemp.json';
            
        Ext.Ajax.request({
            url: url,
            method: 'GET',
            
            success: function(response) {
                var rObj = Ext.decode(response.responseText, true);
                me.setData(rObj.plan.itineraries[0]);
            }
        });
    }
});