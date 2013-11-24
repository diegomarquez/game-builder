//This example deals with adding extensions to the behaviour
//of the main object that wraps the canvas and sets up the update loop.
//Instead of monkey patching the code that is related to the root states of the game
//you can decouple that nicely using this sort of extensions.

//This example will concentrate on a single extension which resizes the canvas
//if the container changes size. 
//It takes care of keeping original aspect ratio and keeping the canvas in the center of the 
//container.

//Other extensions will be used in a similar fashion to this one.

define(function(require) {
	var main = function() {
		//I recommend going to the the file with the code for this extension if you wish to make your own
		extension = require('scale_aspect_ratio_extension');

		//Extensions can be added and will be executed in the place the name suggests.
		//All extensions will be executed in the order they were added.

		//'create' extensions will be executed once, as soon as the game starts.
		//'update' extensions are executed before the main game update.
		//'pause' extensions are executed each time the game is paused.
		//'resume' extensions are executed each time the game is resumed from a pause.
		gjs.game.add_extension('create', new extension());

		//This empty init callback is just here to illustrate 
		//that extensions are set before initialization
		gjs.game.on("init", this, function() {
			console.log('Hi!');
		});
	};
	return new main()
});