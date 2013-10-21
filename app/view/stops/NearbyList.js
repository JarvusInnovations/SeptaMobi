Ext.define('SeptaMobi.view.stops.NearbyList', {
	extend: 'Ext.dataview.List',
	xtype: 'stops-nearbylist',
	
	config: {
        store: 'NearByStops',
        cls: 'nearbylist',
		itemTpl: [
            '<div>',
                '<h3>{stopName}</h3>',
                '<tpl for="routes">',
                    '<div class="routes"><tpl if="this.isBus(values)">',
                        '<span class="bus-number"><span class="number">{[values.get("routeShortName")]}</span></span>',
                    '</tpl>',
                    '<p>{[values.get("displayName")]}</p></div>',
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