/**
 * # timer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of: 
 * [delegate](@@delegate@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * The timer object uses [**setTimeout**](https://developer.mozilla.org/en-US/docs/Web/API/Window.setTimeout) under the hood and adds 
 * a few things to it. The main feature is that it handles recording the timeout id, so that stopping it
 * is more intuitive, with a **stop** method. Another cool feature is being able to pause the timer, 
 * something which [**setTimeout**](https://developer.mozilla.org/en-US/docs/Web/API/Window.setTimeout) simply does not do.
 *
 * ### The Timer object extends [delegate](@@delegate@@) so it provides a few events to hook into:
 *
 * ### **start**
 * When a timer starts. 
 *
 * ``` javascript  
 * timer.on(component.START, function() {});
 * ```
 * 
 * ### **repeate** 
 * Each time a timer is repeated. 
 *
 * Registered callbacks get the amount of repeats left as argument. 
 * ``` javascript  
 * timer.on(timer.REPEATE, function(repeatsLeft) {});
 * ``` 
 *
 * ### **complete**
 * When a timer completes. 
 * 
 * ``` javascript  
 * timer.on(timer.COMPLETE, function() {});
 * ```
 *
 * ### **stop**
 * When a timer is stopped.
 * 
 * ``` javascript  
 * timer.on(timer.STOP, function() {});
 * ```
 * 
 * ### **reset**
 * When a timer is reset.
 * 
 * ``` javascript  
 * timer.on(timer.RESET, function() {});
 * ```
 * 
 * ### **pause**
 * When a timer is paused.
 * 
 * ``` javascript  
 * timer.on(timer.PAUSE, function() {});
 * ```
 * 
 * ### **resume**
 * When a timer is resumed.
 * 
 * ``` javascript  
 * timer.on(timer.RESUME, function() {});
 * ```
 * 
 * ### **remove**
 * When a timer is removed from the factory register.
 * 
 * ``` javascript  
 * timer.on('remove' function() {});
 * ``` 
 */

