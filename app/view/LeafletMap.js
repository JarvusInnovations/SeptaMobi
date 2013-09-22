Ext.define('SeptaMobi.view.LeafletMap', {
	extend: 'SeptaMobi.ux.LeafletMap',
	xtype: 'leaflet-demo',

	config: {		
		currentMarkers: [],
		currentRoutes: [],
		defaultRouteOptions: {
			color: 'red'
		}
	},

    drawPolyline: function(coords, options) {
        var me = this
            ,map = me.getMap()
            ,ll = window.L
            ,polyline;

            polyline = ll.polyline(coords, options).addTo(map);

            Ext.defer(function() {
            	map.panTo(coords[0]);
            }, 500, this);

            return polyline;
    },

    drawTrip: function(itenerary, options) {
    	var me = this
	    	,options = me.getDefaultRouteOptions()
	        ,currentRoutes = me.getCurrentRoutes()
	        ,trips = itenerary.legs
	        ,routeLine = []
	        ,routeOptions = []
	        ,coords = []
	        ,i = 0, len;

	    Ext.each(trips, function(trip) {
	    	coords.push(me.decode(trip.legGeometry.points));
	    }, this);

	    len = trips.length;
	    for(; i < len; i++) {
	    	routeOptions[i] = Ext.apply( options, me.getOptionsByRouteMode(trips[i]));
		    routeLine[i] = me.drawPolyline(coords[i], routeOptions[i]);

		    //if there are routes currently in map, add to stack.
		    if(currentRoutes.length <= 0) {
		    	me.setCurrentRoutes([{route: routeLine[i], coords: coords[i] , trip: trips[i]}]);
		    }
		    else {
		    	currentRoutes.push({route: routeLine[i], coords: coords[i] , trip: trips[i]});
		    	me.setCurrentRoutes(currentRoutes);
		    }
		}

        console.log('Drawing trip', coords, itenerary, me.getCurrentRoutes());

    },

    getOptionsByRouteMode: function(trip) {
    	var options = {};

    	switch (trip.mode) {
    		case 'WALK':
    			options.color = 'black';
    		break;

    		case 'BUS': 
    			options.color = 'purple';
    		break;
    	} 

    	return options;
    } 

});