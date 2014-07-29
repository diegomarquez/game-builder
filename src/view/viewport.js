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
	var p = {};
	var r = null;
	var m = null;
	var rOffsetX, rOffsetY, rWidth, rHeight;
	var x, y, w, h;

	var Viewport = Delegate.extend({

		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 *
		 * Constructor
		 * 
		 * @param  {Number} width   Width of the viewport
		 * @param  {Number} height  Height of the viewport
		 * @param  {Number} offsetX X offset relative to the top left corner of the screen
		 * @param  {Number} offsetY Y offset relative to the top left corner of the screen
		 */
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
			this.visible = true;
		},

		/**
		 * <p style='color:#AD071D'><strong>setStroke</strong></p>
		 *
		 * Set the border of the rectangle of the viewport
		 * 
		 * @param {Number} width Line width of the stroke
		 * @param {Number} color Color of the stroke
		 */
		setStroke: function(width, color) {
			this.strokeWidth = width;
			this.strokeColor = color;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>addLayer</strong></p>
		 *
		 * Adds a new [layer](@@layer@@) to the viewport
		 * 
		 * @param {String} name Id of the new [layer](@@layer@@)
		 */
		addLayer: function(name) {
			var layer = new Layer(name, this);
			this.layers.push(layer);
			return layer;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeLayer</strong></p>
		 *
		 * Removes the specified [layer](@@layer@@) from the viewport
		 * 
		 * @param  {String} name Id of the [layer](@@layer@@) to remove
		 *
		 * @throws {Error} If the specified id does not exist
		 */
		removeLayer: function(name) {
			for (var i = 0; i < this.layers.length; i++) {
				if (this.layers[i].name == name) {
					this.layers.splice(i, 1);
					return;
				}
			}

			ErrorPrinter.printError('Viewport', 'Layer with id:' + name + ' does not exist.');
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeAllLayers</strong></p>
		 *
		 * Remove all [layers](@@layer@@) from the viewport
		 */
		removeAllLayers: function() {
			var layer;

			for (var i = 0; i < this.layers.length; i++) {
				layer = this.layers.pop();
				layer.removeAll();
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>addGameObject</strong></p>
		 *
		 * Add a [game-object](@@game-object@@) to the specified [layer](@@layer@@) of the viewport
		 * 
		 * @param {String} layerName Id of the layer to add the [game-object](@@game-object@@) to
		 * @param {Object} go        [game-object](@@game-object@@) to add
		 */
		addGameObject: function(layerName, go) {
			var layer = findLayer.call(this, layerName);
			
			layer.add(go);

			go.on(go.RECYCLE, this, function(g) { 
				layer.remove(g); 
			}, true);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeAllGameObjects</strong></p>
		 *
		 * Remove all [game-objects](@@game-object@@) from the viewport
		 */
		removeAllGameObjects: function() {
			for (var i = 0; i < this.layers.length; i++) {
				this.layers[i].removeAll();
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>draw</strong></p>
		 *
		 * Draw all the [game-objects](@@game-object@@) in the viewport
		 * 
		 * @param  {Context 2D} context [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/) 
		 */
		draw: function(context) {
			if (!this.visible) return;

			for (var i = 0; i < this.layers.length; i++) {
				this.layers[i].draw(context);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>show</strong></p>
		 *
		 * Make all the [layers](@@layer@@) in the viewport visible
		 */
		show: function() {
			this.visible = true;

			for (var i = 0; i < this.layers.length; i++) {
				this.layers[i].show();
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>hide</strong></p>
		 *
		 * Make all the [layers](@@layer@@) in the viewport invisible
		 */
		hide: function() {
			this.visible = false;

			for (var i = 0; i < this.layers.length; i++) {
				this.layers[i].hide();
			}
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>isVisible</strong></p>
		 *
		 * Wether the layer is visible or not
		 *
		 * @return {Boolean}
		 */
		isVisible: function() { 
			return this.visible; 
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>isGameObjectInside</strong></p>
		 *
		 * @param  {Object}  go [game-object](@@game-object@@) to test
		 *
		 * @return {Boolean} Whether the [game-object](@@game-object@@) is in the visible area of the viewport or not
		 */
		isGameObjectInside: function(go, context) {
			if (!go.renderer) return;

			r = go.renderer;
			m = go.matrix;

			rOffsetX = r.rendererOffsetX();
			rOffsetY = r.rendererOffsetY();
			rWidth = r.rendererWidth();
			rHeight = r.rendererHeight();
			x = this.x + this.offsetX;
			y = this.y + this.offsetY;
			w = this.offsetX + this.width;
			h = this.offsetY + this.height;

			// Top Left
			p = m.transformPoint(rOffsetX, rOffsetY, p);
			p.x = (p.x * this.scaleX) + x;
			p.y = (p.y * this.scaleY) + y;

			if ( (p.x > this.offsetX && p.x < w) && (p.y > this.offsetY && p.y < h) ) return true;
			
			// Top Right
			p = m.transformPoint(rOffsetX + rWidth, rOffsetY, p);
			p.x = (p.x * this.scaleX) + x;
			p.y = (p.y * this.scaleY) + y;

			if ( (p.x > this.offsetX && p.x < w) && (p.y > this.offsetY && p.y < h) ) return true;
			
			// Bottom Left
			p = m.transformPoint(rOffsetX, rOffsetY + rHeight, p);
			p.x = (p.x * this.scaleX) + x;
			p.y = (p.y * this.scaleY) + y;

			if ( (p.x > this.offsetX && p.x < w) && (p.y > this.offsetY && p.y < h) ) return true;
			
			// Bottom Right
			p = m.transformPoint(rOffsetX + rWidth, rOffsetY + rHeight, p);
			p.x = (p.x * this.scaleX) + x;
			p.y = (p.y * this.scaleY) + y;

			if ( (p.x > this.offsetX && p.x < w) && (p.y > this.offsetY && p.y < h) ) return true;

			// Reaching this point means the object is outside the viewport's sight
			return false;
		},

		/**
		 * <p style='color:#AD071D'><strong>showLayer</strong></p>
		 *
		 * Makes the specified [layer](@@layer@@) visible
		 * 
		 * @param  {String} name Id of an existing [layer](@@layer@@)
		 */
		showLayer: function(name) {
			findLayer.call(this, name).show();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>hideLayer</strong></p>
		 *
		 * Makes the specified [layer](@@layer@@) invisible
		 * 
		 * @param  {String} name Id of an existing [layer](@@layer@@)
		 */
		hideLayer: function(name) {
			findLayer.call(this, name).hide();
		}
		/**
		 * --------------------------------
		 */
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