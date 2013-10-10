Ext.define('SeptaMobi.view.stops.NearbyList', {
	extend: 'Ext.dataview.List',
	xtype: 'stops-nearbylist',
	
	config: {
        store: 'NearByStops',

		itemTpl: [
            '<div>',
                '<span>{stopName}</span>',
                '<tpl for="routes">',
                    '<br/>',
                    '<tpl if="this.isBus(values)">',
                        '<span class="bus-number">{[values.get("routeShortName")]}</span>',
                    '</tpl>',
                    '<span>{[values.get("displayName")]}</span>',
                '</tpl>',
            '</div>',
            {
                isBus: function(record) {
                    return record.get('routeType') == 3;
                }
            }
        ]
	}
});