'use strict';
/**
 * @name hui_button
 * @public
 * @author haiyang5210
 * @date 2014-11-14 10:27
 */
hui.define.autoload = true;
hui.define('hui_button', ['hui_control'], function () {

    hui.hui_button = function (options, pending) {
        hui.hui_button.superClass.call(this, options, 'pending');
        this.type = 'hui_button';
        // 进入控件处理主流程!
        if (pending != 'pending') {
            this.enterControl();
        }
    };
    hui.hui_button.prototype = {
        render: function (options) {
            hui.hui_button.superClass.prototype.render.call(this);
            var me = this;
            //hui.Control.init(me.getMain());
            me.getMain().innerHTML = 'hui_button ok.';
        }
    };

    // hui.hui_button 继承了 hui.Control 
    hui.inherits(hui.hui_button, hui.Control);
});