/**
 * Time, time, time, time, TIME!
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require) {
	var ErrorPrinter = require('error-printer');

	var Timer = require('delegate').extend({
		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 *
		 * Constructor
		 * 
		 * @param  {Object} owner        Scope to which this timer belongs to
		 * @param  {String} name         Name of the timer
		 * @param  {String} propertyName Property name in the owner scope for this timer
		 */
		init: function(owner, name, propertyName) {
			this._super();

			this.owner = owner;
			this.name = name;
			this.propertyName = propertyName;

			this._delay = 1000;
			this.initDelay = this._delay;

			this.repeateCount = 1;
			this.initRepeatCount = this.repeateCount;

			this.removeOnComplete = true;

			this.repeates = 0;
			this.id = -1;
			this.startTime = -1;
			this.pauseTime = -1;
			this.isRunning = false;
			this.isPaused = false;
		},

		/**
		 * <p style='color:#AD071D'><strong>on</strong></p>
		 *
		 * Wrapper to <a href=@@delegate@@>delegate</a> method of the same name
		 * 
		 * @param  {String} name Id that the function will be associated with
		 * @param  {Function} callback Function you want to execute
		 * @param  {Boolean} [removeOnExecute=false] The function will be removed from the corresponding list, after executing it once
		 * @param  {Boolean} [single=false] Do not add function if there is already one registered
		 */
		on: function(name, callback, removeOnComplete, single) {
			this._super(name, this.owner, callback, removeOnComplete, false, single);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>configure</strong></p>
		 *
		 * Configures the timer.
		 *		 
		 * ``` javascript  
		 * timer.configure({
			// The amount of milliseconds the timer will last
			// Defaults to 1000
			delay: 2000,
			// The amount of times to repeate the timer.
			// Defaults to 1
			repeateCount: 2,
			// If set to true the timer is removed from the factories array when it completes.
			// Defaults to true
			removeOnComplete: false
		 * });
		 * ```
		 *
		 * @param  {Object} options An object with all the options to configure a timer        
		 */
		configure: function(options) {
			if (!options.hasOwnProperty('delay')) { options['delay'] = this._delay;	}
			if (!options.hasOwnProperty('repeatCount')) { options['repeatCount'] = this.repeateCount;	}
			if (!options.hasOwnProperty('removeOnComplete')) { options['removeOnComplete'] = this.removeOnComplete;	}

			this.Delay(options['delay']);
			this.RepeateCount(options['repeatCount']);
			this.RemoveOnComplete(options['removeOnComplete']);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>start</strong></p> 
		 * 
		 * Starts the timer.
		 */
		start: function(resumeTime) {
			if (this.isRunning || this.isPaused) {
				return;
			}

			this.startTime = Date.now();

			this.isRunning = true;
			this.isPaused = false;

			var actualDelay = resumeTime ? resumeTime : this.initDelay;

			var to = this;

			this.execute(this.START);

			this.id = setTimeout(function() {
				if (to.Running) {
					to.execute(to.REPEATE, to.repeates)
					to.repeates++;
				} else {
					return;
				}

				if (to.repeateCount < 0) {
					to.isRunning = false;
					to._delay = to.initDelay;
					to.start();
				} else {
					to.repeateCount--;

					if (to.repeateCount > 0) {
						to.isRunning = false;
						to._delay = to.initDelay;
						to.start();
					} else {
						to.stop();

						to.execute(to.COMPLETE);

						if (to.removeOnComplete) {
							to.remove();
						}
					}
				}
			}, actualDelay);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>stop</strong></p>
		 *
		 * Stops the timer. 
		 *
		 * Resets everything else. Starting the timer again will do so from the beginning.
		 */
		stop: function() {
			clearTimeout(this.id);

			this.isRunning = false;
			this.isPaused = false;
			this.repeateCount = this.initRepeatCount;
			this._delay = this.initDelay;
			this.repeates = 0;

			this.execute(this.STOP);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>reset</strong></p>
		 *
		 * Resets the timer.
		 * 
		 * Short cut for **stop** followed by **play**
		 */
		reset: function() {
			this.stop();
			this.start();

			this.execute(this.RESET);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>pause</strong></p>
		 *
		 * Pause the timer.
		 * 
		 * Pause the timer until the **resume** method is called.
		 */
		pause: function() {
			if (this.Stopped) return;
			if (this.Paused) return;
			
			clearTimeout(this.id);
			this.pauseTime = Date.now();
			this.isRunning = false;
			this.isPaused = true;

			this.execute(this.PAUSE);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>resume</strong></p> 
		 *
		 * Resume if paused.
		 */
		resume: function() {
			if (this.Stopped) return;
			if (this.Running) return;

			this.isPaused = false;
			this._delay -= (this.pauseTime - this.startTime);
			this.start(this._delay);

			this.execute(this.RESUME);
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>rest</strong></p>
		 *
		 * Get the time remaining
		 * 
		 * @return {Number} The time left
		 */
		rest: function() {
			// Timer is stopped, rest is the initial delay
			if (this.Stopped) {
				return this._delay;
			}

			// Timer is paused, rest is fixed
			if (this.Paused) {
				return this._delay - (this.pauseTime - this.startTime);
			}

			// Timer is running, rest is dynamic in relation to current time
			if (this.Running) {
				return (this.startTime + this._delay) - Date.now();
			}
		},

		/**
		 * <p style='color:#AD071D'><strong>remove</strong></p>
		 *
		 * Stop the timer and remove it from the factory register.
		 *
		 * It also nulls every property of the object, setting it up for garbage collection.
		 */
		remove: function() {
			this.stop();

			this.owner[this.propertyName] = null;
			delete this.owner[this.propertyName];
			this.owner = null;

			this.execute(this.REMOVE);

			this.destroy();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>Delay</strong></p>
		 *
		 * Sets the delay of the timer.
		 * 
		 * This method returns _'this'_ so it is possible to concatenate it.
		 * This method is used internally by **configure**
		 * 
		 * @param {Number} d Delay amount in milliseconds
		 *
		 * @return {Object} Itself
		 */
		Delay: function(d) {
			canModify();

			this._delay = d;
			this.initDelay = d;
			return this;
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>RepeateCount</strong></p>
		 *
		 * Sets the repeateCount of the timer.
		 * 
		 * This method returns the _'this'_ so it is possible to concatenate it.
		 * This method is used internally by **configure**
		 * 
		 * @param {Number} d Amount of times this timer should be repeated before completing.
		 *
		 * @return {Object} Itself
		 */
		RepeateCount: function(r) {
			canModify();

			this.repeateCount = r;
			this.initRepeatCount = r;
			return this;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>RemoveOnComplete</strong></p>
		 *
		 * Whether to remove the timer 
		 * from the factory register when complete.
		 * 
		 * This method returns the _'this'_ so it is possible to concatenate it.
		 * This method is used internally by **configure**
		 * 
		 * @param {Boolean} r Wheter to keep or remove the timer when it is done.
		 *
		 * @return {Object} Itself
		 */
		RemoveOnComplete: function(r) {
			canModify();

			this.removeOnComplete = r;
			return this;
		}
		/**
		 * --------------------------------
		 */
	});

	var canModify = function() {
		if (this.isRunning || this.isPaused) { 
			ErrorPrinter.printError('Timer', "Can't modify timer while it is running");
		}		
	}

	Object.defineProperty(Timer.prototype, "Stopped", {
		get: function() {
			return !this.isRunning && !this.isPaused;
		}
	});

	Object.defineProperty(Timer.prototype, "Paused", {
		get: function() {
			return !this.isRunning && this.isPaused;
		}
	});

	Object.defineProperty(Timer.prototype, "Running", {
		get: function() {
			return this.isRunning && !this.isPaused;
		}
	});

	Object.defineProperty(Timer.prototype, "delay", {
		get: function() {
			return this.initDelay;
		},
		set: function(v) {
			this._delay = v;
			this.initDelay = v;
		}
	});

	// ### Getters for all the types of events a Timer can hook into
	Object.defineProperty(Timer.prototype, "START", { get: function() { return 'start'; } });
	Object.defineProperty(Timer.prototype, "REPEATE", { get: function() { return 'repeate'; } });
	Object.defineProperty(Timer.prototype, "COMPLETE", { get: function() { return 'complete'; } });
	Object.defineProperty(Timer.prototype, "STOP", { get: function() { return 'stop'; } });
	Object.defineProperty(Timer.prototype, "PAUSE", { get: function() { return 'pause'; } });
	Object.defineProperty(Timer.prototype, "RESUME", { get: function() { return 'resume'; } });
	Object.defineProperty(Timer.prototype, "REMOVE", { get: function() { return 'remove'; } });
	/**
	 * --------------------------------
	 */

	return Timer;
});