/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [gb](@@gb@@),
 * [game](@@game@@),
 * [root](@@root@@),
 * [timer-factory](@@timer-factory@@),
 * [keyboard](@@keyboard@@)
 */

/**
 * --------------------------------
 */
define(function(require){
	var gb = require('gb');
	
	var game = gb.game;
	var root = gb.root;

	var timer_factory = require('timer-factory');
	var keyboard = require('keyboard');
	
	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");

		// Create and configure a fresh batch of timers
		keyboard.onKeyDown(keyboard.Z, this, function() { 
			console.log('Create timers');

			// Making sure we have a clean slate each time
			timer_factory.removeAll().now();

			// Creating the timers
			// This creates a timer object, it has 3 arguments
			// 1) It becomes part of the scope 'this' (or any other scope passed), 
			// 2) It belongs to the group 'timer_1'
			// 3) And can be accessed in the scope specified in 1) through the name 'my_timer' 
			timer_factory.get(this, 'timer_1', 'my_timer_1');
			timer_factory.get(this, 'timer_1', 'my_timer_2');

			// Configuring the timers
			this.my_timer_1.configure({ delay: 3000 });
			this.my_timer_2.configure({ delay: 2000, repeatCount:2, removeOnComplete:false});
		});

		// Bring up your javascript console to view when stuff gets printed.
		// It's pretty lame, but the example goes off scope otherwise.

		// The most basic timer, after running once, it is destroyed never to be seen again.
		// Being destroyed means it is removed from the factory cache, and removed from the owner.
		// Trying to access it again after it is complete would just break things.
		keyboard.onKeyDown(keyboard.A, this, function() { 
			if (!this.my_timer_1) return

			// Start the timer
			console.log('my_timer_1 started');
			console.log('Total timer amount in factory: ' + timer_factory.timeOuts.length);

			this.my_timer_1.start();
			// This callback will be called when the repeate count reaches 0
			// The scope of this callback is the one specified when creating the timer with timer_factory.get
			this.my_timer_1.on('remove', function() {
				console.log('my_timer_1 completed and destroyed');
				console.log('Total timer amount in factory: ' + timer_factory.timeOuts.length)
			});
		});

		// This timer will not be destroyed when it completes.
		// That means it can be restarted and it's properties changed.
		// In this case it is re-used as a one shot timer.			
		keyboard.onKeyDown(keyboard.S, this, function() { 
			if (!this.my_timer_2) return

			console.log('my_timer_2 started')
			console.log('Total timer amount in factory: ' + timer_factory.timeOuts.length);

			this.my_timer_2.start();

			this.my_timer_2.on('repeate', function(repeatCount){
				console.log('my_timer_2 repeat count: ' + repeatCount);
			});

			this.my_timer_2.on('complete', function() {
				console.log('my_timer_2 completed');
				console.log('Total timer amount in factory: ' + timer_factory.timeOuts.length);

				// Re configure
				this.my_timer_2.configure({ delay: 5000, repeatCount:1, removeOnComplete:true});
				this.my_timer_2.start();
			});

			this.my_timer_2.on('remove', function() {
				console.log('my_timer_2 completed and destroyed');
				console.log('Total timer amount in factory: ' + timer_factory.timeOuts.length)
			});
		});
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log("timers has lost focus");
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log("timers has regained focus");
	});

	// This is the main update loop
	game.on(game.UPDATE, this, function() {
		// Updates ALL the things.
		root.update(game.delta);
		// Draws ALL the things.
		root.transformAndDraw(game.context);
	});

	// This is the main setup that kicks off the whole thing
	// Notice how it needs to find a '#main' and '#game' in the document
	game.create(document.getElementById('main'), document.getElementById('game'));
});