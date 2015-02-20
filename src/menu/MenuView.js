var template = JST['menu/menu']();
var singleton;
var editorView = EditorView.instance();

// This view is a singleton
var MenuView = Backbone.View.extend({

    id:'menu',

    tagName:'nav',

    events:{
        'click #edit-button':'editPhoto',

        'click #tutorial-button':'showTutorial',

        // TODO Move in menudev
        'click #launch-button':function(){
            editorView.setImage('img/paris.jpg');
        },

        // TODO Move in menudev
        'click #import-button':function(){
            // http://kandkadventures.com/wp-content/uploads/2013/06/Eiffel-Tower-Paris-France.jpg
            var dragNDropService = DragNDropService.instance();
            dragNDropService.processFile('/Users/J2AN/Downloads/Aviary Photo Editor/Photo de test/Zion_Overlook_-_Flickr_-_Joe_Parks.jpg');
            //var view = new ImportView({file: '/Users/J2AN/Downloads/Aviary Photo Editor/Photo de test/Zion_Overlook_-_Flickr_-_Joe_Parks.jpg'});
            //$body.append(view.render().el);
            //view.show();
        }
    },

    initialize: function () {
        this.listenTo(Backbone, 'editor:ready', function () {
            this.$('#edit-button').attr('disabled', null);
        });
        this.listenTo(Backbone, 'editor:closed', function () {
            this.$('#edit-button').attr('disabled', 'disabled');
        });
    },

    render: function () {
        this.$el.html(template);
        return this;
    },

    editPhoto: function () {
        editorView.togglePanes();
    },

    showTutorial: function () {
        console.warn('Not implemented yet');
        // TODO
    }

}, {
    instance: function () {
        if (!singleton) {
            singleton = new MenuView();
        }
        return singleton;
    }
});

module.exports=MenuView;