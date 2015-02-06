
var template = JST['import/import']();

var photoCollection = get('common/PhotoCollection').instance();
var PhotoModel = get('common/PhotoModel');
var fileService = get('common/service/FileService').instance();
var Utils = get('common/utils/Utils');

var ImportView = Backbone.View.extend({

    id:'import',

    initialize: function (options) {

        Backbone.View.prototype.initialize.apply(this, arguments);

        _.bindAll(this, 'registerPhoto');

        this.options = options || {};

        var now = new Date();

        this.photoModel = new PhotoModel({
            id: Utils.guid(),
            importedUri: this.options.url || this.options.file,
            creation: now,
            modification: now
        });

        if(this.options.url){
            this.importUrl();
        }
        else if(this.options.file){
            this.importFile();
        }
        else {
            throw new Error(1, 'You can only import a url or a file');
        }
    },

    importUrl: function () {
        return fileService.importUrl(this.options.url, this.photoModel.id).then(this.registerPhoto);
    },

    importFile: function () {
        return fileService.importFile(this.options.file, this.photoModel.id).then(this.registerPhoto);
    },

    registerPhoto: function (pathOnDisk) {
        this.photoModel.set('uri', pathOnDisk);
        photoCollection.push(this.photoModel);
    },

    render: function () {
        this.$el.html(template);
        return this;
    }
});

module.exports = ImportView;