/**
 * # timer-factory.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of: 
 * [timer](@@timer@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder) 
 * 
 * This module provides a factory to create [timer](@@timer@@) objects. Asides from creating them it provides methods
 * to manipulate them in bulk.
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

	/**
	 * ## **TimerFactory**
	 */
	var TimerFactory = function() {
		this.timeOuts = [];
	};

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
	TimerFactory.prototype.get = function(owner, name, propertyName) {
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

			var timeout = new Timer(owner, name, propertyName);
			this.timeOuts.push(timeout);
			owner[propertyName] = timeout;	

			var self = this;

			// Remove the timer from the factory when it's REMOVE event is fired
			timeout.on(timeout.REMOVE, function() {
				index = self.timeOuts.indexOf(this);
				self.timeOuts.splice(index, 1);
			});
		}
	};
	/**
	 * --------------------------------
	 */

	/*
	These methods are pretty obvious in what they do. They are meant to apply a state to all registered timers
	at the same time. Usefull to handle global state of an application.

	For instance, if the application looses focus, you probably want to pause all timers, regardless of what they are doing
	and to which part of the code base they belong to.
	
	After gaining focus, you can resume them all together. Pretty usefull.

	Although the names suggest obvious behaviour, the usage is not so obvious. Keep reading to find out
	how to use the control object these methods return.
	 */
	TimerFactory.prototype.startAll = function() { return getChangeObject.call(this, 'start'); }
	TimerFactory.prototype.resetAll = function() { return getChangeObject.call(this, 'reset'); }
	TimerFactory.prototype.stopAll = function() { return getChangeObject.call(this, 'stop'); }
	TimerFactory.prototype.pauseAll = function() { return getChangeObject.call(this, 'pause'); }
	TimerFactory.prototype.resumeAll = function() { return getChangeObject.call(this, 'resume'); }
	TimerFactory.prototype.removeAll = function() { return getChangeObject.call(this, 'remove'); }	
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
	TimerFactory.prototype.setProperty = function(propertyName, value, condition) {
		this.timeOuts.forEach(function(timer, index, array) {
			if(condition(timer, index, array)) {
				timer[propertyName] = value;
			}
		});
	}

	// Some convenience methods to convert milliseconds to human friendly formats
	TimerFactory.prototype.toMins = function(ms) { return parseInt(ms/(1000*60)); }
	TimerFactory.prototype.toSecs = function(ms) { return parseInt((ms/1000));	}
	TimerFactory.prototype.toMillisFraction = function(ms) { return parseInt((ms%1000)/100); }
	
	TimerFactory.prototype.formatMinutes = function(ms) { 
		var mins = this.toMins(ms) % 60;
    	return (mins < 10) ? "0" + mins : mins;
	}

	TimerFactory.prototype.formatSeconds = function(ms) {
		var fms = this.toMillisFraction(ms);
		var secs = this.toSecs(ms) % 60;
    	return ((secs < 10) ? "0" + secs : secs) + '.' + fms;
	}

	TimerFactory.prototype.formatMinutesSeconds = function(ms) {
		return this.formatMinutes(ms) + ':' + this.formatSeconds(ms);
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