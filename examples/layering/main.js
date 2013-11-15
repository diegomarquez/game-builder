//This example demonstrates the use of layers. 
//In reality it is just a fancy name for the containers of the previous example.
//The difference being that these are dedicated to help in organizing what gets drawn and when.

gjs.setModulePath('layering_bundle');

define(function(require) {
	var main = function() {};

	main.prototype.start = function() {
		gjs.game.on("init", this, function() {
			//This pool setup bundle creates all the things this example will be using
			require('layering_bundle').create();

			//Here each game_object is added to a different layer
			//There are 6 layers by default.
			//Back, Middle, Front, Text, Hud, Popup.
			//For the kind of projects this framework is scoped for, that should be more than enough.
			gjs.layers.get('Front').add(gjs.assembler.get('Base_3')).start();
			gjs.layers.get('Middle').add(gjs.assembler.get('Base_2')).start();
			gjs.layers.get('Back').add(gjs.assembler.get('Base_1')).start();

			//What follows are some examples of what you can do with the gjs.layers object
			var keyboard = require('keyboard');

			//These are used to add back the stuff to the layers if you
			//remove them while trying out the example.
			//Check out the errors that are printed on console when there are no more game objects
			//available in the pools. These won't break the app by themselves, but if you see them
			//in your own work, there probably is something fishy going on.
			keyboard.onKeyDown(keyboard.NUM_1, this, function() {
				gjs.layers.get('Front').add(gjs.assembler.get('Base_3')).start();
			});

			keyboard.onKeyDown(keyboard.NUM_2, this, function() {
				gjs.layers.get('Middle').add(gjs.assembler.get('Base_2')).start();
			});

			keyboard.onKeyDown(keyboard.NUM_3, this, function() {
				gjs.layers.get('Back').add(gjs.assembler.get('Base_1')).start();
			});

			keyboard.onKeyDown(keyboard.A, this, function() {
				//Stop calling update method on game objects on the 'Front' layer
				//Effectively pausing that layer.
				gjs.layers.stop_update('Front');
			});

			keyboard.onKeyDown(keyboard.S, this, function() {
				//Stop calling draw method on game objects on the 'Front' layer
				//Effectively making the layer invisible.
				gjs.layers.stop_draw('Front');
			});

			keyboard.onKeyDown(keyboard.D, this, function() {
				//Resume all activity on the 'Front'  layer
				gjs.layers.resume('Front');
			});

			keyboard.onKeyDown(keyboard.Z, this, function() {
				//Clear all layers of game objects
				gjs.layers.all('clear');
			});

			//When a layer is removed it is gone for good, trying to add things
			//to it later will result in an error. You can try it out, by adding
			//things to any of the layers after calling this method.
			keyboard.onKeyDown(keyboard.X, this, function() {
				//Remove all layers entirely. You will need to add more layers after doing this.
				gjs.layers.all('remove');
			});

			//Since layers are containers which in turn are game_objects, 
			//theoretically you should be able to do fancy things with them to achieve
			//some cool effects.		

			//Maybe in another example.
		});
	}

	return new main()
});