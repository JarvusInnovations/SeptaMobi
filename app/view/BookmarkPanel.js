Ext.define('SeptaMobi.view.BookmarkPanel', {
	extend: 'Ext.Panel',
	xtype: 'bookmarkpanel',

	config: {
		bookmark: null,
		button: null,

		items: [{
			xtype: 'textfield',
			label: 'Bookmark Name',
			labelWidth: '50%'
		}, {
			xtype: 'button',
			action: 'ok',
			text: 'Ok'
		}, {
			xtype: 'button',
			action: 'cancel',
			text: 'Cancel'
		}]
	},

	updateBookmark: function(bookmark) {
		this.down('textfield').setValue(bookmark.get('fromName') + ' - ' + bookmark.get('toName'));
	}
});