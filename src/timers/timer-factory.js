/**
 * # timer-factory.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [delegate](@@delegate@@)
 *
 * Depends of: 
 * [timer](@@timer@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder) 
 * 
 * This module provides a factory to create [timer](@@timer@@) objects. Asides from creating them it provides methods
 * to manipulate them in bulk.
 *
 * ### The Timer Factory object extends [delegate](@@delegate@@) so it provides a few events to hook into:
 * 
 * ### **create** 
 * When a timer is created and added to the factory registry
 *
 * ``` javascript  
 * timerFactory.on(timerFactory.CREATE, function(timer) {});
 * ```
 *
 * ### **remove** 
 * When a timer is removed from the factory registry
 *
 * ``` javascript  
 * timerFactory.on(timerFactory.REMOVE, function(timer) {});
 * ```
 *
 * ### **complete** 
 * When a timer completes
 *
 * ``` javascript  
 * timerFactory.on(timerFactory.COMPLETE, function(timer) {});
 * ```
 *
 * ### **repeate** 
 * When a timer repeates
 *
 * ``` javascript  
 * timerFactory.on(timerFactory.REPEATE, function(timer) {});
 * ```
 *
 * ### **start** 
 * When a timer starts
 *
 * ``` javascript  
 * timerFactory.on(timerFactory.START, function(timer) {});
 * ```
 *
 * ### **pause** 
 * When a timer pauses
 *
 * ``` javascript  
 * timerFactory.on(timerFactory.PAUSE, function(timer) {});
 * ```
 *
 * ### **resume** 
 * When a timer resumes
 *
 * ``` javascript  
 * timerFactory.on(timerFactory.RESUME, function(timer) {});
 * ```
 *
 * ### **reset** 
 * When a timer is reset
 *
 * ``` javascript  
 * timerFactory.on(timerFactory.RESET, function(timer) {});
 * ```
 *
 * ### **stop** 
 * When a timer is stops
 *
 * ``` javascript  
 * timerFactory.on(timerFactory.STOP, function(timer) {});
 * ```
 */

