/**
 * # extension.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [class](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/class.html)
 *
 * Depends of:
 * [error-printer](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/debug/error-printer.html)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module only exists to make the interface for an extension explicit.
 *
 * Extensions works with [game](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/game_canvas/game.html). They provide functionality that is common enough
 * to be executed by [game](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/game_canvas/game.html), but not so common to make it part of the core
 * of [Game-Builder](http://diegomarquez.github.io/game-builder).
 *
 * # Extensions can be hooked into 4 parts of [game](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/game_canvas/game.html):
 * ### Initialization
 * These extensions return the string **'create'** for their type.
 * They are executed once on the initialization of the application
 * 
 * ### Focus
 * These extensions return the string **'focus'** for their type.
 * They are executed each time the application gains focus.
 * 
 * ### Blur
 * These extensions return the string **'blur'** for their type.
 * They are executed each time the application looses focus.
 * 
 * ### Update
 * These extensions return the string **'update'** for their type.
 * They are executed on the main update loop.
 */

/**
 * Extend functionality of [game](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/game_canvas/game.html)
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["class", "error-printer"], function(Class, ErrorPrinter) {
	var Extension = Class.extend({
		/**
		 * <p style='color:#AD071D'><strong>type</strong></p>
		 *
		 * Sets the type of the extensions. This is an abstract method and must be overriden.
		 *
		 * @throws {Error} Always
		 */
		type: function() {
			ErrorPrinter.mustOverrideError('Extension');
		},

		/**
		 * <p style='color:#AD071D'><strong>execute</strong></p>
		 *
		 * This is whatever the extensions should do. This is an abstract method and must be overriden.
		 *
		 * @throws {Error} Always
		 */
		execute: function() {
			ErrorPrinter.mustOverrideError('Extension');
		}
	});

	return Extension;
});