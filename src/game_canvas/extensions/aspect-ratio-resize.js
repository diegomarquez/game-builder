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

			var resize = function(container, canvas) {
				scaleX = 1;
				scaleY = 1;

				scaleX = (window.innerWidth - 5) / canvas.width;
				scaleY = (window.innerHeight - 5) / canvas.height;

				scale = scaleX < scaleY ? scaleX + ', ' + scaleX : scaleY + ', ' + scaleY;

				container.style.webkitTransform = 'scale(' + scale + ')';
				container.style.mozTransform = 'scale(' + scale + ')';
				container.style.msTransform = 'scale(' + scale + ')';
				container.style.oTransform = 'scale(' + scale + ')';
			};

			this.container = Gb.game.mainContainer;
			this.canvas = Gb.game.canvas;

			var containerStyle = window.getComputedStyle(this.container, null);
			var canvasStyle = window.getComputedStyle(this.canvas, null);

			this.initContainerTop = containerStyle.getPropertyValue("top");
			this.initContainerLeft = containerStyle.getPropertyValue("left");
			this.initContainerMarginTop = containerStyle.getPropertyValue("margin-top");
			this.initContainerMarginLeft = containerStyle.getPropertyValue("margin-left");
			this.initContainerPosition = containerStyle.getPropertyValue("position");

			this.initCanvasPaddingLeft = canvasStyle.getPropertyValue("padding-left");
			this.initCanvasPaddingRight = canvasStyle.getPropertyValue("padding-right");
			this.initCanvasMarginLeft = canvasStyle.getPropertyValue("margin-left");
			this.initCanvasMarginRight = canvasStyle.getPropertyValue("margin-right");

			this.container.style.top = '50%';
			this.container.style.left = '50%';
			this.container.style.marginLeft = '-' + Gb.game.canvas.width / 2 + 'px';
			this.container.style.marginTop = '-' + Gb.game.canvas.height / 2 + 'px';
			this.container.style.position = 'fixed';

			this.canvas.style.paddingLeft = 0;
			this.canvas.style.paddingRight = 0;
			this.canvas.style.marginLeft = 'auto';
			this.canvas.style.marginRight = 'auto';

			resize(this.container, this.canvas);

			this.resizeListener = function() {
				resize(this.container, this.canvas);
			}.bind(this)

			window.addEventListener('resize', this.resizeListener, false);
		},

		destroy: function() {
			this.container.style.top = this.initContainerTop;
			this.container.style.left = this.initContainerLeft;
			this.container.style.marginTop = this.initContainerMarginTop;
			this.container.style.marginLeft = this.initContainerMarginLeft;
			this.container.style.position = this.initContainerPosition;

			this.container.style.webkitTransform = 'scale(1)';
			this.container.style.mozTransform = 'scale(1)';
			this.container.style.msTransform = 'scale(1)';
			this.container.style.oTransform = 'scale(1)';

			this.canvas.style.paddingLeft = this.initCanvasPaddingLeft;
			this.canvas.style.paddingRight = this.initCanvasPaddingRight;
			this.canvas.style.marginLeft = this.initCanvasMarginLeft;
			this.canvas.style.marginRight = this.initCanvasMarginRight;

			window.removeEventListener('resize', this.resizeListener);

			delete this['container'];
			delete this['canvas'];

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
