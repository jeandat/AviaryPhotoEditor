var template = JST['common/view/popin/wave/wave-popin'];

// Class that define a popin component which appears from the bottom with a wave effect.
// THe popin content occupy a small portions of the screen. The rest is an overlay that block click outside.
// This is a modal component.
// WavePopin are inserted at the root of body.
// Constructor options :
// * `contentTemplate` `string` html template to insert as a content
// * `contentView` `Backbone.View` Backbone view to insert as a content. #render() should be called by the caller before.
// * `closable` `boolean` prevent the popin to be closed by clicking the wrapper or the cross (not shown).
var WavePopin = Backbone.View.extend({

    className: 'wave-popin',

    events: {
        'click .overlay': 'willClose',
        'click .icon-close': 'willClose'
    },

    defaults: {
        closable: false
    },

    initialize: function (options) {

        options = options || {};
        _.defaults(options, this.defaults);

        // Give a reference to this popin to the message view
        if (options.contentView) {
            options.contentView.popin = this;
        }
        this.options = options;

        _.bindAll(this, 'toggle', 'show', 'hide', 'remove');

        console.debug('WavePopin options: %o', options);
    },

    render: function () {
        // Generate and insert the popin in DOM
        this.$el.html(template(this.options));

        // Insert the content view provided inside the popin
        if (this.options.contentView) {
            // It is expected the contentView is already rendered by the caller
            this.$('.content').html(this.options.contentView.el);
        }

        $body.append(this.$el);

        // Force a redraw to prepare the animation.
        this.el.offsetHeight;

        return this;
    },

    // Close the popin if we clicked the wrapper or one of its children if closeOnClick option is enabled.
    // The wrapper is an ugly hack to make the popin work well when the page is shrinked after opening the native
    // keyboard.
    willClose: function (event) {
        var classList = event.target.classList;
        if (classList.contains('overlay') || classList.contains('icon-close')) {
            if (this.options.closable) {
                this.hide();
            }
        }
    },

    // open or hide the popin depending on its state
    toggle: function () {
        this.$el.hasClass('shown') ? this.hide() : this.show();
    },

    show: function () {
        var def = Q.defer();
        var $el = this.$el;

        if ($el.hasClass('shown')) {
            def.resolve();
            this.triggerEvent('show');
            return def.promise;
        }

        // This will show the view with a transition.
        $el.addClass('shown');

        // This will animate the form of the background with a wave effect.
        var self = this;
        this._animatePath(function () {
            // When the transition is done, we can resolve the deferred
            def.resolve();
            self.triggerEvent('show');
        });

        return def.promise;
    },

    // Will animate the path of the background (wave effect).
    _animatePath: function (callback) {
        var morphEl = this.$('.shape');
        var ssvg = new Snap(morphEl.find('svg')[0]);
        var path = ssvg.select( 'path' );
        this._initialPath = path.attr('d');
        var pathOpen = morphEl.attr( 'data-morph-open' );
        path.animate({'path': pathOpen}, 400, mina.easeinout, callback);
    },

    // Restore the default path to prepare the next transition.
    _restorePath: function () {
        this.$('path').attr('d', this._initialPath);
    },

    hide: function () {
        var def = Q.defer();
        var $el = this.$el;

        if (!$el.hasClass('shown')) {
            def.resolve();
            this.triggerEvent('hide');
            return def.promise;
        }

        // When the opacity transition is done, we can resolve the deferred
        var self = this;
        $el.one('csstransitionend', function () {
            self._restorePath();
            def.resolve();
            self.triggerEvent('hide');
        });

        $el.removeClass('shown');

        return def.promise;
    },

    triggerEvent: function (name) {
        this.trigger(name);
        this.$el.trigger(name);
    },

    // Don't forget to remove contentView when WavePopin is removed
    remove: function () {
        if (this.options.contentView) {
            this.options.contentView.remove();
        }
        Backbone.View.prototype.remove.apply(this, arguments);
    },

    // If true, show the close button.
    setClosable: function (value) {
        var closeIcon = this.$('.icon-close');
        this.options.closable = value;
        value ? closeIcon.removeClass('hidden') : closeIcon.addClass('hidden');
    }
});

module.exports = WavePopin;
