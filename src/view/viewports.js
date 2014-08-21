/**
 * # viewports.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of: 
 * [viewport](@@viewport@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module serves as a container for all the [viewport](@@viewport@@) objects created.
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
	var viewportsArray = [];
	
	var ViewportContainer = function() {};

	/**
	 * <p style='color:#AD071D'><strong>add</strong></p>
	 *
	 * Creates a new [viewport](@@viewport@@) and adds it to the container.
	 * 
	 * @param {String} name    Id of the new [viewport](@@viewport@@)
	 * @param {Number} width   Width of the new [viewport](@@viewport@@)
	 * @param {Number} height  Height of the new [viewport](@@viewport@@)
	 * @param {Number} offsetX X offset relative to the top corner of the screen
	 * @param {Number} offsetY Y offset relative to the top corner of the screen
	 *
	 * @return {Object} The newly created [viewport](@@viewport@@)
	 */
	ViewportContainer.prototype.add = function(name, width, height, offsetX, offsetY) {		
		if (!viewports[name]) {
			viewports[name] = new Viewport(name, width, height, offsetX, offsetY);
			
			viewportsArray.push(viewports[name]);
			
			return viewports[name];
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>show</strong></p>
	 *
	 * Makes the specified [viewport](@@viewport@@) visible
	 * 
	 * @param  {String} name Id of the [viewport](@@viewport@@) to make visible
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
	 * Makes the specified [viewport](@@viewport@@) invisible
	 * 
	 * @param  {String} name Id of the [viewport](@@viewport@@) to make invisible
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
	 * Get a reference to the specified [viewport](@@viewport@@)
	 * 
	 * @param  {String} name Id of the [viewport](@@viewport@@) to get
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
	 * Get a reference to an object containing all the created [viewports](@@viewport@@)
	 */
	ViewportContainer.prototype.all = function() { 
		return viewports; 
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>allAsArray</strong></p>
	 *
	 * A reference to an array containing all the created [viewports](@@viewport@@)
	 */
	ViewportContainer.prototype.allAsArray = function() { 
		return viewportsArray; 
	};
	/**
	 * --------------------------------
	 */

	return new ViewportContainer();
});