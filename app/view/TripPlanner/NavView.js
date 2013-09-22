Ext.define('SeptaMobi.view.TripPlanner.NavView', {
    extend: 'Ext.navigation.View',
    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Jarvus.touch.ux.field.DateTimePicker'
    ],

    xtype: 'tripplanner',

    config: {
        items: [{
            xtype: 'formpanel',
            title: 'Trip Planner',
            cls: 'trip-planner',
            items: [{
                xtype: 'fieldset',
                items: [{
                    xtype: 'container',
                    cls: 'field-button-ct',
                    layout: 'hbox',
                    items: [{
                        xtype: 'textfield',
                        flex: 1,
                        label: 'From:',
                        labelWidth: 70,
                        itemId: 'fromField',
                        placeHolder: 'Origin',
                        clearIcon: false
                    },{
                        xtype: 'button',
                        cls: 'field-button',
                        itemId: 'fromUseCurrent',
                        iconCls: 'pinpoint'                        
                        
                    }]
                },{
                    xtype: 'container',
                    cls: 'field-button-ct',
                    layout: 'hbox',
                    items: [{
                        xtype: 'textfield',
                        flex: 1,
                        label: 'To:',
                        itemId: 'toField',
                        labelWidth: 70,
                        placeHolder: 'Destination',
                        clearIcon: false
                    },{
                        xtype: 'button',
                        cls: 'field-button',
                        itemId: 'toUseCurrent',
                        iconCls: 'pinpoint'                        
                    }]
                },{
                    xtype: 'datetimepickerfield',
                    label: 'Depart:',
                    labelWidth: 70,
                    value: (new Date()),
                    picker: {
                        yearFrom: (new Date()).getFullYear(),
                        yearTo: (new Date()).getFullYear() + 5,
                        minuteInterval: 1,
                        ampm: true,
                        slotOrder: ['month', 'day', 'year', 'hour', 'minute', 'ampm']
                    }
                },{
                    xtype: 'container',
                    cls: 'form-button-ct',
                    layout: 'hbox',
                    items: [{
                        xtype: 'button',
                        iconCls: 'reverse',
                        action: 'reverse'
                    },{
                        xtype: 'component',
                        flex: 1
                    },{
                        xtype: 'button',
                        text: 'Find a Route',
                        action: 'route'
                    }]
                }]
            }]
        }]
    }
});