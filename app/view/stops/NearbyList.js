//TODO good candidate for reusable template with route list
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
                    '<div class="routes">',
                        '<span class="bus-number"><span class="number">{[values.get("routeShortName")]}</span></span>',
                        '<p>{[values.get("displayName")]}</p>',
                    '</div>',
                '</tpl>',
            '</div>'
        ],
        emptyText: 'There are no stops near by your current location.'
	}
});