//This example will deal with the timer_factory module.
//This module exists because Javascript's setTimeout and setInterval methods work,
//but they are a bit lacking in functionality.

//The timer factory gives you a type of object which uses setTimeout under the hood,
//it has convenience methods such as pause/resume and a couple of callbacks 

//The factory in turn keeps track of all timers created and will let you pause,resume or stop
//all timers in your application with one method call.

define(function(require) {
	var main = function() {
		gjs.game.on("init", this, function() {			
			var timer_factory = require('timer_factory');
			//Will be using this module to control the creation, start, pause and stop timers
			var keyboard = require('keyboard');

			//Create and configure a freash batch of timers
			keyboard.onKeyDown(keyboard.Z, this, function() { 
				//Making sure we have a clean slate each time
				timer_factory.removeAll().now();

				//Creating the timers
				//This creates a timer object, it has 3 arguments
				//1) It becomes part of the scope 'this' (or any other scope passed), 
				//2) It belongs to the group 'timer_1'
				//3) And can be accessed in the scope specified in 1) through the name 'my_timer' 
				timer_factory.get(this, 'timer_1', 'my_timer_1');
				timer_factory.get(this, 'timer_1', 'my_timer_2');

				//Configuring the timers
				this.my_timer_1.configure({ delay: 3000 });
				this.my_timer_2.configure({ delay: 2000, repeatCount:2, removeOnComplete:false});
			});

			//Bring up your javascript console to view when stuff gets printed.
			//It's pretty lame, but the example goes off scope otherwise.

			//The most basic timer, after running once, it is destroyed never to be seen again.
			//Being destroyed means it is removed from the factory cache, and removed from the owner.
			//Trying to access it again after it is complete would just break things.
			keyboard.onKeyDown(keyboard.A, this, function() { 
				if (!this.my_timer_1) return

				//Start the timer
				console.log('my_timer_1 started');
				console.log('Total timer amount in factory: ' + timer_factory.timeOuts.length);

				this.my_timer_1.start();
				//This callback will be called when the repeate count reaches 0
				//The scope of this callback is the one specified when creating the timer with timer_factory.get
				this.my_timer_1.on('remove', function() {
					console.log('my_timer_1 completed and destroyed');
					console.log('Total timer amount in factory: ' + timer_factory.timeOuts.length)
				});
			});
	
			//This timer will not be destroyed when it completes.
			//That means it can be restarted and it's properties changed.
			//In this case it is re-used as a one shot timer.			
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

					//Re configure
					this.my_timer_2.configure({ delay: 5000, repeatCount:1, removeOnComplete:true});
					this.my_timer_2.start();
				});

				this.my_timer_2.on('remove', function() {
					console.log('my_timer_2 completed and destroyed');
					console.log('Total timer amount in factory: ' + timer_factory.timeOuts.length)
				});
			});

			//This is not what this module can do, but honestly this example is pretty boring.

			//A timer object has the following methods
				//start
				//reset // Reset timer. It is stopped and started from the beginning inmediately.
				//stop 
				//pause
				//resume
				//remove // Remove timer from the factory, never to be seen again.

			//All of those states have associated callbacks of the same name.
				//this.my_timer.on('start', function() { //will be triggered when the start method is called } )
			// Additional callbacks include 'repeate' and 'complete'

			//to control timers in bulk 
				//timer_factory.startAll().now()
				//timer_factory.resetAll().now() // Resets all timers. They are stopped and started from the beginning inmediately.
				//timer_factory.stopAll().now() 
				//timer_factory.pauseAll().now()
				//timer_factory.resumeAll().now()
				//timer_factory.removeAll().now() // Remove all timers from the factory, never to be seen again.

			//There is a variation to those methods which is not so obvious though
				//timer_factory.stopAll().which('name', 'timer_1'), will stop all timers with a name of 'timer_1'
				//timer_factory.stopAll().which('owner', this), will stop all timers whose owner is 'this'

			//Same goes for the other variations of the same methods. 
		});
	};

	return new main()
});