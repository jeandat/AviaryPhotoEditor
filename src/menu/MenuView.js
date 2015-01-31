var template = JST['menu/menu']();

var singleton;

var editorView = get('editor/EditorView').instance();

// This view is a singleton
var MenuView = Backbone.View.extend({
    id:'menu',
    tagName:'nav',
    events:{
        'click #edit-button': 'editPhoto',
        'click #tutorial-button': 'showTutorial',
        'click #launch-button': function () {
            editorView.setImage('img/paris.jpg');
            editorView.launch();
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
        editorView.toggle();
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