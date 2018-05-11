/**
 * # animation-path-renderer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [renderer](@@renderer@@)
 *
 * Depends of: 
 * [path-cache](@@path-cache@@)
 * [error-printer](@@error-printer@@)
 * [util](@@util@@) 
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module is similar to [path-renderer](@@path-renderer@@) with the difference that it let's you define many drawings that will
 * be played in a sequence to create a simple animation. This object provides basic functionality, to play, stop and pause the animation.
 * It assumes all the provided frames are in the correct sequence, that they all form part of the same animation and that the animation loops 
 *
 * For a little bit more control (and complexity) try using [animations-path-renderer](@@animations-path-renderer@@)
 *
 * This renderer can receive a bunch of configuration options
 * when setting it up in the [component-pool](@@component-pool@@). ej.
 * 
 * ``` javascript
 * gb.coPool.createConfiguration("PathAnimation", 'Path_Animation_Renderer')
	.args({ 
		//This name is used to identify the cached drawings
		//This is required
		name: 'RendererName',

		//These set the total width and height of the paths in the animation
		//This argument is only required if the renderer does not provide it. 
		width: 100,
		height: 100,
		
		//These number defines the amount of time that each frame will be displayed.
		//It is in seconds and it is required
		frameDelay: 0.1,
		
		//Each element of this array defines a frame of animation
		//It is required and can have as many elements as needed.
		framePaths: [
			function(context) {
				draw.rectangle(context, 0, 0, 70, 30, "#FF0000", null, 1);
			},
			function(context) {
				draw.rectangle(context, 0, 0, 70, 30, "#00FF00", null, 1);
			},
			function(context) {
				draw.rectangle(context, 0, 0, 70, 30, "#0000FF", null, 1);
			},
			function(context) {
				draw.rectangle(context, 0, 0, 70, 30, "#FFFFFF", null, 1);
			},
			function(context) {
				draw.rectangle(context, 0, 0, 70, 30, "#00FFFF", null, 1);
			}
		],
	
		//This boolean indicates wheter the animation should loop after completing or just play once
		//It is false by default
		loop: false,

		//Use this if you want the registration point of the image to be the center
		//This is optional
		offset:'center',

		//If offset is not provided this two are used
		//These are optional and default to 0
		offsetX:0,
		offsetY:0, 
 *  });
 * ```
 * <strong>Note: The snippet uses the reference to the <a href=@@component-pool@@>component-pool</a>
 * found in the <a href=@@gb@@>gb</a> module. 
 * The way you get a hold to a reference to the <a href=@@csomponent-pool@@>component-pool</a>
 * may vary.</strong>
 *
 * These objects extend [delegate](@@delegate@@) so they provide a few events to hook into:
 *
 * ### **COMPLETE** 
 * When the animation reaches the last frame
 * 
 * ``` javascript  
 * gameObject.renderer.on(gameObject.renderer.COMPLETE, function() {});
 * ``` 
 */

