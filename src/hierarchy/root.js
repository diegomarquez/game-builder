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
 * explicitly in the main update loop. As it is updated, it will update all of its 
 * children, who will in turn update their children, until everything has been updated.
 *
 * Rendering is also executed in this module. The code takes care of setting up the context for each
 * registered [viewport](@@viewport@@). In between setups, all the [game-objects](@@game-object@@) for a given
 * [viewport](@@viewport@@) are rendered.
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
		 * <p style='color:#AD071D'><strong>draw</strong></p>
		 *
		 * Performs the rendering of all the [viewports](@@viewport@@) registered in the [viewports](@@viewports@@) object.
		 *
		 * The process includes, clearing the rectangle belonging to each viewport, modifying the context and drawing all
		 * the corresponding [game-objects](@@game-object@@)
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