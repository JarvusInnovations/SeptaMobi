Ext.define('SeptaMobi.view.stops.NavView', {
	extend: 'Ext.navigation.View',
	xtype: 'stops-navview',

	requires: ['SeptaMobi.view.stops.NearbyList'],
	
	config: {
	// navigationBar: {
  //           docked: 'top',
  //           items: [
  //               {
  //                   xtype: 'button',
  //                   align: 'right',
  //                   text: 'Bookmark',
  //                   action: 'toggleBookmark',
  //                   cls: 'bookmarks'
  //                   action: 'toggleBookmark'
  //               }
  //           ]
  //       },
		items: [{
			xtype: 'stops-nearbylist',
	        title: 'Stops'
		}]
	}
});