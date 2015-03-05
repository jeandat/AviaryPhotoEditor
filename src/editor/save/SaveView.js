var template = JST['editor/save/save'];
var errPrefix = 'Houston, we\'ve had a problem here. ';

var SaveView = WavePopin.extend({

    id: 'save-view',

    className: function () {
        return _.result(WavePopin.prototype, 'className') + ' save-view';
    },

    initialize: function (options) {

        options = options || {};
        // This view will be used as content: it contains a list of funds
        options.contentTemplate = template(options);

        WavePopin.prototype.initialize.call(this, options);

        _.bindAll(this, 'abort');

        // This popin removes itself from the DOM when hidden
        this.once('hide', this.remove);
    },

    render: function () {
        WavePopin.prototype.render.apply(this, arguments);
        this.$progress = this.$('progress');
    },

    abort: function (err) {
        console.error('Save failed: %o', err);
        this.$('.progress').addClass('failed');
        var $message = this.$('.message');
        $message.text(errPrefix + 'Save aborted.');
        $message.removeClass('hidden');
        this.setClosable(true);
    },

    progress: function (percentage) {
        this.$progress.attr('value', percentage);
    },

    updateMessage: function (message) {
        this.$('.label').text(message);
    }

});

module.exports = SaveView;