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
	
	game.add_extension(require("timers-control"));
	game.add_extension(require("activity-display"));

	var domTimer1 = document.getElementById('timer_1');
	var domTimer2 = document.getElementById('timer_2');
	var domEvent1 = document.getElementById('event_1');
	var domEvent2 = document.getElementById('event_2');

	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");
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

		var configureTimers = function() {
			// Configuring the timers
			this.my_timer_1.configure({ delay: 3000, removeOnComplete:false});
			this.my_timer_2.configure({ delay: 2000, repeatCount:4, removeOnComplete:false});

			domEvent1.innerText = '';
			domEvent2.innerText = '';
		}

		configureTimers();

		// Create and configure a fresh batch of timers
		keyboard.onKeyDown(keyboard.Z, this, function() { 
			timer_factory.stopAll().now();
			configureTimers();
		});

		// The most basic timer, it runs once. We can get to know it's done with it's 'complete' event
		keyboard.onKeyDown(keyboard.A, this, function() { 
			// Start the timer
			console.log('my_timer_1 started');
		
			this.my_timer_1.start();
			// This callback will be called when the repeate count reaches 0
			// The scope of this callback is the one specified when creating the timer with timer_factory.get
			this.my_timer_1.on('complete', function() {
				console.log('my_timer_1 completed');
				domEvent1.innerText = 'COMPLETE';
			}, true);
		});

		// This timer has a repeat count, and when it completes it is reconfigured.	
		// Hooking into the 'repeate' event lets us know when a loop has been completed.		
		keyboard.onKeyDown(keyboard.S, this, function() { 
			console.log('my_timer_2 started');

			this.my_timer_2.start();

			this.my_timer_2.on('repeate', function(repeatCount){
				console.log('my_timer_2 repeat count: ' + repeatCount);
				domEvent2.innerText = 'REPEATE COUNT: ' + repeatCount;
			}, false, true);

			this.my_timer_2.on('complete', function() {
				console.log('my_timer_2 completed');
				domEvent2.innerText = 'COMPLETE';
			}, true);
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

		domTimer1.innerText = 'TIMER 1: ' + timer_factory.formatMinutesSeconds(this.my_timer_1.rest());
		domTimer2.innerText = 'TIMER 2: ' + timer_factory.formatMinutesSeconds(this.my_timer_2.rest());
	});

	// This is the main setup that kicks off the whole thing
	// Notice how it needs to find a '#main' and '#game' in the document
	game.create(document.getElementById('main'), document.getElementById('game'));
});