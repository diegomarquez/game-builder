define(function(require) {
	var main = function() {};

	main.prototype.start = function() {
		gjs.game.on("init", this, function() {

			//This example will deal with the keyboard module. 
			//I believe that is pretty self explanatory. 
			var keyboard = require('keyboard');
			var util = require('util');

			//Some notes, the keyboard module will setup some listeners to override standard browser behaviour.
			//You probably do not want the window to scroll when you press the arrow keys.

			//There are a bunch of defined constants, you can find them in the framework's folder in keyboard.js 
			//It's not all of them, but if you need more than 20 keys for a game... I don't know... maybe you are doing it wrong.

			//For reasons (I don't want to do it), only the callback for the A key makes something appear on the canvas.
			//If you want to see the rest of the messages, you can do so on your browser's console. 
			//By 'your browser' I mean Chrome.

			//As usual this guys are here so we can see something
			var basic_game_object = require('../resources/basic_game_object');
			var box_renderer = require('../resources/box_renderer');

			gjs.go_pool.createPool("Base", basic_game_object, 20);
			gjs.co_pool.createPool("Box_Renderer", box_renderer, 20);

			gjs.co_pool.createConfiguration("Small_box", 'Box_Renderer').args({offsetX: -10, offsetY: -10, width: 20, height: 20});

			gjs.go_pool.createConfiguration("Base_2", "Base")
				.args({x: 200, y: 200, rotation_speed: 2})
				.setRenderer('Small_box');

			//If you try to create for game_objects than the amount specified when creating the pool,
			//an error will be thrown, but that escapes the scope of this example.

			//Key Down Events
			keyboard.onKeyDown(keyboard.A, this, function() { 
				var x = util.rand_f(20, gjs.canvas.width-20);
				var y = util.rand_f(20, gjs.canvas.height-20);

				var go = gjs.assembler.get('Base_2',{x:x, y:y});

				//In this case I know that the renderer I am using has a 'color' property.
				//If you write your own renderer this might not be available.
				go.renderer.color = util.rand_color(); 

				gjs.layers.get('Middle').add(go).start();
				console.log("A was pressed"); 
			});
			
			keyboard.onKeyDown(keyboard.S, this, function() { 
				console.log("S was pressed") 
			});
			
			keyboard.onKeyDown(keyboard.D, this, function() { console.log("D was pressed") });

			//Key Up Events
			keyboard.onKeyUp(keyboard.A, this, function() { console.log("A was released") });
			keyboard.onKeyUp(keyboard.S, this, function() { console.log("S was released") });
			keyboard.onKeyUp(keyboard.D, this, function() { console.log("D was released") });

			gjs.game.on("update", this, function() {
				//Wether a key is down or not
				if(keyboard.isKeyDown(keyboard.A)){ console.log('A is down') }
				if(keyboard.isKeyDown(keyboard.S)){ console.log('S is down') }
				if(keyboard.isKeyDown(keyboard.D)){ console.log('D is down') }
			})
		});
	}

	return new main()
});