/**
 * # keyboard.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [delegate](@@delegate@@)
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines to interact with the keyboard. In similar fashion to [timer-factory](@@timer-factory@@),
 * this module extends on existing behaviour to make it less annoying.
 */

/**
 * The Keyboard
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require) {
	var pressed = {};

	var Keyboard = require('delegate').extend({
		init: function() {
			this._super();

			// ### Defined keyboard constants
			
			// Not all the keys of the keyboard,
			// but they should be more than enough
			// for a [Game-Builder](http://diegomarquez.github.io/game-builder)
			// project

			this.LEFT = 37;
			this.UP = 38;
			this.RIGHT = 39;
			this.DOWN = 40;

			this.CTRL = 17;
			this.ALT = 18;
			this.ESC = 27;
			this.SPACE = 32;

			this.A = 65;
			this.S = 83;
			this.D = 68;
			this.Z = 90;
			this.X = 88;
			this.C = 67;

			this.P = 80;
			this.O = 79;
			this.I = 73;

			this.NUM_0 = 48;
			this.NUM_1 = 49;
			this.NUM_2 = 50;
			this.NUM_3 = 51;
			this.NUM_4 = 52;
			this.NUM_5 = 53;

			// These constants are pretty usefull
			// to avoid having undescriptive names littered around the code.
			// These should make pretty clear what you are trying to do, when you
			// use them. Plus it's easy to change them later down the road. 
			this.GAME_LEFT = this.LEFT;
			this.GAME_RIGHT = this.RIGHT;
			this.GAME_UP = this.UP;
			this.GAME_DOWN = this.DOWN;
			this.GAME_BUTTON_1 = this.A;
			this.GAME_BUTTON_2 = this.S;
			this.GAME_BUTTON_PAUSE = this.P;
		},

		/**
		 * <p style='color:#AD071D'><strong>onKeyDown</strong></p>
		 *
		 * Register a callback to be executed when a key is pressed.
		 *
		 * This wraps the extended [delegate](@@delegate@@)
		 * 
		 * @param  {Number}   keyCode  Key code to listen to
		 * @param  {Object}   scope    Scope of the callback function
		 * @param  {Function} callback The callback function
		 */
		onKeyDown: function(keyCode, scope, callback) {
			this.on('keydown' + keyCode.toString(), scope, callback);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>onKeyUp</strong></p>
		 *
		 * Register a callback to be executed when a key is released.
		 *
		 * This wraps the extended [delegate](@@delegate@@)
		 * 
		 * @param  {Number}   keyCode  Key code to listen to
		 * @param  {Object}   scope    Scope of the callback function
		 * @param  {Function} callback The callback function
		 */
		onKeyUp: function(keyCode, scope, callback) {
			this.on('keyup' + keyCode.toString(), scope, callback);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeKeyDown</strong></p>
		 *
		 * Removes a registered callback for a key press.
		 *
		 * This wraps the extended [delegate](@@delegate@@)
		 * 
		 * @param  {Number}   keyCode  Key code to stop listening to
		 * @param  {Object}   scope    Scope of the callback function to remove
		 * @param  {Function} callback The callback function to remove
		 */
		removeKeyDown: function(keyCode, scope, callback) {
			this.remove('keydown' + keyCode.toString(), scope, callback);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeKeyUp</strong></p>
		 *
		 * Removes a registered callback for a key release.
		 *
		 * This wraps the extended [delegate](@@delegate@@)
		 * 
		 * @param  {Number}   keyCode  Key code to stop listening to
		 * @param  {Object}   scope    Scope of the callback function to remove
		 * @param  {Function} callback The callback function to remove
		 */
		removeKeyUp: function(keyCode, scope, callback) {
			this.remove('keyup' + keyCode.toString(), scope, callback);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>isKeyDown</strong></p>
		 *
		 * This method is meant to be used in an update loop. It returns
		 * true of the specified key is pressed, false otherwise.
		 * 
		 * @param  {Number}  keyCode Key to test for a press
		 *
		 * @return {Boolean} True if key is pressed, false otherwise.
		 */
		isKeyDown: function(keyCode) {
			return pressed[keyCode];	
		}
		/**
		 * --------------------------------
		 */
	});

	var keyboard = new Keyboard();

	// ### Actual registering with the windown keyboard events.
	window.addEventListener('keyup', function(event) {
		delete pressed[event.keyCode];

		keyboard.execute('keyup' + event.keyCode.toString(), event);
	}, false);

	window.addEventListener('keydown', function(event){
		if(pressed[event.keyCode]) return;

		pressed[event.keyCode] = true;
		keyboard.execute('keydown' + event.keyCode.toString(), event);
	}, false);
	/**
	 * --------------------------------
	 */

	// ### Prevent default behaviour of keys in the browser
	document.onkeydown = function(event) {
		if (event.keyCode == keyboard.LEFT ||
			event.keyCode == keyboard.UP ||
			event.keyCode == keyboard.RIGHT ||
			event.keyCode == keyboard.DOWN ||
			event.keyCode == keyboard.CTRL ||
			event.keyCode == keyboard.ALT ||
			event.keyCode == keyboard.ESC ||
			event.keyCode == keyboard.SPACE ||
			event.keyCode == keyboard.A ||
			event.keyCode == keyboard.S ||
			event.keyCode == keyboard.D ||
			event.keyCode == keyboard.Z ||
			event.keyCode == keyboard.X ||
			event.keyCode == keyboard.C ||
			event.keyCode == keyboard.NUM_0 ||
			event.keyCode == keyboard.NUM_1 ||
			event.keyCode == keyboard.NUM_2 ||
			event.keyCode == keyboard.NUM_3 ||
			event.keyCode == keyboard.NUM_4 ||
			event.keyCode == keyboard.NUM_5) {
			event.preventDefault();
		}
	}

	document.onkeypress = function(event) {
		if (event.keyCode == keyboard.LEFT ||
			event.keyCode == keyboard.UP ||
			event.keyCode == keyboard.RIGHT ||
			event.keyCode == keyboard.DOWN ||
			event.keyCode == keyboard.CTRL ||
			event.keyCode == keyboard.ALT ||
			event.keyCode == keyboard.ESC ||
			event.keyCode == keyboard.SPACE ||
			event.keyCode == keyboard.A ||
			event.keyCode == keyboard.S ||
			event.keyCode == keyboard.D ||
			event.keyCode == keyboard.Z ||
			event.keyCode == keyboard.X ||
			event.keyCode == keyboard.C ||
			event.keyCode == keyboard.NUM_0 ||
			event.keyCode == keyboard.NUM_1 ||
			event.keyCode == keyboard.NUM_2 ||
			event.keyCode == keyboard.NUM_3 ||
			event.keyCode == keyboard.NUM_4 ||
			event.keyCode == keyboard.NUM_5) {
			event.preventDefault();
		}
	}

	return keyboard;
});