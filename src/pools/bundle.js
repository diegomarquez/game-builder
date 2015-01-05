/**
 * # bundle.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [class](@@class@@)
 *
 * Depends of: 
 * [gb](@@gb@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This is a helper module to define a block of [game-object-pool](@@game-object-pool@@) and 
 * [component-pool](@@component-pool@@) configurations. 
 *
 * The basic workflow is extending this module, and putting all the required code
 * to configure the pools in there. That way you can reuse that code in different places.
 *
 * It's not really needed but it will make things a bit more tidy.
 * Because it has [gb](@@gb@@) as a dependency it already has references to the pools
 * and the canvas, so you don't have to require those in the modules extending this one.
 */

/**
 * Bundle up!
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require) {
	var Bundle = require('class').extend({
		init: function() {
			var gb = require('gb');
			
			this.gameObjectPool = gb.goPool;
			this.componentPool 	= gb.coPool;
			this.canvas 		= gb.canvas;
			this.assetMap       = gb.assetMap();
		},

		/**
		 * <p style='color:#AD071D'><strong>create</strong></p>
		 *
		 * Modules extending this one should implement this method.
		 *
		 * @throws {Error} If it is not overriden
		 * @param  {Object} [args=null] 
		 */
		create: function(args) {
			require('error-printer').mustOverrideError('Bundle');
		}
		/**
		 * --------------------------------
		 */
	});

	return Bundle;
});