Ext.define('SeptaMobi.store.Bookmarks', {
	extend: 'Ext.data.Store'
	,requires: [
		'Ext.data.proxy.LocalStorage'
		,'SeptaMobi.model.Bookmark'
	]
	
	,config: {
		model: 'SeptaMobi.model.Bookmark'
		,autoLoad: true
		,autoSync: true
	    ,proxy: {
			type: 'localstorage'
			,id: 'myBookmarks'
		}
	},

	hasBookmark: function(bookmark) {		
		return this.findExact('uid', bookmark.get('uid')) != -1;
	}
});