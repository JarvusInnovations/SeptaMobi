Ext.define('SeptaMobi.view.stops.NavView', {
	extend: 'Ext.navigation.View',
	xtype: 'stops-navview',

	requires: ['SeptaMobi.view.stops.Main'],
	
	config: {
		// navigationBar: {
  //           docked: 'top',
  //           items: [
  //               {
  //                   xtype: 'button',
  //                   align: 'right',
  //                   text: 'Bookmark',
<<<<<<< HEAD
  //                   action: 'toggleBookmark',
  //				 cls: 'bookmarks'
=======
  //                   action: 'toggleBookmark'
>>>>>>> 6e277804d9644d64b47788c64f51375717f485fa
  //               }
  //           ]
  //       },
		items: [{
			xtype: 'stops-main',
	        title: 'Stops'
		}]
	}
});