var singleton;

var PhotoModel = get('common/PhotoModel');
var fs = require('fs');

var PhotoCollection = Backbone.Collection.extend({

    model: PhotoModel,

    // Sort the collection when a new PhotoModel is added by comparing the modification attribute.
    // According to natural order of date, meaning, most ancien first, most recent last.
    comparator: 'modification',

    initialize: function () {
        // Resort the collection when the modification attribute is updated.
        this.on('change:modification', this.sort);
    },

    // Override the push method by allowing 10 items only.
    // The eleventh will replace the oldest one.
    push: function () {
        if(this.size() >= 10) {
            this.remove(this.first());
        }
        Backbone.Collection.prototype.push.apply(this, arguments);
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
    fs.unlink(model.get('uri'), function (err) {
        err && console.error('Can\'t remove photo at %s: ', model.get('uri'), err);
    });
}

module.exports = PhotoCollection;