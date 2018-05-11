/**
 * # animations-bitmap-renderer.js
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
 * This module is similar to [animation-bitmap-renderer](@@animation-bitmap-renderer@@), with the difference that it assumes less things
 * about the arguments passed. It needs more configuration with the benefit of more control.
 *
 * Frames are not assumed to be part of a single continuos animation, as such you need to configure which frames will belong to which animation.
 * You are then able to play, stop and resume each of this animations individually through a label passed into these methods.
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
	
		//Use this if you want the registration point of the image to be the center
		//This is optional
		offset:'center',

		//If offset is not provided this two are used
		//These are optional and default to 0
		offsetX:0,
		offsetY:0, 

		//The label with which to start
		//This is required
		startingLabel: 'startLabel',
		
		//This object defines animations using the frames defined previously.
		//The object can have as many entries as needed and it is required
		labels: {
			//Name of the label
			'startLabel': {
				//If the label is a looping animation
				loop: true,	
				
				//This booelan indicates wheter the animation should play backwards once it reaches the end or gets back to the beginning
				//It is false by default
				pingPong: false,
				
				//Indexes of the frames this animation uses
				frames: [0, 1, 2]
			}
		},
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

	var AnimationsBitmapRenderer = Renderer.extend({

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

			this.currentFrames = null;
			this.currentLabel = null;
			this.labels = null;
			this.startingLabel = '';

			this.isPlaying = false;

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
			if (!this.frameWidth && !this.frameHeight) {
				ErrorPrinter.missingArgumentError('Animations Bitmap Renderer', 'frameWidth', 'frameHeight');
			}

			if (!this.frameDelay) {
				ErrorPrinter.missingArgumentError('Animations Bitmap Renderer', 'frameDelay');
			}

			if (!this.path) {
				ErrorPrinter.missingArgumentError('Animations Bitmap Renderer', 'path');
			}

			if (!this.labels) {
				ErrorPrinter.missingArgumentError('Animations Bitmap Renderer', 'labels');
			}

			if (!this.startingLabel) {
				ErrorPrinter.missingArgumentError('Animations Bitmap Renderer', 'startingLabel');
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

				if (this.currentFrames.length === 1) {
					this.currentFrameName = this.path + '_' + this.currentFrames[0].toString();
					return;
				}

				this.delayTotal += delta;

				if (this.delayTotal > this.frameDelay) {

					this.delayTotal -= this.frameDelay;

					if (this.direction === 1) {
						if (this.frameIndex < this.currentFrames.length - 1) {
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

						this.currentFrameName = this.path + '_' + this.currentFrames[this.frameIndex].toString();

						return;
					}

					if (this.direction === -1) {
						if (this.frameIndex > 0) {
							this.frameIndex--;
						} else {
							this.direction = 1;

							this.execute(this.COMPLETE_BACK);
						}

						this.currentFrameName = this.path + '_' + this.currentFrames[this.frameIndex].toString();

						return;
					}

					if (this.direction === -2) {
						if (this.frameIndex > 0) {
							this.frameIndex--;
						} else {

							if (this.loop) {
								this.frameIndex = this.currentFrames.length - 1;
							} else if (this.pingPong) {
								this.direction = 1;
							} else {
								this.pause();
							}

							this.execute(this.COMPLETE_BACK);
						}

						this.currentFrameName = this.path + '_' + this.currentFrames[this.frameIndex].toString();

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

			this.currentFrames = null;
			this.currentLabel = null;
			this.labels = null;
			this.startingLabel = '';

			this.isPlaying = false;

			this._super(parent);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>isAtLabel</strong></p>
		 *
		 * Check if the specified label is the current one
		 * 
		 * @param  {String}  selectedLabel
		 *
		 * @return {Boolean} Wether the label is active or not
		 */
		isAtLabel: function(selectedLabel) {
			return this.labels[selectedLabel] === this.currentLabel;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>play</strong></p>
		 *
		 * Plays the animation defined by the specified label
		 * 
		 * @param  {String} selectedLabel
		 */
		play: function(selectedLabel) {
			selectedLabel = selectedLabel || this.startingLabel;

			var label = this.labels[selectedLabel];

			this.currentLabel = label;
			this.currentFrames = label.frames;
			this.loop = label.loop || false;
			this.pingPong = label.pingPong || false;
			this.delayTotal = 0;
			this.frameIndex = 0;
			this.currentFrameName = this.path + '_' + this.currentFrames[0].toString();
			this.direction = 1;

			this.isPlaying = true;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>reverse</strong></p>
		 *
		 * Reverse the animation playback to the first frame of the current label
		 */
		reverse: function() {
			this.direction = -2;

			this.isPlaying = true;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>loop</strong></p>
		 *
		 * Forces a label to loop
		 * 
		 * @param  {String} selectedLabel
		 */
		loop: function(selectedLabel) {
			selectedLabel = selectedLabel || this.startingLabel;

			this.currentLabel = label;
			this.currentFrames = label.frames;
			this.loop = true;
			this.pingPong = false;
			this.delayTotal = 0;
			this.frameIndex = 0;
			this.currentFrameName = this.path + '_' + this.currentFrames[0].toString();
			this.direction = 1;

			this.isPlaying = true;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>stop</strong></p>
		 *
		 * Stops and resets the animation to the beginning of the specified label
		 * 
		 * @param  {String} selectedLabel
		 */
		stop: function(selectedLabel) {
			selectedLabel = selectedLabel || this.startingLabel;

			var label = this.labels[selectedLabel];

			this.currentLabel = label;
			this.currentFrames = label.frames;
			this.delayTotal = 0;
			this.frameIndex = 0;
			this.currentFrameName = this.path + '_' + this.currentFrames[0].toString();
			this.direction = 1;

			this.isPlaying = false;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>pause</strong></p>
		 *
		 * Pauses the current label in the current frame
		 */
		pause: function() {
			this.isPlaying = false;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>resume</strong></p>
		 *
		 * Resumes the current animation
		 */
		resume: function() {
			this.isPlaying = true;
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

	Object.defineProperty(AnimationsBitmapRenderer.prototype, "COMPLETE", {
		get: function() {
			return 'complete';
		}
	});
	Object.defineProperty(AnimationsBitmapRenderer.prototype, "COMPLETE_BACK", {
		get: function() {
			return 'complete_back';
		}
	});

	return AnimationsBitmapRenderer;
});
