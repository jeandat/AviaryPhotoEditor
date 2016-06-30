var template = JST['menu/menu']();

// This view is a singleton
var MenuView = Backbone.View.extend({

    id:'menu',

    tagName:'nav',

    events:{
        'click #edit-button':'editPhoto',
        'click #tutorial-button':'showTutorial'
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

});

module.exports= new MenuView();