Ext.define('SeptaMobi.controller.Bookmark', {
	extend: 'Ext.app.Controller',

	config: {
		stores: [
			'Bookmarks'
		],
		refs: {
			bookmarkPanel: 'bookmarkpanel',
			bookmarkNameTextField: 'bookmarkpanel textfield'
		},

		control: {
			'bookmarkpanel button[action=ok]': {
				tap: 'bookmarkOkTapped'
			},
			'bookmarkpanel button[action=cancel]': {
				tap: 'bookmarkCancelTapped'
			}
		}
	},

	bookmarkOkTapped: function() {
		var me = this,
			bookmarkPanel = me.getBookmarkPanel(),
			bookmark = bookmarkPanel.getBookmark(),
			bookmarkNameTextField = me.getBookmarkNameTextField(),
			bookmarkStore = Ext.getStore('Bookmarks'),
			bookmarkButton = bookmarkPanel.getButton();

		bookmark.set('name', bookmarkNameTextField.getValue());
		bookmarkStore.add(bookmark);
		bookmarkStore.sync();

		if(bookmarkButton) {
			bookmarkButton.addCls('bookmarked');
		}

		Ext.Msg.alert('Info', 'Bookmark has been added.', Ext.emptyFn);

		me.getBookmarkPanel().hide();
	},

	bookmarkCancelTapped: function() {
		this.getBookmarkPanel().hide();
	}
});