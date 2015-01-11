/**
 * # aspect-ratio-resize.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [extension](@@extension@@)
 *
 * Depends of: 
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
define(["gb", "extension"], function(Gb, Extension) {
	var AspectRatioResize = Extension.extend({
		type: function() {
			// Notice the use of the constant CREATE defined in [game](@@game@@),
			// to define this extension should be executed on creation.
			return Gb.game.CREATE;
		},

		execute: function() {
			var scaleX, scaleY;

			this.resize = function(container, canvas) {
				scaleX = 1;
				scaleY = 1;

				scaleX = (window.innerWidth - 5) / canvas.width;
				scaleY = (window.innerHeight - 5) / canvas.height;

				scale = scaleX < scaleY ? scaleX + ', ' + scaleX : scaleY + ', ' + scaleY;

				container.style.webkitTransform = 'scale(' + scale + ')';
				container.style.mozTransform    = 'scale(' + scale + ')';
				container.style.msTransform     = 'scale(' + scale + ')';
				container.style.oTransform      = 'scale(' + scale + ')';
			};

			var container = Gb.game.mainContainer;
			var canvas = Gb.game.canvas;

			this.initContainerTop = container.style.top;
			this.initContainerLeft = container.style.left;
			this.initContainerMarginTop = container.style.marginTop;
			this.initContainerMarginLeft = container.style.marginLeft;
			this.initContainerPosition = container.style.position;

			this.initCanvasPaddingLeft = canvas.style.paddingLeft;
			this.initCanvasPaddingRight = canvas.style.paddingRight;
			this.initCanvasMarginLeft = canvas.style.marginLeft;
			this.initCanvasMarginRight = canvas.style.marginRight;

    	container.style.top  		= '50%';
    	container.style.left 		= '50%';
			container.style.marginLeft = '-' + Gb.game.canvas.width/2 + 'px';
			container.style.marginTop  = '-' + Gb.game.canvas.height/2 + 'px';
			container.style.position   = 'fixed';

			canvas.style.paddingLeft  = 0;
    	canvas.style.paddingRight = 0;
    	canvas.style.marginLeft   = 'auto';
    	canvas.style.marginRight  = 'auto';

			this.resize(container, canvas);

			this.resizeListener = function() {
				resize(container, canvas);
			}

			window.addEventListener('resize', this.resizeListener, false);			
		},

		destroy: function() {
			container.style.top  		   = this.initContainerTop;
    	container.style.left 		   = this.initContainerLeft;
			container.style.marginTop  = this.initContainerMarginTop;
			container.style.marginLeft = this.initContainerMarginLeft;
			container.style.position   = this.initContainerPosition;

			canvas.style.paddingLeft  = this.initCanvasPaddingLeft;
    	canvas.style.paddingRight = this.initCanvasPaddingRight;
    	canvas.style.marginLeft   = this.initCanvasMarginLeft;
    	canvas.style.marginRight  = this.initCanvasMarginRight;

    	window.removeEventListener('resize', this.resizeListener);

    	delete this['initContainerTop'];
    	delete this['initContainerLeft'];
			delete this['initContainerMarginTop'];
			delete this['initContainerMarginLeft'];
			delete this['initContainerPosition'];

			delete this['initCanvasPaddingLeft'];
    	delete this['initCanvasPaddingRight'];
    	delete this['initCanvasMarginLeft'];
    	delete this['initCanvasMarginRight'];

    	delete this['resizeListener']
		}
	});

	return AspectRatioResize;
});