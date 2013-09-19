Ext.define('SeptaMobi.view.TripPlanner.Form', {
    extend: 'Ext.navigation.View',
    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Jarvus.ux.field.DateTimePicker'
    ],

    xtype: 'tripplanner',

    config: {
        items: [{
            xtype: 'formpanel',
            title: 'Trip Planner',
            items: [{
                xtype: 'fieldset',
                items: [{
                    xtype: 'textfield',
                    label: 'From'
                }, {
                    xtype: 'button',
                    text: 'Use Current Location',
                    action: 'from-current-location'
                }, {
                    xtype: 'textfield',
                    label: 'To'
                }, {
                    xtype: 'button',
                    text: 'Use Current Location',
                    action: 'to-current-location'
                }, {
                    xtype: 'button',
                    text: 'Swap To/From',
                    action: 'reverse'
                }, {
                    xtype: 'datetimepickerfield',
                    label: 'Time',
                    value: (new Date()),
                    picker: {
                        yearFrom: (new Date()).getFullYear(),
                        yearTo: (new Date()).getFullYear() + 5,
                        minuteInterval: 1,
                        ampm: true,
                        slotOrder: ['month', 'day', 'year', 'hour', 'minute', 'ampm']
                    }
                }, {
                    xtype: 'button',
                    text: 'Route',
                    action: 'route'
                }]
            }]
        }]
    }
});