define(function() {
	var TimerFactory = function() {
		this.scopeTimeOuts = {};
	};

	TimerFactory.prototype.getTimeOut = function() {
		return new Timer();
	};

	TimerFactory.prototype.getConfiguredTimeOut = function(delay, repeatCount, scope, callback, removeOnComplete, onComplete) {
		var timer = new Timer();
		
		timer.Delay(delay).
			  RepeateCount(repeatCount).
			  Scope(scope).
			  Callback(callback).
			  RemoveOnComplete(removeOnComplete).
			  Complete(onComplete);

		this.addToScopeHash(scope, timer);
		
		return timer;
	};

	TimerFactory.prototype.addToScopeHash = function(scope, timer) {
		if (!this.scopeTimeOuts[scope] && scope) {
			this.scopeTimeOuts[scope] = [];
		}

		if(this.scopeTimeOuts[scope]) {
			this.scopeTimeOuts[scope].push(timer);
		}
	}

	TimerFactory.prototype.removeFromScopeHash = function(scope, timer) {
		this.scopeTimeOuts[scope].splice(this.scopeTimeOuts[scope].indexOf(timer), 1);
	}

	TimerFactory.prototype.stopAllTimeOuts = function() {
		for (var k in this.scopeTimeOuts) {
			for (var i = 0; i < this.scopeTimeOuts[k].length; i++) {
				this.scopeTimeOuts[k][i].stop();
			}
		}
	};

	TimerFactory.prototype.pauseAllTimeOuts = function() {
		for (var k in this.scopeTimeOuts) {
			for (var i = 0; i < this.scopeTimeOuts[k].length; i++) {
				this.scopeTimeOuts[k][i].pause();
			}
		}
	};

	TimerFactory.prototype.resumeAllTimeOuts = function() {
		for (var k in this.scopeTimeOuts) {
			for (var i = 0; i < this.scopeTimeOuts[k].length; i++) {
				this.scopeTimeOuts[k][i].resume();
			}
		}
	};

	TimerFactory.prototype.removeAllTimeOuts = function() {
		for (var k in this.scopeTimeOuts) {
			for (var i = this.scopeTimeOuts[k].length - 1; i >= 0; i--) {
				this.scopeTimeOuts[k][i].remove();
			}
		}
	};

	TimerFactory.prototype.stopAllTimeOutsWithScope = function() {
		for (var i = 0; i < this.scopeTimeOuts[scope].length; i++) {
			if (this.scopeTimeOuts[scope][i].scope === scope) {
				this.scopeTimeOuts[scope][i].stop();
			}
		}
	};

	TimerFactory.prototype.removeAllTimeOutsWithScope = function() {
		for (var i = this.scopeTimeOuts[scope].length - 1; i >= 0; i--) {
			if (this.scopeTimeOuts[scope][i].scope === scope) {
				this.scopeTimeOuts[scope][i].remove();
			}
		}
	};

	var timerFactory = new TimerFactory();

	var Timer = function() {
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
	};

	Timer.prototype.start = function(resumeTime) {
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
				if (to.callback) {
					to.callback.call(to.scope, to.repeates);
					to.repeates++;
				}
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

					if (to.onComplete) {
						to.onComplete.call(to.scope);
					}
					if (to.removeOnComplete) {
						to.remove();
					}
				}
			}

		}, actualDelay);

		return this;
	};

	Timer.prototype.stop = function(resumeTime) {
		clearTimeout(this.id);

		this.isRunning = false;
		this.isPaused = false;
		this.repeateCount = this.initRepeatCount;
		this._delay = this.initDelay;
		this.repeates = 0;
	};

	Timer.prototype.reset = function(withCallback) {
		if (withCallback)
			this.callback.call(this.scope);

		this.stop();
		this.start();
	};

	Timer.prototype.pause = function() {
		if (!this.isRunning) {
			return;
		}

		clearTimeout(this.id);
		this.pauseTime = Date.now();
		this.isRunning = false;
		this.isPaused = true;
	};

	Timer.prototype.resume = function() {
		if (!this.isRunning && !this.isPaused) {
			return;
		}

		this.isPaused = false;
		this._delay -= (this.pauseTime - this.startTime);
		this.start(this._delay);
	};

	Timer.prototype.remove = function() {
		this.stop();
		timerFactory.scopeTimeOuts[this.scope].splice(timerFactory.scopeTimeOuts[this.scope].indexOf(this), 1);
	}

	Timer.prototype.Delay = function(d) { this._delay = d; this.initDelay = d; return this; };
	Timer.prototype.RepeateCount = function(r) { this.repeateCount = r; this.initRepeatCount = r; return this; };
	Timer.prototype.Callback = function(c) { this.callback = c; return this; };
	Timer.prototype.Complete = function(c) { this.onComplete = c; return this; };
	Timer.prototype.RemoveOnComplete = function(r) { this.removeOnComplete = r; return this; };
	
	Timer.prototype.Scope = function(s) { 
		if(this.scope) {
			timerFactory.removeFromScopeHash(this.scope, this)
		}
		
		timerFactory.addToScopeHash(s, this);
		this.scope = s; 

		return this; 
	};

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