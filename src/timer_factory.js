define(function(require) {
	var TimerFactory = function() {
		this.timeOuts = [];
	};

	TimerFactory.prototype.get = function(owner, name, propertyName) {
		var timeout = new Timer(owner, name, propertyName);
		this.timeOuts.push(timeout);
		return timeout;
	};

	var applyChangeToSomeTimers = function(state, identifier, identifierValue) {
		this.forEach(function(element, index, array) {
			if (element[identifier] === identifierValue) {
				element[state]();
			}
		});
	}

	var applyChangeToAllTimers = function(state) {
		this.forEach(function(element, index, array) {
			element[state]();
		});
	}

	var getChangeObject = function(state) {
		var self = this;

		return {
			wich: function(identifier, identifierValue) {
				applyChangeToSomeTimers.call(self.timeOuts, state, identifier, identifierValue);
			},
			now: function() {
				applyChangeToSomeTimers.call(self.timeOuts, state);
			}
		}
	}

	TimerFactory.prototype.stopAll = function() {
		return getChangeObject.call(this, 'stop');
	};
	TimerFactory.prototype.pauseAll = function() {
		return getChangeObject.call(this, 'pause');
	};
	TimerFactory.prototype.resumeAll = function() {
		return getChangeObject.call(this, 'resume');
	};
	TimerFactory.prototype.removeAll = function() {
		return getChangeObject.call(this, 'remove');
	};

	var timerFactory = new TimerFactory();

	Delegate = require('delegate')

	var Timer = Delegate.extend({
		init: function(owner, name, propertyName) {
			if (!owner) {
				throw new Error('Timer must have an owner, if unsure just send in "this"')
			}
			if (!name) {
				throw new Error('Timer must have an name to identify it later')
			}

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

		configure: function(options) {
			options['delay'] = options['delay'] || this._delay;
			options['repeatCount'] = options['repeatCount'] || this.repeateCount;
			options['removeOnComplete'] = options['removeOnComplete'] || this.removeOnComplete;

			this.Delay(options['delay']);
			this.RepeateCount(options['repeatCount']);
			this.RemoveOnComplete(options['removeOnComplete']);

			return this;
		},

		start: function(resumeTime) {
			if (this.isRunning || this.isPaused) {
				return;
			}

			this.startTime = Date.now();

			this.isRunning = true;
			this.isPaused = false;

			var actualDelay = resumeTime ? resumeTime : this.initDelay;

			var to = this;

			this.id = setTimeout(function() {
				if (to.isRunning && !to.isPaused) {
					to.execute("repeate", to.repeates)
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

						to.execute("complete")

						if (to.removeOnComplete) {
							to.remove();
						}
					}
				}
			}, actualDelay);
		},

		stop: function() {
			clearTimeout(this.id);

			this.isRunning = false;
			this.isPaused = false;
			this.repeateCount = this.initRepeatCount;
			this._delay = this.initDelay;
			this.repeates = 0;
		},

		reset: function(withCallback) {
			if (withCallback)
				this.callback.call(this.scope);

			this.stop();
			this.start();
		},

		pause: function() {
			if (!this.isRunning) {
				return;
			}

			clearTimeout(this.id);
			this.pauseTime = Date.now();
			this.isRunning = false;
			this.isPaused = true;
		},

		resume: function() {
			if (!this.isRunning && !this.isPaused) {
				return;
			}

			this.isPaused = false;
			this._delay -= (this.pauseTime - this.startTime);
			this.start(this._delay);
		},

		remove: function() {
			this.stop();
			index = timerFactory.timeOuts.indexOf(this);
			timerFactory.timeOuts.splice(index, 1);	
		},

		Delay: function(d) {
			this._delay = d;
			this.initDelay = d;
			return this;
		},

		RepeateCount: function(r) {
			this.repeateCount = r;
			this.initRepeatCount = r;
			return this;
		},

		RemoveOnComplete: function(r) {
			this.removeOnComplete = r;
			return this;
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

	return timerFactory;
});