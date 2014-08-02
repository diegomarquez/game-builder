/**
 * # world.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [class](@@class@@)
 *
 * Depends of: 
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module serves as an abstraction for the rectangle that defines the 2D world of the game. Useful to
 * have those values available to everyone, instead of hardcoded some where.
 */

/**
 * Game World
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["class"], function(Class) {
	var World = Class.extend({
		init: function() {},

		create: function(w, h) {
			var width = w;
			var height = h;

			this.getWidth = function() { 
				return width; 
			};
			
			this.getHeight = function() { 
				return height; 
			};

			this.setWidth = function(v) { 
				width = v; 
			};
			
			this.setHeight = function(v) { 
				height = v; 
			};
		},

		scaleViewportToFit: function(viewport) {
			viewport.scaleX = 1;
			viewport.scaleY = 1;

			viewport.scaleX /= this.getWidth() / viewport.width;
			viewport.scaleY /= this.getHeight() / viewport.height;
		},

		scaleViewportProportionaly: function(viewport, factor) {
			viewport.scaleX = 1;
			viewport.scaleY = 1;

			viewport.scaleX *= factor;
			viewport.scaleY *= factor;
		}

	});

	return new World();
});