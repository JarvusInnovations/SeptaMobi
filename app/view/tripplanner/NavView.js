Ext.define('SeptaMobi.view.tripplanner.NavView', {
    extend: 'Ext.navigation.View',
    requires: [
        'Ext.form.Panel',
        'Ext.form.FieldSet',
        'Jarvus.touch.ux.field.DateTimePicker',
        'SeptaMobi.view.tripplanner.field.Component'
    ],

    xtype: 'tripplanner',

    config: {
        navigationBar: {
            docked: 'top',
            items: [
                {
                    xtype: 'button',
                    align: 'right',
                    text: 'Bookmark',
                    action: 'toggleBookmark',
                    hidden: true,
                    cls: 'bookmarks'
                }
            ]
        },        
        items: [{
            xtype: 'formpanel',
            title: 'Trip Planner',
            cls: 'trip-planner',
            scrollable: false,
            items: [{
                xtype: 'fieldset',
                items: [{
                    xtype: 'container',
                    cls: 'field-button-ct',
                    layout: 'hbox',
                    items: [{
                        xtype: 'componentfield',
                        flex: 1,
                        label: 'From:',
                        labelWidth: 70,
                        itemId: 'fromField',
                        placeHolder: 'Origin'
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
                        xtype: 'componentfield',
                        flex: 1,
                        label: 'To:',
                        itemId: 'toField',
                        labelWidth: 70,
                        placeHolder: 'Destination'
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