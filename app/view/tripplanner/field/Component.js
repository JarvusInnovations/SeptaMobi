Ext.define('SeptaMobi.view.tripplanner.field.Component', {
    extend: 'Ext.Decorator',

    xtype: 'componentfield',

    config: {
        /**
         * @cfg
         * @inheritdoc
         */
        baseCls: Ext.baseCSSPrefix + 'field',

        /**
         * The label of this field
         * @cfg {String} label
         * @accessor
         */
        label: null,

        /**
         * @cfg {String} labelAlign The position to render the label relative to the field input.
         * Available options are: 'top', 'left', 'bottom' and 'right'
         * @accessor
         */
        labelAlign: 'left',

        /**
         * @cfg {Number/String} labelWidth The width to make this field's label.
         * @accessor
         */
        labelWidth: '30%',

        /**
         * @cfg {Boolean} labelWrap `true` to allow the label to wrap. If set to `false`, the label will be truncated with
         * an ellipsis.
         * @accessor
         */
        labelWrap: false,

        /**
         * @cfg {Boolean} clearIcon `true` to use a clear icon in this field.
         * @accessor
         */
        clearIcon: null,

        /**
         * @cfg {Boolean} required `true` to make this field required.
         *
         * __Note:__ this only causes a visual indication.
         *
         * Doesn't prevent user from submitting the form.
         * @accessor
         */
        required: false,

        /**
         * @cfg {String} placeHolder A string value displayed in the input (if supported) when the control is empty.
         * @accessor
         */
        placeHolder: null,

        /**
         * @cfg {String} name The field's HTML name attribute.
         *
         * __Note:__ this property must be set if this field is to be automatically included with.
         * {@link Ext.form.Panel#method-submit form submit()}.
         * @accessor
         */
        name: null,

        /**
         * @cfg {Mixed} value A value to initialize this field with.
         * @accessor
         */
        value: null,

        component: {
            xtype: 'container',
            layout: 'hbox',
            cls: 'x-field-input',
            items: [{
                xtype: 'component',
                itemId: 'valueCmp',
                tpl: '{value}',
                flex: 1
            }, {
                xtype: 'component',
                itemId: 'clearIcon',
                cls: 'x-clear-icon',
                html: 'x'
            }]
        },
    },

    initialize: function() {
        var me = this,
            component;

        me.callParent();

        component = me.getComponent();

        me.getValueCmp().element.on('tap', me.onValueElementTap, me);
        me.getClearIcon().element.on('tap', me.onClearIconTap, me);
    },

    getClearIcon: function() {
        return this.getComponent().down('#clearIcon');
    },

    getValueCmp: function() {
        return this.getComponent().down('#valueCmp');
    },

    onValueElementTap: function() {
        this.fireEvent('tap', this);
    },

    onClearIconTap: function(e) {
        var me = this;

        me.setValue(null);
        me.showPlaceHolder();

        me.getClearIcon().hide();

        me.fireEvent('clearicontap', me, e);
    },

    getElementConfig: function() {
        var prefix = Ext.baseCSSPrefix;

        return {
            reference: 'element',
            className: 'x-container',
            children: [{
                reference: 'label',
                cls: prefix + 'form-label',
                children: [{
                    reference: 'labelspan',
                    tag: 'span'
                }]
            }, {
                reference: 'innerElement',
                cls: prefix + 'component-outer'
            }]
        };
    },

    // @private
    updateLabel: function(newLabel, oldLabel) {
        var renderElement = this.renderElement,
            prefix = Ext.baseCSSPrefix;

        if (newLabel) {
            this.labelspan.setHtml(newLabel);
            renderElement.addCls(prefix + 'field-labeled');
        } else {
            renderElement.removeCls(prefix + 'field-labeled');
        }
    },

    // @private
    updateLabelAlign: function(newLabelAlign, oldLabelAlign) {
        var renderElement = this.renderElement,
            prefix = Ext.baseCSSPrefix;

        if (newLabelAlign) {
            renderElement.addCls(prefix + 'label-align-' + newLabelAlign);

            if (newLabelAlign == "top" || newLabelAlign == "bottom") {
                this.label.setWidth('100%');
            } else {
                this.updateLabelWidth(this.getLabelWidth());
            }
        }

        if (oldLabelAlign) {
            renderElement.removeCls(prefix + 'label-align-' + oldLabelAlign);
        }
    },

    // @private
    updateLabelCls: function(newLabelCls, oldLabelCls) {
        if (newLabelCls) {
            this.label.addCls(newLabelCls);
        }

        if (oldLabelCls) {
            this.label.removeCls(oldLabelCls);
        }
    },

    // @private
    updateLabelWidth: function(newLabelWidth) {
        var labelAlign = this.getLabelAlign();

        if (newLabelWidth) {
            if (labelAlign == "top" || labelAlign == "bottom") {
                this.label.setWidth('100%');
            } else {
                this.label.setWidth(newLabelWidth);
            }
        }
    },

    // @private
    updateLabelWrap: function(newLabelWrap, oldLabelWrap) {
        var cls = Ext.baseCSSPrefix + 'form-label-nowrap';

        if (!newLabelWrap) {
            this.addCls(cls);
        } else {
            this.removeCls(cls);
        }
    },

    /**
     * Updates the `placeholder` attribute with the {@link #placeHolder} configuration.
     * @private
     */
    updatePlaceHolder: function(newPlaceHolder) {
        console.log('updatePlaceHolder', newPlaceHolder);
        var me = this,
            valueCmp = me.getValueCmp();

        if(!me.getValue()) {
            me.showPlaceHolder();
        }
    },

    showPlaceHolder: function() {
        var me = this,
            valueCmp = me.getValueCmp(),
            placeHolder = me.getPlaceHolder(),
            clearIcon = me.getClearIcon();

        valueCmp.addCls('placeholder');
        valueCmp.setData({
            value: placeHolder
        });
        clearIcon.hide();
    },

    hidePlaceHolder: function() {
        this.getValueCmp().removeCls('placeholder');
    },

    updateValue: function(value) {
        var me = this,
            clearIcon = me.getClearIcon();

        if (value) {
            me.hidePlaceHolder();
            me.getValueCmp().setData({
                value: value
            });
            clearIcon.show();

        } else {
            me.showPlaceHolder();
            clearIcon.hide();
        }
    }
});