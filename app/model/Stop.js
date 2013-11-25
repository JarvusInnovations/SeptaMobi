Ext.define('SeptaMobi.model.Stop', {
    extend: 'Ext.data.Model',

    config: {
        idProperty: 'id',

        fields: [{
            name: 'id',
            mapping: 'stop_id',
            type: 'int'
        }, {
            name: 'name',
            mapping: 'stop_name',
            type: 'string'
        }, {
            name: 'lat',
            mapping: 'stop_lat',
            type: 'float'
        }, {
            name: 'lon',
            mapping: 'stop_lon',
            type: 'float'
        }, {
            name: 'direction',
            mapping: 'direction_id',
            type: 'int'
        }]
    }
});