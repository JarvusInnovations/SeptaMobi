Ext.define('SeptaMobi.model.StopTime', {
    extend: 'Ext.data.Model',

    config: {
        idProperty: 'id',

        fields: [{
            name: 'time',
             dateFormat: 'timestamp',
            type: 'date'
        }, {
            name: 'phase',
            type: 'string'
        }, {
            name: 'id',
            mapping: 'id.id',
            type: 'int'
        }]
    }
});