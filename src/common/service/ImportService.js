var singleton, currentView;

// Service that defines what happens when dragging a file over the window.
var ImportService = Base.extend({

    processUrl: function (url) {
        console.info('Importing url: %s', url);
        this._process({url:url});
    },

    processFile: function (file) {
        console.info('Importing file: ', file);
        this._process({file:file});
    },

    _process: function (options) {
        if(currentView){
            currentView.hide().then(function () {
                currentView.remove();
                currentView = null;
                createViewFn(options);
            });
        }
        else{
            createViewFn(options);
        }
    }

},{
    instance: function () {
        if (!singleton) {
            singleton = new ImportService();
        }
        return singleton;
    }
});

function createViewFn(options) {
    currentView = new ImportView(options);
    $body.append(currentView.render().el);
    currentView.show().done(function () {
        currentView.import();
    });
}

module.exports = ImportService;