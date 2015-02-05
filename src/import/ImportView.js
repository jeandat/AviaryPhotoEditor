
var template = JST['import/import']();

var PhotoModel = get('common/PhotoModel');
var fileService = get('common/service/FileService').instance();

var ImportView = Backbone.View.extend({

    id:'import',

    initialize: function (options) {
        Backbone.View.prototype.initialize.apply(this, arguments);
        this.options = options || {};
        var now = new Date();
        this.photoModel = new PhotoModel({
            importedUri: this.options.url || this.options.file,
            creation: now,
            modification: now
        });
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
        return fileService.importUrl(this.options.url, this.photoModel.cid);
    },

    importFile: function () {
        return fileService.importFile(this.options.file, this.photoModel.cid);
    },

    render: function () {
        this.$el.html(template);
        return this;
    }
});

module.exports = ImportView;