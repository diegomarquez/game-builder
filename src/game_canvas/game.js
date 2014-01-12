/**
 * # game.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [delegate](@@delegate@@)
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module deines the object
 */

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

			var mainLoop;
			var self = this;

			var mainGameCreation = function() {
				self.initialized = true;
				self.execute_extensions(this.CREATE);
				self.execute(this.CREATE);
			};

			var blur = false;

			var onBlur = function() {
				var oldBlur = self.blur;

				if (self.blur) {
					self.blur = false;
					self.focus = true;

					if (!blur) {
						self.execute_extensions(this.BLUR);	
						self.execute(this.BLUR);

						blur = true;
					}
				}

				return oldBlur;
			};

			var onFocus = function() {
				var oldFocus = self.focus;

				//In the case the game is not already created when the document gains focus 
				//for the first time, it is created here.
				if (!self.initialized) {
					mainGameCreation();
				} else {
					if (self.focus) {
						self.blur = true;
						self.focus = false;

						if (blur) {
							self.execute_extensions(this.FOCUS);
							self.execute(this.FOCUS);

							blur = false;
						}
					}
				}

				return oldFocus;
			}

			this.blur = onBlur;
			this.focus = onFocus;

			window.addEventListener("blur", onBlur);
			window.addEventListener("focus", onFocus);

			if (document.hasFocus()) {
				mainGameCreation();

				var now;

				mainLoop = function() {
					now = Date.now();
					this.delta = (now - self.lastUpdate) / 1000;
					self.lastUpdate = now;

					self.execute_extensions(this.UPDATE);
					self.execute(this.UPDATE);

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

	Object.defineProperty(Game.prototype, "CREATE", { get: function() { return 'create'; } });
	Object.defineProperty(Game.prototype, "UPDATE", { get: function() { return 'update'; } });
	Object.defineProperty(Game.prototype, "FOCUS", { get: function() { return 'focus'; } });
	Object.defineProperty(Game.prototype, "BLUR", { get: function() { return 'blur'; } });

	var game = new Game();

	game.extensions = {
		game.CREATE: [],
		game.UPDATE: [],
		game.BLUR: [],
		game.FOCUS: []
	};

	return new Game();
});