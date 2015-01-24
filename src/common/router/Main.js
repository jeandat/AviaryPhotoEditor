var singleton;

var MainRouter = Backbone.Router.extend({

    // All routes
    routes: {
        '': 'home'
    },

    // initialize our main router
    initialize: function () {

        // Debugging sugar
        this.on('route', function (route) {
            console.info('Current route ' + route);
        });

        console.info('Router initialized');
    },

    // Default route (root)
    home: function () {

    },

    // Start backbone history monitoring in mode pushState
    start: function () {
        // pushState can't be used with file:// urls so we are staying with the default : hash based urls.
        Backbone.history.start();
        console.info('Router started');
    }
}, {
    // Singleton pattern
    instance: function () {
        if (!singleton) {
            singleton = new MainRouter();
        }
        return singleton;
    }
});

module.exports = MainRouter;
