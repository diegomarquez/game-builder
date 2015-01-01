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
			this.allViewports = Viewports.allAsArray();

			this.canvas = document.getElementById('game');
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
			// Clear the canvas
			context.clearRect(0, 0, this.canvas.width, this.canvas.height);

			for (var i = 0; i < this.allViewports.length; i++) {
				var v = this.allViewports[i];

				// Skip everything if the viewport is not visible
				if (!v.isVisible()) continue;

				// Save state for current viewport
				context.save();

        if (v.Clipping) {
        	// Set the clipping area
					context.beginPath();

					if (v.strokeWidth) {
						context.rect(v.OffsetX-v.strokeWidth, v.OffsetY-v.strokeWidth, v.Width+v.strokeWidth*2, v.Height+v.strokeWidth*2);
					} else {
						context.rect(v.OffsetX, v.OffsetY, v.Width, v.Height);	
					}

		      context.clip();
					context.closePath();
        }
       
				// Make all the drawings relative to the viewport's visible area
				v.transformContext(context);
				// Draw all the game objects associated with this viewport
	    	v.draw(context);
	    	// Go back to previous state for the next viewport
	    
	    	// This simulates a strokes that grows outwards
        if (v.strokeWidth || v.strokeColor) {
					context.save();
					context.setTransform(1, 0, 0, 1, 0, 0);

					context.fillStyle = v.strokeColor;
	        context.fillRect(v.OffsetX-v.strokeWidth, v.OffsetY-v.strokeWidth, v.Width+(v.strokeWidth*2), v.strokeWidth);
	        context.fillRect(v.OffsetX-v.strokeWidth, v.OffsetY+v.Height, v.Width+(v.strokeWidth*2), v.strokeWidth);
	        context.fillRect(v.OffsetX-v.strokeWidth, v.OffsetY-v.strokeWidth, v.strokeWidth, v.Height+(v.strokeWidth*2));
	        context.fillRect(v.OffsetX+v.Width, v.OffsetY-v.strokeWidth, v.strokeWidth, v.Height+(v.strokeWidth*2));

					context.restore();	        	
        }

	    	context.restore();
			}
		},

		/**
		 * <p style='color:#AD071D'><strong>typeName</strong></p>
		 *
		 * @return {String} Returns the type name of this object
		 */
		typeName: function() {
			return 'Root';
		},
		/**
		 * --------------------------------
		 */
	});

	return new Root();
});