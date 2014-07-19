/**
 * # root.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [game-object-container](@@game-object-container@@)
 *
 * Depends of:
 * [viewports](@@viewports@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines the root [game-object-container](@@game-object-container@@)
 *
 * In any given [Game-Builder](http://diegomarquez.github.io/game-builder) application
 * this is is the only [game-object-container](@@game-object-container@@) that is updated
 * explicitly in the main update loop. As it is updated and rendered, it will update and render all of its 
 * children, who will in turn update and render their children, until everything has been updated
 * and renderered.
 *
 * If you where wondering, this is where the screen is cleared before each update cycle. 
 * It is possible to manipulate this object as any other [game-object](@@game-object@@), 
 * but that is probably not a good idea :P
 *
 * Asides from that, there isn't anything else noteworthy about this module, inspite of being at the
 * very begenning of the hierarchical structure.
 */

/**
 * The root of all things
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["game-object-container", "viewports"], function(Container, Viewports){
	var Root = Container.extend({

		init: function() {
			this._super();
			this.allViewports = Viewports.all();
		},

		/**
		 * <p style='color:#AD071D'><strong>transformAndDraw</strong></p>
		 *
		 * Clears the screen, and then proceeds to update and render all of
		 * it's children, which will in turn do the same for their children.
		 *
		 * The transformations needed to view a specific part of the world are applied here
		 * 
		 * @param  {Context 2D} context [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
		 */
		draw: function(context) {
			for (var k in this.allViewports) {
				// Reset context transformation
				context.setTransform(1, 0, 0, 1, 0, 0);
				
				var v = this.allViewports[k];

				// Set the clipping area
				context.beginPath();
	        	context.rect(v.offsetX, v.offsetY, v.width, v.height);
	        	
	        	if (v.strokeWidth || v.strokeColor) {
	        		context.lineWidth = v.strokeWidth;
	        		context.strokeStyle = v.strokeColor;
	        		context.stroke();
	        	}
	        	 	        	
	        	context.clip();
				context.closePath();

				// Clear the viewport drawing area
				context.clearRect(v.offsetX, v.offsetY, v.width, v.height);

				// Move to the area that will be drawn
	    		context.translate(v.x, v.y);
	    		context.scale(v.scaleX, v.scaleY);
				
	    		v.draw(context, v.x, v.y, v.offsetX, v.offsetY, v.width, v.height);
			}
		}
	});

	return new Root();
});