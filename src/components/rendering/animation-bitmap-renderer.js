/**
 * # animation-bitmap-renderer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [renderer](@@renderer@@)
 *
 * Depends of: 
 * [image-cache](@@image-cache@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module is similar to [bitmap-renderer](@@bitmap-renderer@@) with the difference that it takes an image containing a strip of frames
 * for an animation. This object provides basic functionality, to play, stop and pause the animation.
 * It assumes all the provided frames are in the correct sequence, that they all form part of the same animation and that the animation loops 
 *
 * For a little bit more control (and complexity) try using [animations-bitmap-renderer](@@animations-bitmap-renderer@@)
 *
 * This renderer can receive a bunch of configuration options
 * when setting it up in the [component-pool](@@component-pool@@). ej.
 * 
 * ``` javascript
 * gb.coPool.createConfiguration("PathAnimation", 'Path_Animation_Renderer')
	.args({ 
		
		//These set the width and height of each frame of the animation
		//This argument is only required if the renderer does not provide it. 
		frameWidth: 100,
		frameHeight: 100,
		
		//The amount of frames the animation has, if the value is not passed in
		//the module tries to guess it
		frameCount: 2,

		//These number defines the amount of time that each frame will be displayed.
		//It is in seconds and it is required
		frameDelay: 0.1,
	
		//This boolean indicates wheter the animation should loop after completing or just play once
		//It is false by default. This setting has precendence over pingPong
		loop: false,
	
		//This booelan indicates wheter the animation should play backwards once it reaches the end or gets back to the beginning
		//It is false by default
		pingPong: false,

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
 *
 * ### **COMPLETE_BACK** 
 * When the animation reaches the first frame while in ping pong
 * 
 * ``` javascript  
 * gameObject.renderer.on(gameObject.renderer.COMPLETE_BACK, function() {});
 * ```
 */

/**
 * Simple animations with paths
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["renderer", "image-cache", "error-printer"], function(Renderer, ImageCache, ErrorPrinter) {

	var AnimationBitmapRenderer = Renderer.extend({

		init: function() {
			this._super();

			this.loop = false;
			this.pingPong = false;
			this.frameWidth = 0;
			this.frameHeight = 0;
			this.frameDelay = 0;
			this.frameCount = 0;
			this.path = '';
			this.finishLoading = false;
			this.frameIndex = 0;
			this.delayTotal = 0;

			this.direction = 1;

			this.cache = ImageCache;
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
			this._super(parent);

			if (!this.frameWidth && !this.frameHeight) {
				ErrorPrinter.missingArgumentError('Animation Bitmap Renderer', 'frameWidth', 'frameHeight');
			}

			if (!this.frameDelay) {
				ErrorPrinter.missingArgumentError('Animation Bitmap Renderer', 'frameDelay');
			}

			if (!this.path) {
				ErrorPrinter.missingArgumentError('Animation Bitmap Renderer', 'path');
			}

			var self = this;

			this.cache.cacheStrip(this.path, this.frameWidth, this.frameHeight, this.frameCount, function(frameCount) {
				self.finishLoading = true;
				self.frameCount = frameCount;
			});

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
			if (this.isPlaying && this.finishLoading) {
				this.delayTotal += delta;

				if (this.delayTotal > this.frameDelay) {
					this.delayTotal -= this.frameDelay;

					if (this.direction == 1) {
						if (this.frameIndex < this.frameCount - 1) {
							this.frameIndex++;
						} else {
							if (this.loop) {
								this.frameIndex = 0;
							} else if (this.pingPong) {
								this.direction = -1;
							} else {
								this.pause();
							}

							this.execute(this.COMPLETE);
						}

						this.currentFrameName = this.path + '_' + this.frameIndex.toString();

						return;
					}

					if (this.direction == -1) {
						if (this.frameIndex > 0) {
							this.frameIndex--;
						} else {
							this.direction = 1;

							this.execute(this.COMPLETE_BACK);
						}

						this.currentFrameName = this.path + '_' + this.frameIndex.toString();

						return;
					}
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
		 * <p style='color:#AD071D'><strong>recycle</strong></p>
		 *
		 * Called by the parent [game-object](@@game-object@@) 
		 * when it is sent back to it's pool for reuse.
		 *
		 * @param  {Object} parent [game-object](@@game-object@@) using this component
		 */
		recycle: function(parent) {
			this.loop = false;
			this.pingPong = false;
			this.frameWidth = 0;
			this.frameHeight = 0;
			this.frameDelay = 0;
			this.frameCount = 0;
			this.path = '';
			this.finishLoading = false;
			this.frameIndex = 0;
			this.delayTotal = 0;

			this.direction = 1;

			this._super(parent);
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
			this.direction = 1;
			this.currentFrameName = this.path + '_' + this.frameIndex.toString();
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
		 * <p style='color:#AD071D'><strong>rendererWidth</strong></p>
		 *
		 * @return {Number} The width of the renderer
		 */
		rendererWidth: function() {
			return this.frameWidth;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>rendererHeight</strong></p>
		 *
		 * @return {Number} The height of the renderer
		 */
		rendererHeight: function() {
			return this.frameHeight;
		}
		/**
		 * --------------------------------
		 */
	});

	Object.defineProperty(AnimationBitmapRenderer.prototype, "COMPLETE", {
		get: function() {
			return 'complete';
		}
	});
	Object.defineProperty(AnimationBitmapRenderer.prototype, "COMPLETE_BACK", {
		get: function() {
			return 'complete_back';
		}
	});

	return AnimationBitmapRenderer;
});
