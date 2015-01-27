var template = JST['editor/editor']();
var Aviary = win.Aviary;

// Holder on the photo
var $img, editor;

var EditorView = Backbone.View.extend({
    id:'editor',
    initialize: function () {

        // Prepare the Aviary Editor
        editor = new Aviary.Feather({
            apiKey:'3b1eb7150b164beebe6996cea9086c57',
            tools:'all',
            displayImageSize:true,
            enableCORS:true,
            onLoad:function(){
                console.debug('Aviary editor loaded');
            },
            onReady:function(){
                console.debug('Aviary editor ready');
            },
            onError:function(err){
                console.error('Failed to instantiate the Aviary editor: ', err);
            },
            onSave: function(imageID, newURL) {
                $img.attr('src',newURL);
            }
        });

        this.listenTo(Backbone, 'editor:open', this.open);
        this.listenTo(Backbone, 'editor:close', this.close);
    },
    render: function () {
        this.$el.html(template);
        $img = this.$('#photo');
        return this;
    },
    // Hide the photo and show the Aviary editor
    open: function () {
        var img = $img[0];
        editor.launch({
            image:img,
            url:img.src
        });
    },
    // Hide the Aviary editor and show the photo
    close: function () {
        editor.close();
    }
});

module.exports = EditorView;