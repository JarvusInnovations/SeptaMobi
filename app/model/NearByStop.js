Ext.define('SeptaMobi.model.NearByStop', {
    extend: 'Ext.data.Model',

    config: {
        idProperty: 'id',

        fields: [{
            name: 'id',
            mapping: 'id.id',
            type: 'int'
        }, {
            name: 'stopName',
            type: 'string'
        }, {
            name: 'stopLat',
            type: 'float'
        }, {
            name: 'stopLon',
            type: 'float'
        }, {
            name: 'routes'
        }],

        belongsTo: 'Variant'
    }
});