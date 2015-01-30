var template = JST['editor/editor']();
var Aviary = win.Aviary;

var $img, editor, singleton;

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
        $img = this.$('#photo');

        // Create the Aviary Editor
        if(!editor){
            editor = new Aviary.Feather({
                apiKey:'3b1eb7150b164beebe6996cea9086c57',
                tools:'all',
                appendTo:this.id,
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
    launch: function () {
        var img = $img[0];
        editor.launch({
            image:img,
            url:img.src,
            onReady:this.onReady
        });
    },
    // Hide the photo and show the Aviary editor
    open: function () {
        this.$el.toggleClass('open');
        console.debug('Editor opened');
    },
    // Hide the Aviary editor and show the photo
    close: function () {
        editor.close();
    },
    onLoad: function () {
        console.debug('Aviary editor loaded');
    },
    onReady: function () {
        console.debug('Aviary editor ready');
        this.trigger('ready', this);
        Backbone.trigger('editor:ready', this);
    },
    onError: function (err) {
        console.error('Failed to instantiate the Aviary editor: ', err);
    },
    onClose: function () {
        this.trigger('closed', this);
        Backbone.trigger('editor:closed', this);
    },
    onSave: function (imageId, newUrl) {
        $img.attr('src', newUrl);
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