define(["delegate"], function(Delegate) {

	var Game = Delegate.extend({
		init: function() {
			this._super();

			this.focus = true;
			this.blur = true;
			this.initialized = false;
			this.lastUpdate = Date.now();

			this.manualHardPause = false;
			this.manualSoftPause = false;
			this.wasInSoftPause = false;

			this.mainContainer = null;
			this.canvas = null;
			this.context = null;

			this.delta = null;
			this.isPaused = null;

			this.extensions = {
				"create": [],
				"update": [],
				"pause": [],
				"resume": [],
			}
		},

		execute_extensions: function(place) {
			for(var i=0; i<this.extensions[place].length; i++){
				this.extensions[place][i].execute();
			}
		},

		add_extension: function(place, extension) {
			this.extensions[place].push(extension);
		},

		create: function(mainContainer, canvas) {
			this.mainContainer = mainContainer;
			this.canvas = canvas;
			this.context = this.canvas.getContext("2d");

			this.execute_extensions("create");

			var frameRequest, mainLoop;
			var self = this;

			var mainGameCreation = function() {
				self.initialized = true;
				self.execute("init");
			};

			var onBlur = function(event) {
				if (self.blur) {
					self.blur = false;
					self.focus = true;

					self.execute_extensions("pause");	
					self.execute("pause");

					if (!self.manualSoftPause) {
						window.cancelAnimationFrame(frameRequest);
					}
				}
			}
			window.addEventListener("blur", onBlur);

			var onFocus = function(event) {
				//A pause made manually can only be undone manually
				if (self.manualHardPause || self.manualSoftPause) {
					return;
				}

				//In the case the game is not already created when the document gains focus for the first time, it is created here.
				if (!self.initialized) {
					mainGameCreation();
				} else {
					if (self.focus) {
						self.blur = true;
						self.focus = false;

						self.execute_extensions("resume");
						self.execute("resume");

						if (!self.wasInSoftPause) {
							frameRequest = window.requestAnimationFrame(mainLoop);
						} else {
							self.wasInSoftPause = true;
						}

					}
				}
			}
			window.addEventListener("focus", onFocus);

			if (document.hasFocus()) {
				mainGameCreation();

				var now;

				mainLoop = function() {
					now = Date.now();

					this.delta = (now - self.lastUpdate) / 1000;
					this.isPaused = self.manualSoftPause;

					self.lastUpdate = now;

					self.execute_extensions("update");
					self.execute("update");

					frameRequest = window.requestAnimationFrame(mainLoop);
				}

				var vendors = ['ms', 'moz', 'webkit', 'o'];

				for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
					window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
					window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
				}

				if (!window.requestAnimationFrame) {
					window.requestAnimationFrame = function(callback) {
						return window.setTimeout(callback, 1000 / 60);;
					};
				}

				if (!window.cancelAnimationFrame) {
					window.cancelAnimationFrame = function(id) {
						clearTimeout(id);
					};
				}

				frameRequest = window.requestAnimationFrame(mainLoop);
			}
		},

		softPause: function() {
			this.manualSoftPause = true;
			this.wasInSoftPause = true;
			this.dispatchUIEvent('blur');
		},

		softResume: function() {
			this.manualSoftPause = false;
			this.dispatchUIEvent('focus');
		},

		hardPause: function() {
			this.manualHardPause = true;
			this.dispatchUIEvent('blur');
		},

		hardResume: function() {
			this.manualHardPause = false;
			this.dispatchUIEvent('focus');
		},

		dispatchUIEvent: function(event) {
			var evt = document.createEvent("UIEvents");
			evt.initUIEvent(event, true, true, window, 1);
			window.dispatchEvent(evt);
		}

	});

	return new Game();
});