/**
 * # aspect-ratio-resize.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [extension](@@extension@@)
 *
 * Depends of: 
 * [layers](@@layers@@)
 * [gb](@@gb@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines an extension that will make the canvas scale to fit in the viewport
 * while maintening the original aspect ratio.
 */

/**
 * Resize the Canvas
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["layers", "gb", "extension"], function(Layers, Gb, Extension) {
	var AspectRatioResize = Extension.extend({
		type: function() {
			// Notice the use of the constant CREATE defined in [game](@@game@@),
			// to define this extension should be executed on creation.
			return Gb.game.CREATE;
		},

		execute: function() {
			var resize = function(container, canvas) {
				var scale = { x: 1, y: 1};

				scale.x = (window.innerWidth - 5) / canvas.width;
				scale.y = (window.innerHeight - 5) / canvas.height;

				if (scale.x < scale.y) {
					scale = scale.x + ', ' + scale.x;
				} else {
					scale = scale.y + ', ' + scale.y;
				}

				container.style.webkitTransform = 'scale(' + scale + ')';
				container.style.mozTransform    = 'scale(' + scale + ')';
				container.style.msTransform     = 'scale(' + scale + ')';
				container.style.oTransform      = 'scale(' + scale + ')';
			};

    		Gb.game.mainContainer.style.top  		= '50%';
    		Gb.game.mainContainer.style.left 		= '50%';
			Gb.game.mainContainer.style.marginLeft = '-' + Gb.game.canvas.width/2 + 'px';
			Gb.game.mainContainer.style.marginTop  = '-' + Gb.game.canvas.height/2 + 'px';
			Gb.game.mainContainer.style.position   = 'fixed';

			Gb.game.canvas.style.paddingLeft  = 0;
    		Gb.game.canvas.style.paddingRight = 0;
    		Gb.game.canvas.style.marginLeft   = 'auto';
    		Gb.game.canvas.style.marginRight  = 'auto';

			resize(Gb.game.mainContainer, Gb.game.canvas);

			window.addEventListener('resize', function() { 
				resize(Gb.game.mainContainer, Gb.game.canvas); 
			}, false);			
		}
	});

	return AspectRatioResize;
});