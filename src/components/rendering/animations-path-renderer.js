/**
 * # animations-path-renderer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [renderer](@@renderer@@)
 *
 * Depends of: 
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module is similar to [animation-path-renderer](@@animation-path-renderer@@), with the difference that it assumes less things
 * about the arguments passed. It needs more configuration with the benefit of more control.
 *
 * Frames are not assumed to be part of a single continues animation, as such you need to configure which frames will belong to which animation.
 * You are then able to play, stop and resume each of this animations individually through a label passed into these methods.
 *
 * ``` javascript
 * gb.coPool.createConfiguration("PathAnimations", 'Path_Animations_Renderer')
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
		//It is required and can have as many elements as needed
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
				//Indexes of the frames this animation uses
				frames: [0, 1, 2],
			}
		},

 		//Use this if you want the registration point of the image to be the center
 		//This is optional
		offset:'center',

		//If offset is not provided this two are used
		//These are optional and default to 0
		offsetX:0,
		offsetY:0, 
 *	});
 * ```
 * <strong>Note: The snippet uses the reference to the <a href=@@component-pool@@>component-pool</a>
 * found in the <a href=@@gb@@>gb</a> module. 
 * The way you get a hold to a reference to the <a href=@@csomponent-pool@@>component-pool</a>
 * may vary.</strong>
 *
 * These objects extend [delegate](@@delegate@@) so they provide a few events to hook into:
 *
 * ### **COMPLETE** 
 * When the current label reaches the last frame and it doesn't loop
 * 
 * ``` javascript  
 * gameObject.renderer.on(gameObject.renderer.COMPLETE, function() {});
 * ```
 *
 * ### **LOOP** 
 * When the current label reaches the last frame and it loops
 * 
 * ``` javascript  
 * gameObject.renderer.on(gameObject.renderer.LOOP, function() {});
 * ```
 */

/**
 * Slightly more complicated animations
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["animation-path-renderer", "error-printer"], function(AnimationPathRenderer, ErrorPrinter) {

	var AnimationsPathRenderer = AnimationPathRenderer.extend({
		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * This is called by the [game-object](@@game-object@@) using this renderer.
		 * It caches all the resutls from calling the drawing methods in the **framePaths** array
		 *
		 * @throws {Error} If width, height, name, frameDelay or framePaths properties are not set
		 */
		start: function(parent) {
			if (!this.labels) {
				ErrorPrinter.missingArgumentError('Animation Path Renderer', 'labels');
			}

			if (!this.startingLabel) {
				ErrorPrinter.missingArgumentError('Animation Path Renderer', 'startingLabel');
			}

			this.currentFrames = null;
			this.currentLabel = null;

			this._super();
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
				if (this.currentFrames.length > 1) {
					this.delayTotal += delta;

					if (this.delayTotal > this.frameDelay) {
						this.delayTotal -= this.frameDelay;

						if (this.frameIndex < this.currentFrames.length - 1) {
							this.frameIndex++;
						} else {
							if (!this.loop) {
								this.execute(this.COMPLETE, this.currentLabel);
								this.pause();
							} else {
								this.frameIndex = 0;
								this.execute(this.LOOP, this.currentLabel);
							}
						}

						this.currentFrameName = this.name + '_' + this.currentFrames[this.frameIndex].toString();
					}
				}
			}
		},

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
			this.loop = label.loop;
			this.delayTotal = 0;
			this.frameIndex = 0;
			this.currentFrameName = this.name + '_' + this.currentFrames[0].toString();

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
			this.delayTotal = 0;
			this.frameIndex = 0;
			this.currentFrameName = this.name + '_' + this.currentFrames[0].toString();

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
			this.currentFrameName = this.name + '_' + this.currentFrames[0].toString();

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
		}
		/**
		 * --------------------------------
		 */
	});

	Object.defineProperty(AnimationsPathRenderer.prototype, "LOOP", {
		get: function() {
			return 'loop';
		}
	});

	return AnimationsPathRenderer;
});
