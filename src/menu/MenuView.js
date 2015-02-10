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
        // TODO Move in menudev
        'click #launch-button': function () {
            editorView.setImage('img/paris.jpg');
            editorView.launch();
        },
        // TODO Move in menudev
        'click #import-button': function () {
            var ImportView = get('import/ImportView');
            var view;
            //view = new ImportView({url: 'http://img0.mxstatic.com/wallpapers/82ea7e91cbd54b3e2b3e921c4dc4bef9_large.jpeg'});
            var fn = function(){
                view = new ImportView({file: '/Users/J2AN/Downloads/Aviary Photo Editor/Photo de test/Zion_Overlook_-_Flickr_-_Joe_Parks.jpg'});
            };
            for(var i=1;i<=3;i=i+1)
                setTimeout(fn, i*1000);
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