Ext.define('SeptaMobi.store.Routes', {
	extend: 'Ext.data.Store',
	requires: ['SeptaMobi.proxy.APIProxy', 'SeptaMobi.model.Route'],

	config: {
		model: 'SeptaMobi.model.Route',
		proxy: {
			type: 'ajax',
			pageParam: false,
			limitParam: false,
			startParam: false,
			url: (window.SeptaMobi_API && SeptaMobi_API.routes) || (location.protocol == 'http:' ? './api/routes' : 'http://opentrips.codeforphilly.org/opentripplanner-api-webapp/ws/transit/routes'),
			reader: {
				type: 'json',
				rootProperty: 'routes'
			},
			extraParams: {
				'agency': 'SEPTA'
			}
		},

		sorters: [
			{
				sorterFn: function(record1, record2) {
					var shortName1 = record1.get('routeShortName'),
						shortName1Int = parseInt(shortName1),
						shortName1IsNumeric = !isNaN(shortName1Int),
						shortName2 = record2.get('routeShortName'),
						shortName2Int = parseInt(shortName2),
						shortName2IsNumeric = !isNaN(shortName2Int);
						
					if (shortName1IsNumeric && !shortName2IsNumeric) {
						return -1;
					} else if(!shortName1IsNumeric && shortName2IsNumeric) {
						return 1;
					}
					
					if(shortName1IsNumeric) {
						shortName1 = shortName1Int;
						shortName2 = shortName2Int;
					}

					return shortName1 > shortName2 ? 1 : (shortName1 == shortName2 ? 0 : -1);
				}
			}
		]
	}
});