var template = JST['editor/editor']();

// This view is a singleton.
var EditorView = Backbone.View.extend({

    id:'editor',
    className:'hide-editor',
    attributes:{
        'data-transition':'fade',
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
        return this;
    },

    photoDidImported: function (view, model) {
        var self = this;
        return this.closePanes().then(function () {
            return self.setImage(model.get('uri'));
        }).done();
    },

    // Change all img urls : the hidden photo used by the aviary editor but also each pane above.
    setImage: function (url) {
        this.shutdownEditor();
        var def = Q.defer();

        this.$el.addClass('hide-editor').removeClass('hide-photo');

        var self = this;
        this.$el.one('csstransitionend', function () {
            self.$source.attr('src', url);
            self.$photos.css('backgroundImage', 'url(\'' + url + '\')');

            var launchPromise = self.launchEditor().finally(function () {

                self.$el.one('csstransitionend', function () {
                    launchPromise.isFulfilled() ? def.resolve() : def.reject(new Error(3, 'Editor failed ' +
                    'to launch.'));
                    // TODO show an import error message if the promise is not resolved
                });

                self.$el.removeClass('show-photo');
            });
        });

        this.$el.addClass('show-photo');

        return def.promise;
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
        return this.$el.hasClass('show-editor') ? this.closePanes() : this.openPanes();
    },

    openPanes: function () {
        var def = Q.defer();
        var $el = this.$el;
        if($el.hasClass('show-editor')){
            def.resolve();
        }
        else {
            $el.removeClass('hide-editor').addClass('hide-photo');
            // The animation is done when the two panes are opened.
            $el.one('csstransitionend:transform', def.resolve);
            $el.addClass('show-editor');
        }
        return def.promise;
    },

    // Close and hide the Aviary editor.
    closePanes: function () {
        var def = Q.defer();
        var $el = this.$el;
        if(!$el.hasClass('show-editor')){
            def.resolve();
        }
        else {
            // The animation is done when the two panes are closed.
            $el.one('csstransitionend:transform', function () {
                def.resolve();
            });
            $el.removeClass('show-editor');
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

});

module.exports = new EditorView();