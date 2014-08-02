/**
 * # input-bundle.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [bundle](@@bundle@@)
 *
 * Depends of:
 * [basic-game-object](file://localhost/Users/johndoe/game-builder-gh-pages/examples-docs/common_src/basic-game-object.html)
 * [box-renderer](file://localhost/Users/johndoe/game-builder-gh-pages/examples-docs/common_src/box-renderer.html)
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
	var box_renderer = require('box-renderer');
	
	var gb = require('gb');

	var CollidersBundle = require('bundle').extend({
		create: function() {
			this.componentPool.createPool("box-renderer", box_renderer);
			
			this.componentPool.createConfiguration("Small_box", 'box-renderer')
				.args({
					offsetX: -10, 
					offsetY: -10, 
					width: 20, 
					height: 20
				});

			this.gameObjectPool.createPool("Base", basic_game_object, 20);
			
			this.gameObjectPool.createConfiguration("Base_2", "Base")
				.args({x: 200, y: 200, rotation_speed: 2})
				.setRenderer('Small_box');
		}
	});

	return new CollidersBundle();
});
	