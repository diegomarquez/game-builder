/**
 * # viewport.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [game-object-container](@@game-object-container@@)
 *
 * Inherits from:
 * [delegate](@@delegate@@) 
 * 
 * Depends of:
 * [layer](@@layer@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines a viewport, it has an offset in relation to the top left of the screen, a width and height, and the position
 * of the world it is viewing. It is a rectangle.
 *
 * Aside from that it holds an array of [layer](@@layer@@) objects each with the [game-objetcs](@@game-objetc@@) that this 
 * viewport should draw.
 */

/**
 * A little window
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate", "layer", "error-printer"], function(Delegate, Layer, ErrorPrinter){
	var Viewport = Delegate.extend({
		init: function(width, height, offsetX, offsetY) {
			this.x = 0;
			this.y = 0;

			this.scaleX = 1;
			this.scaleY = 1;

			this.offsetX = offsetX;
			this.offsetY = offsetY;

			this.width = width;
			this.height = height;

			this.layers = [];
		},

		setStroke: function(width, color) {
			this.strokeWidth = width;
			this.strokeColor = color;
		},

		addLayer: function(name) {
			var layer = new Layer();
			layer.name = name;

			this.layers.push(layer);

			return layer;
		},

		removeLayer: function(name) {
			for (var i = 0; i < this.layers.length; i++) {
				if (this.layers[i].name == name) {
					this.layers.splice(i, 1);
					return;
				}
			}

			ErrorPrinter.printError('Viewport', 'Layer with id:' + name + ' does not exist.');
		},

		removeAllLayers: function() {
			var layer;

			for (var i = 0; i < this.layers.length; i++) {
				layer = this.layers.pop();
				layer.removeAll();
			}
		},

		addGameObject: function(layerName, go) {
			var layer = findLayer.call(this, layerName);
			
			layer.add(go);

			go.on(go.RECYCLE, this, function(g) { 
				layer.remove(g); 
			});
		},

		removeAllGameObjects: function() {
			for (var i = 0; i < this.layers.length; i++) {
				this.layers[i].removeAll();
			}
		},

		draw: function(context) {
			for (var i = 0; i < this.layers.length; i++) {
				this.layers[i].draw(context, this.x, this.y, this.offsetX, this.offsetY, this.width, this.height);
			}
		},

		show: function() {
			for (var i = 0; i < this.layers.length; i++) {
				this.layers[i].show();
			}
		},

		hide: function() {
			for (var i = 0; i < this.layers.length; i++) {
				this.layers[i].hide();
			}
		},

		showLayer: function(name) {
			findLayer.call(this, name).show();
		},

		hideLayer: function(name) {
			findLayer.call(this, name).hide();
		}
	});

	var findLayer = function(name) {
		for (var i = 0; i < this.layers.length; i++) {
			if (this.layers[i].name == name) {
				return this.layers[i];
			}
		}

		ErrorPrinter.printError('Viewport', 'Layer with id:' + name + ' does not exist.');
	}

	return Viewport;
});