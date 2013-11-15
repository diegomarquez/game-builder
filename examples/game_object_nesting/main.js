//This example will be using a Container. You can add other game_objects
//as childs to these, and they will follow their parent everywhere using
//matrix transformations I do not understand. God bless them.

//The childs of a container are drawn on top of it.

//Childs will follow translation, rotation, scaling and opacity of the parent.

gjs.setModulePath('nesting_bundle');

define(function(require) {
		var main = function(){};

		main.prototype.start = function() {
			gjs.game.on("init", this, function() {
				 //This pool setup bundle creates all the things this example will be using
				 require('nesting_bundle').create()
				
				//This syntax is a little different to the one used in the first example.
				//But it does the same thing. Create a game_object, in this case "Container_1"
				//Add it to a display layer, and finally start it. 

				//The ID Continer_1 is defined in nesting_bundle.js
				gjs.layers.get('Middle').add(gjs.assembler.get('Container_1')).start();				
			});
		}

		return new main()
	}
);