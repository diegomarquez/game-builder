/**
 * # extension.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [class](@@class@@)
 *
 * Depends of:
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module only exists to make the interface for an extension explicit.
 *
 * Extensions works with [game](@@game@@). They provide functionality that is common enough
 * to be executed by [game](@@game@@), but not so common to make it part of the core
 * of [Game-Builder](http://diegomarquez.github.io/game-builder).
 *
 * Extensions can be hooked into 4 parts of [game](@@game@@):
 *
 * ### **INITIALIZATION**
 * These extensions return the string **'create'** for their type.
 * They are executed once on the initialization of the application or if the application
 * has already started, get executed once as soon as they are added to [game](@@game@@)
 *
 * ### **FOCUS**
 * These extensions return the string **'focus'** for their type.
 * They are executed each time the application gains focus.
 *
 * ### **BLUR**
 * These extensions return the string **'blur'** for their type.
 * They are executed each time the application looses focus.
 *
 * ### **UPDATE**
 * These extensions return the string **'update'** for their type.
 * They are executed on the main update loop.
 */

/**
 * Extend functionality of [game](@@game@@)
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
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>execute</strong></p>
		 *
		 * This is whatever the extensions should do. This is an abstract method and must be overriden.
		 *
		 * @throws {Error} Always
		 */
		execute: function() {
			ErrorPrinter.mustOverrideError('Extension');
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>destroy</strong></p>
		 *
		 * This method is called when the extension is removed. This is an abstract method and must be overriden.
		 *
		 * This method should undo any changes that the extension introduced. Setting up event listeners, defining methods, etc.
		 *
		 * @throws {Error} Always
		 */
		destroy: function() {
			ErrorPrinter.mustOverrideError('Extension');
		}
		/**
		 * --------------------------------
		 */
	});

	return Extension;
});
