define(["delegate"], function(Delegate) {

	var Game = Delegate.extend({
		init: function() {
			this._super();

			this.focus = true;
			this.blur = true;
			this.initialized = false;
			this.lastUpdate = Date.now();

			this.mainContainer = null;
			this.canvas = null;
			this.context = null;

			this.delta = null;

			this.extensions = {
				"create": [],
				"update": [],
				"pause": [],
				"resume": []
			}
		},

		execute_extensions: function(place) {
			for(var i=0; i<this.extensions[place].length; i++){
				this.extensions[place][i].execute();
			}
		},

		add_extension: function(extensionMoudle) {
			var ex = new extensionMoudle();
			this.extensions[ex.type()].push(ex);
		},

		create: function(mainContainer, canvas, layers) {
			this.mainContainer = mainContainer;
			this.canvas = canvas;
			this.context = this.canvas.getContext("2d");

			this.execute_extensions("create");

			var mainLoop;
			var self = this;

			var mainGameCreation = function() {
				self.initialized = true;
				self.execute("init");
			};

			var paused = false;

			var onBlur = function(event) {
				if (self.blur) {
					self.blur = false;
					self.focus = true;

					if (!paused) {
						self.execute_extensions("pause");	
						self.execute("pause");

						paused = true;
					}
				}
			};

			window.addEventListener("blur", onBlur);

			var onFocus = function(event) {
				//In the case the game is not already created when the document gains focus 
				//for the first time, it is created here.
				if (!self.initialized) {
					mainGameCreation();
				} else {
					if (self.focus) {
						self.blur = true;
						self.focus = false;

						if (paused) {
							self.execute_extensions("resume");
							self.execute("resume");

							paused = false;
						}
					}
				}
			}

			this.pause = onBlur;
			this.resume = onFocus;

			window.addEventListener("focus", onFocus);

			if (document.hasFocus()) {
				mainGameCreation();

				var now;

				mainLoop = function() {
					now = Date.now();
					this.delta = (now - self.lastUpdate) / 1000;
					self.lastUpdate = now;

					self.execute_extensions("update");
					self.execute("update");

					window.requestAnimationFrame(mainLoop);
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

				window.requestAnimationFrame(mainLoop);
			}
		}
	});

	return new Game();
});