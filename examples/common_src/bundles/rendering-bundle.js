/**
 * # rendering-bundle.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [bundle](@@bundle@@)
 *
 * Depends of:
 * [basic-game-object](http://localhost:5000/examples-docs/common_src/basic-game-object.html)
 * [box-renderer](http://localhost:5000/examples-docs/common_src/box-renderer.html)
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
	var game_object = require('game-object');
	var basic_game_object = require('basic-game-object');
	var bitmap_renderer = require('bitmap-renderer');
	var path_renderer = require('path-renderer');
	var text_renderer = require('text-renderer');

	var RenderingBundle = require('bundle').extend({
		create: function() {
			this.componentPool.createPool("Bitmap_Renderer", bitmap_renderer);
			this.componentPool.createPool("Path_Renderer", path_renderer);
			this.componentPool.createPool("Text_Renderer", text_renderer);

			this.componentPool.createConfiguration("Pear_1", 'Bitmap_Renderer').args({ offset:'center', path: this.assetMap['80343865.JPG']});
			this.componentPool.createConfiguration("Pear_2", 'Bitmap_Renderer').args({ path: this.assetMap['80343865.JPG']});
			
			this.componentPool.createConfiguration("Path_1", 'Path_Renderer').args({ 
				name: 'Path',
				width: 10,
				height: 10,
				offset:'center',
				drawPath: function(context) {
					context.fillStyle = "#FF0000";
					context.fillRect(0, 0, 10, 10);
				}
			});

			this.componentPool.createConfiguration("Text_1", 'Text_Renderer').args({ 
				name: 'SomeText_1',
				font: 'Gafata',
				size: 20,
				fillColor: '#FF0000',
				strokeColor: '#FF0000',
				text: 'Default Text 1',
				backgroundColor: '#000000'
			});

			this.componentPool.createConfiguration("Text_2", 'Text_Renderer').args({ 
				name: 'SomeText_2',
				font: 'Audiowide',
				size: 20,
				fillColor: '#00FF00',
				strokeColor: '#00FF00',
				text: 'Default Text 2'
			});

			this.componentPool.createConfiguration("Text_3", 'Text_Renderer').args({ 
				name: 'SomeText_3',
				font: 'Miltonian Tattoo',
				size: 20,
				fillColor: '#0000FF',
				strokeColor: '#0000FF',
				text: 'Default Text 3'
			});


			this.gameObjectPool.createPool("Base", basic_game_object, 4);
			this.gameObjectPool.createPool("Text", game_object, 3); 

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

			this.gameObjectPool.createConfiguration("Base_4", "Base")
				.args({x: this.canvas.width/2, y: this.canvas.height/2, rotation_speed: 3})
				.setRenderer('Path_1');

			this.gameObjectPool.createConfiguration("Text_1", "Text")
				.args({x: 20, y: 20})
				.setRenderer('Text_1');

			this.gameObjectPool.createConfiguration("Text_2", "Text")
				.args({x: 20, y: 40})
				.setRenderer('Text_2');

			this.gameObjectPool.createConfiguration("Text_3", "Text")
				.args({x: 20, y: 60})
				.setRenderer('Text_3');
		}
	});

	return new RenderingBundle();
});
		