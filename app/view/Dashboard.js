Ext.define('SeptaMobi.view.Dashboard', {
	extend: 'Ext.Container',
	requires: ['SeptaMobi.store.Alerts'],
	xtype: 'dashboard',
	
	config: {
		tweets: null,
		styleHtmlContent: true,
		layout: 'vbox',

		items: [{
			xtype: 'component',
			cls: 'septamobi-logo',
			html: '<img src="resources/images/septamobi-logo-big.png" alt="septa mobi logo" height="auto" width="100%" />'
		}, {
			xtype: 'button',
			text: 'New Route',
			cls: 'newroute-btn',
			action: 'newRoute'
		}, {
			xtype: 'tabpanel',
			flex: 1,
			cls: 'dashboard',
			items: [{
				xtype: 'container',
				html: 'Loading...',
				itemId: 'tweetsCmp',
				cls: 'tweets',
				flex: 1,
				title: 'Tweets',
				scrollable: {
				    direction: 'vertical',
				    directionLock: true
				}
			}, {
				xtype: 'list',
				itemId: 'bookmarkslist',
				title: 'Bookmarks',
				cls: 'bookmarks',
				itemTpl: [
					'<div class="bookmark">',
						'<div class="line {lineName}"></div>',
						'<div class="text"><h4>{name}</h4>',
						'<p>{fromName} <span class="arrow"></span> {toName}</p>',
						'<span class="disclosure"/></div>',
					'</div>'
				],
				store: 'Bookmarks',
				emptyText: 'No bookmarks yet!'
			}]
		}]
	},

	updateTweets: function(tweets) {
		this.down('#tweetsCmp').setHtml(tweets)
	}
});