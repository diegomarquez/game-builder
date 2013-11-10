define(function(require) {
	var main = function() {};

	main.prototype.start = function() {
		gjs.game.on("init", this, function() {

			//This example uses the reclaimer objects to reclaim all game_objects of a certain type.
			//Usefull for clearing the scene of all objects or just a set of them. 
			var reclaimer = require('reclaimer');
			var keyboard = require('keyboard');

			basic_game_object = require('../resources/basic_game_object');
			box_renderer = require('../resources/box_renderer');

			gjs.co_pool.createPool("Box_Renderer", box_renderer, 3);

			gjs.co_pool.createConfiguration("Red_Renderer", 'Box_Renderer').args({
				color: '#FF0000',
				offsetX: -50,
				offsetY: -50,
				width: 100,
				height: 100
			});

			gjs.co_pool.createConfiguration("Green_Renderer", 'Box_Renderer').args({
				color: '#00FF00',
				offsetX: -50,
				offsetY: -50,
				width: 100,
				height: 100
			});

			gjs.co_pool.createConfiguration("Blue_Renderer", 'Box_Renderer').args({
				color: '#0000FF',
				offsetX: -50,
				offsetY: -50,
				width: 100,
				height: 100
			});

			gjs.go_pool.createPool("Base", basic_game_object, 3);

			gjs.go_pool.createConfiguration("Base_1", "Base")
				.args({
					x: gjs.game.canvas.width / 2,
					y: gjs.game.canvas.height / 2,
					rotation_speed: 2
				})
				.setRenderer('Red_Renderer');

			gjs.go_pool.createConfiguration("Base_2", "Base")
				.args({
					x: gjs.game.canvas.width / 2,
					y: gjs.game.canvas.height / 2,
					rotation_speed: 1
				})
				.setRenderer('Green_Renderer');

			gjs.go_pool.createConfiguration("Base_3", "Base")
				.args({
					x: gjs.game.canvas.width / 2,
					y: gjs.game.canvas.height / 2,
					rotation_speed: -0.5
				})
				.setRenderer('Blue_Renderer');

			gjs.layers.get('Front').add(gjs.assembler.get('Base_3')).start();
			gjs.layers.get('Middle').add(gjs.assembler.get('Base_2')).start();
			gjs.layers.get('Back').add(gjs.assembler.get('Base_1')).start();

			//These are used to add back the stuff to the layers if you
			//remove them while trying out the example.
			keyboard.onKeyDown(keyboard.A, this, function() {
				gjs.layers.get('Front').add(gjs.assembler.get('Base_3')).start();
				gjs.layers.get('Middle').add(gjs.assembler.get('Base_2')).start();
				gjs.layers.get('Back').add(gjs.assembler.get('Base_1')).start();
			});

			keyboard.onKeyDown(keyboard.S, this, function() {
				reclaimer.claimAll();
			});

			keyboard.onKeyDown(keyboard.Z, this, function() {
				reclaimer.claimOnly('configuration', ['Base_2']);
			});

			keyboard.onKeyDown(keyboard.X, this, function() {
				reclaimer.claimOnly('type', ['Base']);
			});

			keyboard.onKeyDown(keyboard.C, this, function() {
				reclaimer.claimAllBut('configuration', ['Base_2']);
			});
		});
	}

	return new main()
});