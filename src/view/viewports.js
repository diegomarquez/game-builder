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

	ViewportContainer.prototype.add = function(name, width, height, offsetX, offsetY) {		
		viewports[name] = new Viewport(width, height, offsetX, offsetY);
		return viewports[name];
	};

	ViewportContainer.prototype.show = function(name) {
		if (!viewports[name]) {
			ErrorPrinter.printError('Viewports', 'Viewport with id:' + name + ' does not exist.');
		}

		viewports[name].show();
	};

	ViewportContainer.prototype.hide = function(name) { 
		if (!viewports[name]) {
			ErrorPrinter.printError('Viewports', 'Viewport with id:' + name + ' does not exist.');
		}

		viewports[name].hide();
	};
	
	ViewportContainer.prototype.get = function(name) { 
		if (!viewports[name]) {
			ErrorPrinter.printError('Viewports', 'Viewport with id:' + name + ' does not exist.');
		}

		return viewports[name]; 
	};

	ViewportContainer.prototype.all = function() { 
		return viewports; 
	};

	return new ViewportContainer();
});