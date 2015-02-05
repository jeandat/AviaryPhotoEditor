
var template = JST['import/import']();

var fileService = get('common/service/FileService').instance();

var ImportView = Backbone.View.extend({
    id:'import',

    initialize: function (options) {
        Backbone.View.prototype.initialize.apply(this, arguments);
        this.options = options || {};
        if(this.options.url){
            this.importUrl();
            return;
        }
        if(this.options.file){
            this.importFile();
            return;
        }
    },

    importUrl: function () {
        return fileService.importUrl(this.options.url);
    },

    importFile: function () {
        return fileService.importFile(this.options.file);
    },

    render: function () {
        this.$el.html(template);
        return this;
    }
});

module.exports = ImportView;