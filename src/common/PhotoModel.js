var fileService = get('common/service/FileService').instance();

var PhotoModel = Backbone.Model.extend({

    initialize: function () {
        _.bindAll(this, 'destroy');
    },

    // Override the parent method to remove the photo on disk.
    destroy: function(){
        return fileService.removeFile(this.get('uri'));
    }

});

module.exports = PhotoModel;