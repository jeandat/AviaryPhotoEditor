var template = JST['editor/editor']();
var fileService = FileService.instance();
var singleton;

// This view is a singleton.
var EditorView = Backbone.View.extend({

    id:'editor',
    attributes:{
        'data-transition':'luminance',
        'data-size':'cover'
    },

    initialize: function () {

        _.bindAll(this, 'onLoad', 'onError', 'onSave', 'onClose', 'togglePanes', 'onSaveButtonClicked');
        this.listenTo(Backbone, 'import', this.photoDidImported);
        this.editorClosed = true;

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
    },

    render: function () {

        // Render the template
        this.$el.html(template);

        // Keep a reference on the image DOM element
        this.$source = this.$('.source');
        this.$photos = this.$('.img');
        this.$wrap = this.$('.photo-wrap');
        this.$wrapsLeftRight = this.$('[class^=photo-wrap-]');

        return this;
    },

    photoDidImported: function (view, model) {
        return this.setImage(model.get('uri')).done();
    },

    // Change all img urls : the hidden photo used by the aviary editor but also each pane above.
    setImage: function (url) {
        var self = this;
        return this.closePanes().then(function () {
            self.shutdownEditor();
            var def = Q.defer();
            self.$el.one('csstransitionend', function () {
                self.$source.attr('src', url);
                self.$photos.css('backgroundImage', 'url(\'' + url + '\')');
                self.launchEditor().then(def.resolve).fail(def.reject).finally(function () {
                    self.$el.removeClass('change');
                });
            });
            self.$el.addClass('change');
            return def.promise;
        });
    },

    // Make available the aviary editor (from loaded to ready state).
    launchEditor: function () {
        var img = this.$source[0];
        var def = Q.defer();
        var self = this;

        if(this.editorClosed){
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
        else{
            def.resolve();
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
        return this.$wrap.hasClass('open') ? this.closePanes() : this.openPanes();
    },

    openPanes: function () {
        var def = Q.defer();
        if(this.$wrap.hasClass('open')){
            def.resolve();
        }
        else {
            this.$wrap.addClass('open');
            this.$el.one('csstransitionend', def.resolve);
            this.$wrapsLeftRight.addClass('open');
        }
        return def.promise;
    },

    // Close and hide the Aviary editor.
    closePanes: function () {
        var def = Q.defer();
        var self = this;
        if(!this.$wrap.hasClass('open')){
            def.resolve();
        }
        else {
            this.$el.one('csstransitionend', function () {
                self.$wrap.removeClass('open');
                def.resolve();
            });
            this.$wrapsLeftRight.removeClass('open');
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
            self.toggle();
        }).done();
    },

    // Maintain photo in window
    sizeBehavior: function (behavior) {
        this.$el.attr('data-size', behavior);
    },

    transitionBehavior: function (transition) {
        this.$el.attr('data-transition', transition);
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