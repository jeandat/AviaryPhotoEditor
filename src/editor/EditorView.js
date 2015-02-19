var template = JST['editor/editor']();
var fileService = FileService.instance();
var Q = require('Q');
var editor, singleton;

// This view is a singleton.
var EditorView = Backbone.View.extend({

    id:'editor',

    initialize: function () {
        _.bindAll(this, 'onLoad', 'onError', 'onReady', 'onSave', 'onClose', 'toggle', 'onSaveButtonClicked');
        this.listenTo(Backbone, 'import', this.photoDidImported);
    },

    render: function () {

        // Render the template
        this.$el.html(template);

        // Keep a reference on the image DOM element
        this.$photo = this.$('#photo');
        this.$photoLeft = this.$('#photo-left img');
        this.$photoRight = this.$('#photo-right img');

        // Create the Aviary Editor
        if(!editor){
            editor = new Aviary.Feather({
                apiKey:'3b1eb7150b164beebe6996cea9086c57',
                tools:'all',
                appendTo:this.id,
                noCloseButton:true,
                displayImageSize:true,
                enableCORS:true,
                onLoad:this.onLoad,
                onError:this.onError,
                onSaveButtonClicked:this.onSaveButtonClicked,
                onSave:this.onSave,
                onClose:this.onClose
            });
        }

        return this;
    },

    // Change all img urls : the hidden photo used by the aviary editor but also each pane above.
    setImage: function (url) {
        var self = this;
        this.close(true).then(function () {
            self.$photo.attr('src', url);
            self.$photoLeft.attr('src', url);
            self.$photoRight.attr('src', url);
            self.open();
        });
    },

    photoDidImported: function (view, model) {
        this.setImage(model.get('uri'));
    },

    // Make available the aviary editor (from loaded to ready state).
    launch: function () {
        var img = this.$photo[0];
        editor.launch({
            image:img,
            url:img.src,
            onReady:this.onReady
        });
    },

    // Show/Hide the Aviary editor.
    toggle: function () {
        return this.$el.hasClass('open') ? this.close(false) : this.open();
    },

    open: function () {
        var def = Q.defer();
        var self = this;
        var $el = this.$el;
        if($el.hasClass('open')){
            def.resolve();
            return def.promise;
        }
        if(self.aviaryEditorClosed){
            self.launch();
            self.aviaryEditorClosed = false;
        }
        $el.on('csstransitionend', function () {
            def.resolve();
        });
        // TODO we need two methods, one for the panes, one for the aviary editor.
        // TODO The aviary editor code should factorized in its own class to avoid confusion.
        $el.addClass('open');
        return def.promise;
    },

    // Close and hide the Aviary editor.
    // `closeAviaryEditor` if true, the aviary editor is also closed.
    close: function (closeAviaryEditor) {
        var def = Q.defer();
        var self = this;
        var $el = this.$el;
        if(!$el.hasClass('open')){
            def.resolve();
            return def.promise;
        }
        $el.on('csstransitionend', function () {
            if(closeAviaryEditor){
                editor.close();
                self.aviaryEditorClosed = true;
            }
            def.resolve();
        });
        $el.removeClass('open');
        return def.promise;
    },

    // Callback when aviary editor is loaded.
    onLoad: function () {
        console.debug('Aviary editor loaded');
    },

    // Callback when aviary editor is ready.
    onReady: function () {
        console.debug('Aviary editor ready');
        this.trigger('ready', this);
        Backbone.trigger('editor:ready', this);
    },

    // Callback on errors of the aviary editor.
    onError: function (err) {
        console.error('Failed to instantiate the Aviary editor: ', err);
    },

    // Callback when the aviary editor is closed.
    onClose: function () {
        this.trigger('closed', this);
        Backbone.trigger('editor:closed', this);
    },

    // Callback when the save button of the aviary editor is clicked but before the save happens.
    // It is possible to abort the save by returning false.
    onSaveButtonClicked: function () {
        // TODO show a custom wait indicator
        // Imply to add `showWaitIndicator:false` in editor options
    },

    // Post callback after save.
    // Update the image above the editor then hide it.
    onSave: function (imageId, newUrl) {
        var self = this;
        fileService.importUrl(newUrl).then(function (path) {
            self.setImage(encodeURI(path));
            // self.forceRedraw();
            self.toggle();
        }).done();
    },

    // Force a redraw of each image
    forceRedraw: function () {
        /* jshint expr: true */
        this.$photo[0].offsetHeight;
        this.$photoLeft[0].offsetHeight;
        this.$photoRight[0].offsetHeight;
    },

    // Maintain photo in window
    toggleContainPhoto: function () {
        this.$el.toggleClass('contain');
    }

}, {
    instance: function () {
        if (!singleton) {
            singleton = new EditorView();
        }
        return singleton;
    }
});

module.exports = EditorView;