Ext.define('SeptaMobi.model.Stop', {
    extend: 'Ext.data.Model',

    config: {
        idProperty: 'id',

        fields: [{
            name: 'id',
            mapping: 'id.id',
            type: 'int'
        }, {
            name: 'name',
            type: 'string'
        }, {
            name: 'lat',
            type: 'float'
        }, {
            name: 'lon',
            type: 'float'
        }]
    }
});