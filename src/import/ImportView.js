
var template = JST['import/import']();

var photoCollection = get('common/PhotoCollection').instance();
var PhotoModel = get('common/PhotoModel');
var fileService = get('common/service/FileService').instance();
var Utils = get('common/utils/Utils');
var Q = require('Q');

var ImportView = Backbone.View.extend({

    id:'import-view',
    className:'import-view',

    initialize: function (options) {

        Backbone.View.prototype.initialize.apply(this, arguments);

        _.bindAll(this, 'registerPhoto', 'show', 'hide');

        this.options = options || {};

        var now = new Date();

        this.photoModel = new PhotoModel({
            id: Utils.guid(),
            importedUri: this.options.url || this.options.file,
            creation: now,
            modification: now
        });

        if(this.options.url){
            this.importUrl();
        }
        else if(this.options.file){
            this.importFile();
        }
        else {
            throw new Error(1, 'You can only import a url or a file');
        }
    },

    importUrl: function () {
        return fileService.importUrl(this.options.url, this.photoModel.id).then(this.registerPhoto);
    },

    importFile: function () {
        return fileService.importFile(this.options.file, this.photoModel.id).then(this.registerPhoto);
    },

    registerPhoto: function (pathOnDisk) {
        this.photoModel.set('uri', pathOnDisk);
        photoCollection.push(this.photoModel);
    },

    render: function () {
        this.$el.html(template);
        return this;
    },

    show: function () {
        var def = Q.defer();
        var $el = this.$el;

        if ($el.hasClass('shown')) {
            def.resolve();
            this.trigger('show');
            return def.promise;
        }

        // Force a redraw before animating.
        this.el.offsetHeight;

        // This will show the view with a transition.
        $el.addClass('shown');

        // This will animate the form of the background with a wave effect.
        var self = this;
        this._animatePath(function () {
            // When the transition is done, we can resolve the deferred
            def.resolve();
            self.trigger('show');
        });

        return def.promise;
    },

    // Will animate the path of the background (wave effect).
    _animatePath: function (callback) {
        var morphEl = this.$('.import-view-shape');
        var ssvg = new win.Snap(morphEl.find('svg')[0]);
        var path = ssvg.select( 'path' );
        this._initialPath = path.attr('d');
        var pathOpen = morphEl.attr( 'data-morph-open' );
        path.animate({'path': pathOpen}, 400, win.mina.easeinout, callback);
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
            this.trigger('hide');
            return def.promise;
        }

        // When the opacity transition is done, we can resolve the deferred
        var self = this;
        $el.one('csstransitionend', function () {
            this._restorePath();
            def.resolve();
            self.trigger('hide');
        });

        $el.removeClass('shown');

        return def.promise;
    }
});

module.exports = ImportView;