/**
 * Manage Timers
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require) {

	var ErrorPrinter = require('error-printer');

	var TimerFactory = require('delegate').extend({
		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 *
		 * Constructor
		 */
		init: function() {
			this._super();
			this.timeOuts = [];
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>get</strong></p>
		 *
		 * Creates a new instance of a Timer.
		 * 
		 * After creating it, it saves it into an array. It will also create a property in the **owner** 
		 * giving it the name **propertyName**. 
		 * 
		 * @param  {Object} owner        Object in which the method was called in. Common value is _'this'_
		 * @param  {String} name         An identifier for the Timer
		 * @param  {String} propertyName Name of the property the timer will be added in **owner**.
		 * @throws {Error} If the owner already has a property with the value of **propertyName**
		 * @throws {Error} If owner is not passed as argument
		 * @throws {Error} If name is not passed as argument
		 * @throws {Error} If propertyName is not passed as a       
		 */
		get: function(owner, name, propertyName) {
			if(owner.hasOwnProperty(propertyName)) {
				ErrorPrinter.printError('Timer Factory', 'This owner is already using this property, assigning it again with a timer might cause your program to go ape shit.');
			}else{
				if (!owner) { 
					ErrorPrinter.printError('Timer Factory', 'Timer must have an owner, if unsure just send in "this"');
				}

				if (!name) { 
					ErrorPrinter.printError('Timer Factory', 'Timer must have an name to identify it later');
				}
				
				if (!propertyName) { 
					ErrorPrinter.printError('Timer Factory', 'Timer must have a propertyName to be refered with from its owners scope');
				}

				var timerConstructor = require('timer');

				var timeout = new timerConstructor(owner, name, propertyName);
				this.timeOuts.push(timeout);
				owner[propertyName] = timeout;	

				this.execute(this.CREATE, timeout);

				var self = this;

				// Remove the timer from the factory when it's REMOVE event is fired
				timeout.on(timeout.REMOVE, function() {
					index = self.timeOuts.indexOf(this);
					self.timeOuts.splice(index, 1);

					self.execute(self.REMOVE, this);
				});

				timeout.on(timeout.START, function() {
					self.execute(self.START, this);
				});

				timeout.on(timeout.COMPLETE, function() {
					self.execute(self.COMPLETE, this);
				});

				timeout.on(timeout.REPEATE, function() {
					self.execute(self.REPEATE, this);
				});

				timeout.on(timeout.PAUSE, function() {
					self.execute(self.PAUSE, this);
				});

				timeout.on(timeout.RESUME, function() {
					self.execute(self.RESUME, this);
				});

				timeout.on(timeout.RESET, function() {
					self.execute(self.RESET, this);
				});

				timeout.on(timeout.STOP, function() {
					self.execute(self.STOP, this);
				});
			}
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>getTotalCount</strong></p>
		 *
		 * @return {Number} The total amount of timers
		 */
		getTotalCount: function() {
			return this.timeOuts.length;
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>getRunningCount</strong></p>
		 *
		 * @return {Number} The amount of timers currently in a running state
		 */
		getRunningCount: function() {
			return getCountInState.call(this, 'Running');
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>getPausedCount</strong></p>
		 *
		 * @return {Number} The amount of timers currently in a paused state
		 */
		getPausedCount: function() {
			return getCountInState.call(this, 'Paused');
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>getStoppedCount</strong></p>
		 *
		 * @return {Number} The amount of timers currently in a stopped state
		 */
		getStoppedCount: function() {
			return getCountInState.call(this, 'Stopped');
		},
		/**
		 * --------------------------------
		 */

		/*
		These methods are pretty obvious in what they do. They are meant to apply a state to all registered timers
		at the same time. Usefull to handle global state of an application.

		For instance, if the application looses focus, you probably want to pause all timers, regardless of what they are doing
		and to which part of the code base they belong to.
		
		After gaining focus, you can resume them all together. Pretty usefull.

		Although the names suggest obvious behaviour, the usage is not so obvious. Take a look at the object returned by **getChangeObject**
		to see how to you can control timers in bulk.
		 */
		startAll: function() { 
			return getChangeObject.call(this, 'start'); 
		},
		resetAll: function() { 
			return getChangeObject.call(this, 'reset'); 
		},
		stopAll: function() { 
			return getChangeObject.call(this, 'stop'); 
		},
		pauseAll: function() { 
			return getChangeObject.call(this, 'pause'); 
		},
		resumeAll: function() { 
			return getChangeObject.call(this, 'resume'); 
		},
		removeAll: function() { 
			return getChangeObject.call(this, 'remove'); 
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>setProperty</strong></p>
		 *
		 * This method is used to add or modify properties of all timers based
		 * on a condition. If the condition evaluates to _'true'_ the property will be
		 * set with the given value.
		 * 
		 * @param {Sring}    propertyName Name of the propety to set
		 * @param {Anything} value        Value to set
		 * @param {Function} condition    Condition that must be fullfilled before setting the property
		 */
		setProperty: function(propertyName, value, condition) {
			this.timeOuts.forEach(function(timer, index, array) {
				if(condition(timer, index, array)) {
					timer[propertyName] = value;
				}
			});
		},

		/**
		 * <p style='color:#AD071D'><strong>toMins</strong></p>
		 *
		 * @param  {Number} ms Milliseconds to convert to minutes
		 *
		 * @return {Number} The amount of minutes
		 */
		toMins: function(ms) { 
			return parseInt(ms/(1000*60)); 
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>toSecs</strong></p>
		 *
		 * @param  {Number} ms Milliseconds to convert to seconds
		 *
		 * @return {Number} The amount of seconds
		 */
		toSecs: function(ms) { 
			return parseInt((ms/1000));	
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>toMillisFraction</strong></p>
		 *
		 * @param  {Number} ms Milliseconds to truncate
		 *
		 * @return {Number} Truncated milliseconds 
		 */
		toMillisFraction: function(ms) { 
			return parseInt((ms%1000)/100); 
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>formatMinutes</strong></p>
		 *
		 * @param  {Number} ms Milliseconds to format
		 *
		 * @return {String} Formatted milliseconds to minutes
		 */
		formatMinutes: function(ms) { 
			var mins = this.toMins(ms) % 60;
	    	return (mins < 10) ? "0" + mins : mins;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>formatSeconds</strong></p>
		 *
		 * @param  {Number} ms Milliseconds to format
		 *
		 * @return {String} Formatted milliseconds to seconds
		 */
		formatSeconds: function(ms) {
			var fms = this.toMillisFraction(ms);
			var secs = this.toSecs(ms) % 60;
	    	return ((secs < 10) ? "0" + secs : secs) + '.' + fms;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>formatMinutesSeconds</strong></p>
		 *
		 * @param  {Number} ms Milliseconds to format
		 *
		 * @return {String} Formatted milliseconds to minutes:seconds
		 */
		formatMinutesSeconds: function(ms) {
			return this.formatMinutes(ms) + ':' + this.formatSeconds(ms);
		},
		/**
		 * --------------------------------
		 */
	});

	// ### Getters for all the types of events the sound player can hook into
	Object.defineProperty(TimerFactory.prototype, "CREATE", { get: function() { return 'create'; } });
	Object.defineProperty(TimerFactory.prototype, "REMOVE", { get: function() { return 'remove'; } });
	Object.defineProperty(TimerFactory.prototype, "COMPLETE", { get: function() { return 'complete'; } });
	Object.defineProperty(TimerFactory.prototype, "REPEATE", { get: function() { return 'repeate'; } });
	Object.defineProperty(TimerFactory.prototype, "START", { get: function() { return 'start'; } });
	Object.defineProperty(TimerFactory.prototype, "PAUSE", { get: function() { return 'pause'; } });
	Object.defineProperty(TimerFactory.prototype, "RESUME", { get: function() { return 'resume'; } });
	Object.defineProperty(TimerFactory.prototype, "RESET", { get: function() { return 'reset'; } });
	Object.defineProperty(TimerFactory.prototype, "STOP", { get: function() { return 'stop'; } });
	/**
	 * --------------------------------
	 */

	var getCountInState = function(state) {
		var result = 0;

		for (var i = 0; i < this.timeOuts.length; i++) {
			if(this.timeOuts[i][state]) {
				result++;
			}
		}

		return result;
	}

	var applyChangeToTimersIfTrue = function(state, condition) {
		var timer = null;

		for(var i=this.length-1; i>=0; i--) {
			timer = this[i];

			if(condition(timer, i, this)) {
				timer[state]();		
			}
		}
	}

	var applyChangeToSomeTimers = function(state, identifier, identifierValue) {
		var timer = null;

		for(var i=this.length-1; i>=0; i--) {
			timer = this[i];

			if (timer[identifier] === identifierValue) {
				timer[state]();
			}
		}
	}

	var applyChangeToAllTimers = function(state) {
		for(var i=this.length-1; i>=0; i--) {
			timer = this[i];
			timer[state]();
		}
	}

	/**
	 * <p style='color:#AD071D'><strong>getChangeObject</strong></p>
	 *
	 * Private method, but important enough to document.
	 * 
	 * This method returns on object with methods to filter which timers 
	 * should move to a new state.
	 * 
	 * @param  {String} state The state selected timers will go to. ej. _'start'_
	 * @returns {Object}       A control Object to manage all the registered Timers.
	 */
	var getChangeObject = function(state) {
		var self = this;

		return {
			/**
			 * <p style='color:#AD071D'><strong>withName</strong></p>
			 * All the timers with a **name** equaling (===) **value** qualify to change state
			 */
			withName: function(value) {
				applyChangeToSomeTimers.call(self.timeOuts, state, 'name', value);	
			},
			/**
			 * --------------------------------
			 */
			
			/**
			 * <p style='color:#AD071D'><strong>withOwner</strong></p>
			 * All the timers with a **owner** equaling (===) **value** qualify to change state
			 */
			withOwner: function(owner) {
				applyChangeToSomeTimers.call(self.timeOuts, state, 'owner', owner);	
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>which</strong></p>
			 *
			 * The **condition** function will be evaluates for all timers, timers
			 * that evaluate to true will qualify to change state.
			 * 
			 * The signature for the condition function is **function(timer, index, array)**
			 */
			which: function(condition) {
				applyChangeToTimersIfTrue.call(self.timeOuts, state, condition);	
			},
			/**
			 * --------------------------------
			 */
						
			/**
			 * <p style='color:#AD071D'><strong>now</strong></p>
			 * All timers qualify to change state
			 */
			now: function() {
				applyChangeToAllTimers.call(self.timeOuts, state);
			}
			/**
			 * --------------------------------
			 */
		}
	}

	return new TimerFactory();
});