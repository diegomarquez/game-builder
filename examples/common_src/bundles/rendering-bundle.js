/**
 * # rendering-bundle.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [bundle](@@bundle@@)
 *
 * Depends of:
 * [basic-game-object](http://diegomarquez.github.io/game-builder/examples-docs/common_src/basic-game-object.html)
 * [box-renderer](http://diegomarquez.github.io/game-builder/examples-docs/common_src/box-renderer.html)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This is an example on how to encapsulate the logic needed to setup the [game-object-pool](@@game-object-pool@@)
 * and the [component-pool](@@component-pool@@)
 */

/**
 * --------------------------------
 */
define(function(require) {
	var basic_game_object = require('basic-game-object');
	var bitmap_renderer = require('bitmap-renderer');

	var RenderingBundle = require('bundle').extend({
		create: function() {
			this.componentPool.createPool("Bitmap_Renderer", bitmap_renderer);

			this.componentPool.createConfiguration("Pear_1", 'Bitmap_Renderer').args({ offset:'center', path: '../common_assets/images/80343865.jpg'});
			this.componentPool.createConfiguration("Pear_2", 'Bitmap_Renderer').args({ path:'../common_assets/images/80343865.jpg'});

			this.gameObjectPool.createPool("Base", basic_game_object, 3); 

			this.gameObjectPool.createConfiguration("Base_1", "Base")
				.args({x: this.canvas.width/2 - 100, y: this.canvas.height/2, rotation_speed: -2, scaleX: 2})
				.setRenderer('Pear_1');

			this.gameObjectPool.createConfiguration("Base_2", "Base")
				.args({x: this.canvas.width/2 + 100, y: this.canvas.height/2, rotation_speed: 2})
				.setRenderer('Pear_2');

			this.gameObjectPool.createConfiguration("Base_3", "Base")
				.args({x: this.canvas.width/2, y: this.canvas.height/2 + 100, rotation_speed: 1})
				// BONUS: you can override the configuration of a component/renderer or just add additional parameters.
				// The object after the ID will be merged with the one set through createConfiguration
				.setRenderer('Pear_1', { width: 20, height: 20 });
		}
	});

	return new RenderingBundle();
});
		