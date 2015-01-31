var template = JST['editor/editor']();
var Aviary = win.Aviary;

var editor, singleton;

// This view is a singleton.
var EditorView = Backbone.View.extend({

    id:'editor',

    initialize: function () {
        _.bindAll(this, 'onLoad', 'onError', 'onReady', 'onSave', 'onClose');
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
                onSave:this.onSave,
                onClose:this.onClose
            });
        }

        return this;
    },

    // Change all img urls : the hidden photo used by the aviary editor but also each pane above.
    setImage: function (url) {
        this.$photo.attr('src', url);
        this.$photoLeft.attr('src', url);
        this.$photoRight.attr('src', url);
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
        this.$el.toggleClass('open');
    },

    // Close and hide the Aviary editor.
    close: function () {
        editor.close();
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

    // Callback when the save button of the aviary editor is clicked.
    onSave: function (imageId, newUrl) {
        this.setImage(newUrl);
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