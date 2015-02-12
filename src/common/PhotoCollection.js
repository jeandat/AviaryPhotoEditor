var singleton;

var PhotoModel = get('common/PhotoModel');
var fileService = get('common/service/FileService').instance();
var Q = require('Q');

var PhotoCollection = Backbone.Collection.extend({

    model: PhotoModel,

    // This is the path to the json file that store the current list of photos.
    COLLECTION_PATH: fileService.HISTORIC + 'collection.json',


    // Sort the collection when a new PhotoModel is added by comparing the modification attribute.
    // According to natural order of date, meaning, most ancien first, most recent last.
    comparator: 'modification',

    initialize: function () {
        // Resort the collection when the modification attribute is updated.
        this.on('change:modification', this.sort);
    },

    // Load collection from disk (json file)
    init: function () {
        var def = Q.defer();
        fileService.readJSON(this.COLLECTION_PATH)
            .then(function () {
                // TODO
            })
            .fail(function () {
                // TODO
            });
        return def.promise;
    },

    // Override the push method by allowing 10 items only.
    // The eleventh will replace the oldest one.
    push: function () {
        if(this.size() >= 10) {
            this.remove(this.first());
        }
        Backbone.Collection.prototype.push.apply(this, arguments);

    },

    persist: function () {
        return fileService.writeJSON(this.COLLECTION_PATH);
    },

    // Remove one or several models from collection and also from disk.
    remove: function (model) {
        Backbone.Collection.prototype.remove.apply(this, arguments);
        _.isArray(model) ? _.forEach(model, removePhoto) : removePhoto(model);
    }

}, {
    instance: function () {
        if (!singleton) {
            singleton = new PhotoCollection();
        }
        return singleton;
    }
});

function removePhoto(model){
    return fileService.removeFile(model.get('uri'));
}

module.exports = PhotoCollection;