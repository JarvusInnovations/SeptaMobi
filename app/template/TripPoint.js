Ext.define('SeptaMobi.template.TripPoint', {
    extend: 'Ext.XTemplate'
    
    ,constructor: function() {
        this.callParent([
            '<div class="leg-description">',
                '<tpl if="type == \'startPoint\'">',
                    '<span class="leg-instruction">Start at</span> ',
                    '<span class="leg-point">{fromName}</span>',
                '</tpl>',
                '<tpl if="type == \'endPoint\'">',
                    '<span class="leg-instruction">Arrive at</span> ',
                    '<span class="leg-point">{toName}</span>',
                '</tpl>',
                '<tpl if="type == \'leg\'">',
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
                '</tpl>',
            '</div>',
            {
                capitalize: function(string) {
                    return string.charAt(0).toUpperCase() + string.slice(1);
                }
            }
        ]);
    }
});