/**
 * Simple animations with paths
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["renderer", "path-cache", "error-printer", "util"], function(Renderer, PathCache, ErrorPrinter, Util) {

	var AnimationPathRenderer = Renderer.extend({

		init: function() {
			this._super();

			this.loop = false;
			this.width = null;
			this.height = null;
			this.name = null;
			this.frameDelay = null;
			this.framePaths = null;

			this.cache = PathCache;
		},

		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * This is called by the [game-object](@@game-object@@) using this renderer.
		 * It caches all the resutls from calling the drawing methods in the **framePaths** array
		 *
		 * @throws {Error} If width, height, name, frameDelay or framePaths properties are not set
		 */
		start: function(parent) {
			if (!this.width && !this.height) {
				ErrorPrinter.missingArgumentError('Animation Path Renderer', 'width', 'height');
			}

			if (!this.name) {
				ErrorPrinter.missingArgumentError('Animation Path Renderer', 'name');
			}

			if (!this.frameDelay) {
				ErrorPrinter.missingArgumentError('Animation Path Renderer', 'frameDelay');
			}

			if (!this.framePaths) {
				ErrorPrinter.missingArgumentError('Animation Path Renderer', 'framePaths');
			} else {
				if (!Util.isArray(this.framePaths)) {
					ErrorPrinter.wrongTypeArgumentError('Animation Path Renderer', 'framePaths', 'Array');
				}
			}

			for (var i = 0; i < this.framePaths.length; i++) {
				this.cache.cache(this.name + '_' + i.toString(), this.width, this.height, function(frameIndex) {
					return function(context) {
						this.framePaths[frameIndex].call(this, context);
					}.bind(this)
				}.bind(this)(i));
			}

			this.stop();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>update</strong></p>
		 *
		 * Executes the logic needed to change frames
		 * 
		 * @param  {Number} delta The time between the current update and the last
		 */
		update: function(delta) {
			if (this.isPlaying) {
				this.delayTotal += delta;

				if (this.delayTotal > this.frameDelay) {
					this.delayTotal -= this.frameDelay;

					if (this.frameIndex < this.framePaths.length - 1) {
						this.frameIndex++;
					} else {
						if (this.loop) {
							this.frameIndex = 0;
						} else {
							this.pause();
						}

						this.execute(this.COMPLETE);
					}

					this.currentFrameName = this.name + '_' + this.frameIndex.toString();
				}
			}
		},

		/**
		 * <p style='color:#AD071D'><strong>draw</strong></p>
		 *
		 * Draws the cached path into the canvas, applying configured properties,
		 * like **scaleX**, **scaleY** and **offsets**
		 * 
		 * @param  {Context 2D} context     [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
		 * @param  {Object} viewport     The [viewport](@@viewport@@) this renderer is being drawn to
		 */
		draw: function(context, viewport) {
			var canvas = this.cache.get(this.currentFrameName);

			if (!canvas)
				return;

			if (this.tinted) {
				var tintedCanvas = this.tintImage(this.currentFrameName, canvas);

				context.drawImage(tintedCanvas,
					Math.floor(this.rendererOffsetX()),
					Math.floor(this.rendererOffsetY()),
					Math.floor(this.rendererWidth()),
					Math.floor(this.rendererHeight())
				);
			} else {
				context.drawImage(canvas,
					Math.floor(this.rendererOffsetX()),
					Math.floor(this.rendererOffsetY()),
					Math.floor(this.rendererWidth()),
					Math.floor(this.rendererHeight())
				);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>rendererOffsetX</strong></p>
		 *
		 * @return {Number} The offset in the X axis of the renderer
		 */
		rendererOffsetX: function() {
			if (this.offset == 'center') {
				return -this.rendererWidth() / 2 + this.offsetX;
			} else {
				return this.offsetX;
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>rendererOffsetY</strong></p>
		 *
		 * @return {Number} The offset in the Y axis of the renderer
		 */
		rendererOffsetY: function() {
			if (this.offset == 'center') {
				return -this.rendererHeight() / 2 + this.offsetY;
			} else {
				return this.offsetY;
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>play</strong></p>
		 *
		 * Plays the animation from the current frame
		 */
		play: function() {
			this.isPlaying = true;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>play</strong></p>
		 *
		 * Stops and resets the animation to the first frame
		 */
		stop: function() {
			this.isPlaying = false;
			this.delayTotal = 0;
			this.frameIndex = 0;
			this.currentFrameName = this.name + '_' + this.frameIndex.toString();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>play</strong></p>
		 *
		 * Pauses the animation in the current frame
		 */
		pause: function() {
			this.isPlaying = false;
		}
		/**
		 * --------------------------------
		 */
	});

	Object.defineProperty(AnimationPathRenderer.prototype, "COMPLETE", {
		get: function() {
			return 'complete';
		}
	});

	return AnimationPathRenderer;
});
