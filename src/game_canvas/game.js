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
 * This module defines the object which is responsible for the main update loop of the application.
 *
 * It does so by using [request animation frame](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)
 *
 * It also hooks into the focus and blur events of [window](http://www.w3schools.com/jsref/obj_window.asp), 
 * in order to be able to pause and resume the application if needed.
 *
 * It's main behaviour can be extended by the use of [extensions](@@extension@@)
 *
 * ### Game extends [delegate](@@delegate@@) so it provides a few events to hook into:
 *
 * ### **create** 
 * On application startup 
 * 
 * ``` javascript  
 * game.on(game.CREATE, function(repeatsLeft) {});
 * ``` 
 *
 * ### **blur**
 * When the application looses focus 
 * 
 * ``` javascript  
 * game.on(game.BLUR, function() {});
 * ```
 *
 * ### **focus**
 * When the application gains focus
 * 
 * ``` javascript  
 * game.on(game.FOCUS, function() {});
 * ```
 *
 * ### **update**
 * On each update cycle
 *
 * The delta time between update cycles is sent to registered callbacks
 * ``` javascript  
 * game.on(game.UPDATE, function(delta) {});
 * ```
 */

/**
 * Main Update loop
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate"], function(Delegate) {
	var Game = Delegate.extend({
		init: function() {
			this._super();

			this.focus = true;
			this.blur = true;
			this.initialized = false;
			this.lastUpdate = Date.now();
			this.delta = null;

			// A reference to the main div in the corresponding index.html file
			this.mainContainer = null;
			// A reference to the canvas
			this.canvas = null;
			// A reference to the context of the canvas
			this.context = null;			
		},

		/**
		 * <p style='color:#AD071D'><strong>execute_extensions</strong></p>
		 *
		 * Executes all the extensions for the given state of the application
		 * 
		 * @param  {String} state The state of the application. ej. 'create'
		 */
		execute_extensions: function(state) {
			for(var i=0; i<this.extensions[state].length; i++){
				this.extensions[state][i].execute();
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>add_extension</strong></p>
		 *
		 * Use this to add extensions.
		 * 
		 * @param {[extension](@@extension@@)} extensionMoudle A module that extends [extension](@@extension@@)
		 */
		add_extension: function(extensionMoudle) {
			var ex = new extensionMoudle();
			this.extensions[ex.type()].push(ex);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>create</strong> The main method that will kick start everything.</p>
		 *
		 * This method does a bunch of things. The main one being setting up the update loop
		 * using [request animation frame](http://www.paulirish.com/2011/requestanimationframe-for-smart-animating/)
		 *
		 * The focus and blur events are also setup here.
		 *
		 * If the application does not have focus as soon as it starts, it waits until it has focus 
		 * to setup the update loop.
		 * 
		 * @param  {ElementObject} mainContainer The Dom element that contains the canvas
		 * @param  {Canvas} canvas The canvas
		 *
		 */
		create: function(mainContainer, canvas) {
			this.mainContainer = mainContainer;
			this.canvas = canvas;
			this.context = this.canvas.getContext("2d");

			var mainLoop;
			var self = this;

			// When this is called the application has trully started.
			var setupUpdateLoop = function() {
				self.initialized = true;
				self.execute_extensions(this.CREATE);
				self.execute(this.CREATE);

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
			};

			// The blur and focus event callbacks
			// Plus additional logic so that they don't get executed
			// more than needed. 
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
					setupUpdateLoop();
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

			// References to the blur and focus callbacks
			// The [pause](@@pause@@) and [resume](@@resume@@)
			// extensions use these.
			this.blur = onBlur;
			this.focus = onFocus;

			// Actually setting up the listener to the events 
			// window dispatches.
			window.addEventListener("blur", onBlur);
			window.addEventListener("focus", onFocus);

			// Making sure we have focus setting up the update loop.
			// If there is no focus, wait until it is gained to setup the update loop.
			if (document.hasFocus()) {
				setupUpdateLoop();
			}
		}
		/**
		 * --------------------------------
		 */
	});

	// ### Getters for all the types of events game can hook into
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