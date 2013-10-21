Ext.define('SeptaMobi.model.NearByPerk', {
    extend: 'Ext.data.Model',

    config: {
        idProperty: 'id',

        fields: [{
            name: 'id',
            mapping: 'location_id',
            type: 'int'
        }, {
            name: 'lat',
            type: 'string',
            mapping: 'location_lat'
        }, {
            name: 'lon',
            type: 'string',
            mapping: 'location_lon'
        }]
    }
});