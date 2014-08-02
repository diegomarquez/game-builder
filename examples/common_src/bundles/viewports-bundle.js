/**
 * # input-bundle.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [bundle](@@bundle@@)
 *
 * Depends of:
 * [game-object](@@game-object@@)
 * [path-renderer](@@path-renderer@@)
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
	var path_renderer = require('path-renderer');

	var viewports = require('viewports');

	var CollidersBundle = require('bundle').extend({
		create: function() {
			this.componentPool.createPool("path-renderer", path_renderer);
			
			this.componentPool.createConfiguration("Large_box", 'path-renderer')
				.args({
					skipCache: true, 
					width: viewports.get('Main').width,
					height: viewports.get('Main').height,
					drawPath: function(context) {
						context.save();

						context.beginPath();
	        			context.rect(0, 0, this.width, this.height);
		        		context.lineWidth = 10;
		        		context.strokeStyle = "#FFFFFF";
		        		context.stroke();        	
						context.closePath();
						
						context.restore();
					}
				});

			this.gameObjectPool.createPool("FrameBase", game_object, 1);
			
			this.gameObjectPool.createConfiguration("Frame", "FrameBase")
				.args({x: 0, y: 0})
				.setRenderer('Large_box');
		}
	});

	return new CollidersBundle();
});
	