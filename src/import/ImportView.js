
var template = JST['import/import']();

var ImportView = Backbone.View.extend({
    id:'import',
    render: function () {
        this.$el.html(template);
        return this;
    }
});

module.exports = ImportView;