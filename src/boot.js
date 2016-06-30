module.exports = function(){

    console.info('Hello, I\'m a node-webkit and Aviary SDK demo app');


    // Create a native Mac OS X menu
    nativeMenu.create();


    // Render the main menu
    $body.append(menuView.render().el);


    // Render the editor
    $body.append(editorView.render().el);


    // Start the drag and drop service
    dragNDropService.listen();


    // Install mocks for some Aviary sdk dependencies.
    // All dependencies should be in the app and not downloaded like in classical web.
    // TODO intercept xhr


    // Load the previous photo collection historic.
    // Show the app after everything is ready.
    photoCollection.fetch().then(function () {

        // Load fonts.
        // Not really needed here but I wanted to test this new workaround that prevent the FOIT effect.
        return new FontFaceObserver( 'Nunito, Poiret One, icomoon', {}).check().then( function(){
            document.documentElement.className += ' fonts-loaded';
            gui.Window.get().show();
        });

    }).done();

};