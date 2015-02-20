var template = JST['editor/editor']();
var fileService = FileService.instance();
var singleton;

// This view is a singleton.
var EditorView = Backbone.View.extend({

    id:'editor',

    initialize: function () {
        _.bindAll(this, 'onLoad', 'onError', 'onSave', 'onClose', 'togglePanes', 'onSaveButtonClicked');
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
        if(!this.editor){
            this.editor = new Aviary.Feather({
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
        return this.closePanes().then(function () {
            self.shutdownEditor();
            self.$photo.attr('src', url);
            self.$photoLeft.attr('src', url);
            self.$photoRight.attr('src', url);
            // Returns a new promise
            return self.launchEditor();
        });
    },

    photoDidImported: function (view, model) {
        this.setImage(model.get('uri'));
    },

    // Make available the aviary editor (from loaded to ready state).
    launchEditor: function () {
        var img = this.$photo[0];
        var def = Q.defer();
        var self = this;

        if(!this.editorClosed){
            def.reject('Editor already launched');
        }
        else{
            this.editor.launch({
                image:img,
                url:img.src,
                onReady: function () {
                    self.editorClosed = false;
                    console.debug('Aviary editor ready');
                    def.resolve();
                    self.trigger('ready', this);
                    Backbone.trigger('editor:ready', this);
                },
                onError: function (err) {
                    self.onError(err);
                    def.reject(err);
                }
            });
        }

        return def.promise;
    },

    shutdownEditor: function () {
        if(!this.editorClosed){
            this.editor.close();
            this.editorClosed = true;
        }
    },

    // Show/Hide the Aviary editor.
    togglePanes: function () {
        return this.$el.hasClass('open') ? this.closePanes(false) : this.openPanes();
    },

    openPanes: function () {
        var def = Q.defer();
        var $el = this.$el;
        if($el.hasClass('open')){
            def.resolve();
        }
        else {
            $el.one('csstransitionend', def.resolve);
            $el.addClass('open');
        }
        return def.promise;
    },

    // Close and hide the Aviary editor.
    closePanes: function () {
        var def = Q.defer();
        var $el = this.$el;
        if(!$el.hasClass('open')){
            def.resolve();
        }
        else {
            $el.one('csstransitionend', def.resolve);
            $el.removeClass('open');
        }
        return def.promise;
    },

    // Callback when aviary editor is loaded.
    onLoad: function () {
        console.debug('Aviary editor loaded');
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