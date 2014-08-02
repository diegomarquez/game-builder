/**
 * # viewports.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of: 
 * [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html)
 * [error-printer](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/debug/error-printer.html)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module serves as a container for all the [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html) objects created.
 */

/**
 * Viewport management
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["viewport", "error-printer"], function(Viewport, ErrorPrinter) {

	var viewports = {};
	
	var ViewportContainer = function() {};

	/**
	 * <p style='color:#AD071D'><strong>add</strong></p>
	 *
	 * Creates a new [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html) and adds it to the container.
	 * 
	 * @param {String} name    Id of the new [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html)
	 * @param {Number} width   Width of the new [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html)
	 * @param {Number} height  Hidth of the new [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html)
	 * @param {Number} offsetX X offset relative to the top corner of the screen
	 * @param {Number} offsetY Y offset relative to the top corner of the screen
	 *
	 * @return {Object} The newly created [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html)
	 */
	ViewportContainer.prototype.add = function(name, width, height, offsetX, offsetY) {		
		viewports[name] = new Viewport(width, height, offsetX, offsetY);
		return viewports[name];
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>show</strong></p>
	 *
	 * Makes the specified [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html) visible
	 * 
	 * @param  {String} name Id of the [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html) to make visible
	 *
	 * @throws {Error} If the id specified does not exist
	 */
	ViewportContainer.prototype.show = function(name) {
		if (!viewports[name]) {
			ErrorPrinter.printError('Viewports', 'Viewport with id:' + name + ' does not exist.');
		}

		viewports[name].show();
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>hide</strong></p>
	 *
	 * Makes the specified [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html) invisible
	 * 
	 * @param  {String} name Id of the [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html) to make invisible
	 *
	 * @throws {Error} If the id specified does not exist
	 */
	ViewportContainer.prototype.hide = function(name) { 
		if (!viewports[name]) {
			ErrorPrinter.printError('Viewports', 'Viewport with id:' + name + ' does not exist.');
		}

		viewports[name].hide();
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>get</strong></p>
	 * 
	 * Get a reference to the specified [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html)
	 * 
	 * @param  {String} name Id of the [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html) to get
	 *
	 * @throws {Error} If the id specified does not exist
	 */
	ViewportContainer.prototype.get = function(name) { 
		if (!viewports[name]) {
			ErrorPrinter.printError('Viewports', 'Viewport with id:' + name + ' does not exist.');
		}

		return viewports[name]; 
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>all</strong></p>
	 *
	 * Get a reference to the underlaying object containing all the created [viewports](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewports.html)
	 */
	ViewportContainer.prototype.all = function() { 
		return viewports; 
	};
	/**
	 * --------------------------------
	 */

	return new ViewportContainer();
});