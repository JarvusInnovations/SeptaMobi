Ext.define('SeptaMobi.model.StopTime', {
    extend: 'Ext.data.Model',

    config: {
        idProperty: 'id',

        fields: [{
            name: 'time',
            type: 'string',
            mapping: 'departure_time_formatted'
        }, {
            name: 'fromNow',
            type: 'string',
            mapping: 'from_now'
        }, {
            name: 'gone',
            type: 'boolean'
        }, {
            name: 'id',
            mapping: 'trip_id',
            type: 'int'
        }]
    }
});