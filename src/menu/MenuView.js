var template = JST['menu/menu']();

var MenuView = Backbone.View.extend({
    id:'menu',
    tagName:'nav',
    events:{
        'click #edit': 'editPhoto',
        'click #tutorial': 'showTutorial'
    },
    render: function () {
        this.$el.html(template);
        return this;
    },
    editPhoto: function () {
        Backbone.trigger('editor:open');
    },
    showTutorial: function () {
        console.warn('Not implemented yet');
        // TODO
    }
});

module.exports=MenuView;