module.exports = function(){

    console.info('Hello, I\'m a node-webkit and Aviary SDK demo app');


    // Dependencies
    var editorView = EditorView.instance();
    var menuView = MenuView.instance();
    var nativeMenu = NativeMenu.instance();
    var dragNDropService = DragNDropService.instance();
    var photoCollection = PhotoCollection.instance();
    var gui = require('nw.gui');


    // Load the Nunito font.
    // For simplicity sake and to test a new workaround that prevent the FOIT effect, I choosed to use a web technique
    // and not integrate the fonts directly in the app.
    new FontFaceObserver( 'Nunito', {}).check().then( function(){
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


    // Load the previous photo collection historic
    // Show the app after everything is ready
    // The last .done() instruction is a failsafe in case there was no fail block in the chain. If a rejected promise is not caught,
    // or a then block return an error, it will throw an error in the next event loop assuring at least there is an error in the console.
    photoCollection.fetch().then(function () {gui.Window.get().show();}).done();

};