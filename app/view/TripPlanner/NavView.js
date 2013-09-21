Ext.define('SeptaMobi.view.TripPlanner.NavView', {
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
            cls: 'trip-planner',
            items: [{
                xtype: 'fieldset',
                defaults: {
					labelWidth: '100px'
				},
                items: [{
                    xtype: 'textfield',
                    label: 'Start:',
                    itemId: 'fromField',
                    clearIcon: false
                }, {
                    xtype: 'checkboxfield',
                 //   label: 'Current Location',
                    itemId: 'fromUseCurrent',
                    iconCls: 'pinpoint'
                }, {
                    xtype: 'textfield',
                    label: 'Destination:',
                    itemId: 'toField',
                    clearIcon: false
                }, {
                    xtype: 'checkboxfield',
               //     label: 'Current Location',
                    itemId: 'toUseCurrent'
                }, {
                    xtype: 'button',
                    text: 'Swap To/From',
                    action: 'reverse'
                }, {
                    xtype: 'datetimepickerfield',
                    label: 'Depart:',
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