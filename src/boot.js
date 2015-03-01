module.exports = function(){

    console.info('Hello, I\'m a node-webkit and Aviary SDK demo app');


    // Define some globals used everywhere
    window.Q = require('Q');



    // Load the Nunito font.
    // For simplicity sake and to test a new workaround that prevent the FOIT effect, I choosed to use a web technique
    // and not integrate the fonts directly in the app.
    new FontFaceObserver( 'Nunito, Poiret One', {}).check().then( function(){
        document.documentElement.className += ' fonts-loaded';
    });


    // Create a native Mac OS X menu
    nativeMenu.create();


    // Render the main menu
    $body.append(menuView.render().el);


    // Render the editor
    $body.append(editorView.render().el);


    // Start the drang and drop service
    dragNDropService.listen();


    // Install mocks for some Aviary sdk dependencies.
    // All dependencies should be in the app and not downloaded like in classical web.
    // TODO intercept xhr


    // Load the previous photo collection historic
    // Show the app after everything is ready
    // The last .done() instruction is a failsafe in case there was no fail block in the chain. If a rejected promise is not caught,
    // or a then block return an error, it will throw an error in the next event loop assuring at least there is an error in the console.
    photoCollection.fetch().then(function () {
        var gui = require('nw.gui');
        gui.Window.get().show();
    }).done();

};