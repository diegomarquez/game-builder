//This example uses the reclaimer objects to reclaim all game_objects of a certain type.
//Usefull for clearing the scene of all objects or just a set of them.

gjs.setModulePath('layering_bundle');

define(function(require) {
	var main = function() {
		gjs.game.on("init", this, function() {
			 
			var reclaimer = require('reclaimer');
			var keyboard = require('keyboard');

			require('layering_bundle').create();

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

			keyboard.onKeyDown(keyboard.P, this, function() {
				reclaimer.clearAllPools();
			});

			keyboard.onKeyDown(keyboard.O, this, function() {
				console.log('Game Object Pool');
				console.log( gjs.go_pool.toString() );
			});

			keyboard.onKeyDown(keyboard.I, this, function() {
				console.log('Component Pool');
				console.log( gjs.co_pool.toString() );
			});
		});
	};

	return new main()
});