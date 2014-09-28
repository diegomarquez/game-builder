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
 * This module defines to interact with the keyboard. 
 * In similar fashion to [timer-factory](@@timer-factory@@),
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

	var blocked = false;
	var whiteListedKeys = null;

	var Keyboard = require('delegate').extend({
		init: function() {
			this._super();

			// ### Defined keycodes
			
			// Not all the keys of the keyboard but they should be more than enough
			// for a [Game-Builder](http://diegomarquez.github.io/game-builder) project

			this.LEFT = 37;
			this.UP = 38;
			this.RIGHT = 39;
			this.DOWN = 40;

			this.CTRL = 17;
			this.ALT = 18;
			this.ESC = 27;
			this.SPACE = 32;

			this.W = 87;
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

			// These variables are pretty usefull
			// to avoid having undescriptive names littered around the code.
			// These should make pretty clear what you are trying to do when you
			// use them. Plus it's easy to change them later down the road. 
			this.GAME_LEFT = this.LEFT;
			this.GAME_RIGHT = this.RIGHT;
			this.GAME_UP = this.UP;
			this.GAME_DOWN = this.DOWN;
			this.GAME_BUTTON_1 = this.A;
			this.GAME_BUTTON_2 = this.S;
			this.GAME_BUTTON_PAUSE = this.P;

			// And array with the keys that should avoid the default browser behaviour when they are pressed
			this.skipDefaultBehaviour = [];
		},

		/**
		 * <p style='color:#AD071D'><strong>config</strong></p>
		 *
		 * @param  {Object} options An object with various configuration options
		 */
		config: function(options) {
			if (options.gameKeys) {
				for (var k in options.gameKeys) {
					this[k] = options.gameKeys[k];		
				}
			}

			if (options.skipDefaultBehaviour) {
				this.skipDefaultBehaviour = options.skipDefaultBehaviour;
			}
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
		 * true if the specified key is pressed, false otherwise.
		 * 
		 * @param  {Number}  keyCode Key to test for a press
		 *
		 * @return {Boolean} True if key is pressed, false otherwise.
		 */
		isKeyDown: function(keyCode) {
			return pressed[keyCode];	
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>setBlock</strong></p>
		 *
		 * @param {Boolean} value   The state of the the block, can be true or false
		 * @param {Array=null} whiteList Keys that should not be blocked
		 */
		setBlock: function(value, whiteList) {
			blocked = value; 
			whiteListedKeys = whiteList || null;
		}
	});

	var keyboard = new Keyboard();

	var preventKeyboardEvent = function(keyCode) {
		if (blocked) {
			if(whiteListedKeys) {
				if(whiteListedKeys.indexOf(keyCode) == -1) {
					return true;
				}
			} else {
				return true;
			}
		}

		return false;
	}

	// ### Actual registering with the windown keyboard events.
	window.addEventListener('keyup', function(event) {
		delete pressed[event.keyCode];

		if(preventKeyboardEvent(event.keyCode)) return; 
		
		keyboard.execute('keyup' + event.keyCode.toString(), event);
	}, false);

	window.addEventListener('keydown', function(event){
		if(pressed[event.keyCode]) return;

		if(preventKeyboardEvent(event.keyCode)) return;

		pressed[event.keyCode] = true;
		keyboard.execute('keydown' + event.keyCode.toString(), event);
	}, false);
	/**
	 * --------------------------------
	 */

	// ### Prevent default behaviour of keys in the browser
	document.onkeydown = function(event) {
		if (keyboard.skipDefaultBehaviour.indexOf(event.keyCode) != -1) {
			event.preventDefault();
		}
	}

	document.onkeypress = function(event) {
		if (keyboard.skipDefaultBehaviour.indexOf(event.keyCode) != -1) {
			event.preventDefault();
		}
	}

	return keyboard;
});