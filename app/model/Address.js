Ext.define('SeptaMobi.model.Address', {
	extend: 'Ext.data.Model',

	config: {
		fields:[{
			name: 'id',
			type: 'string'
		},{
			name: 'text',
			type: 'string',
			mapping: 'description'
		},{
			name: 'terms',
		},{
			name: 'reference',
			type: 'string'
		},{
			name: 'state',
			type: 'string',
			convert: function(v, r) {
				var terms = r.get('terms'),
					termsLength = terms ? terms.length : -1;

				if(terms && termsLength > 1) {
					return terms[terms.length - 2].value;
				}
				return null;
			}
		},{
			name: 'lat',
			type: 'double'
		},{
			name: 'lon',
			type: 'double'
		}]
	}
});