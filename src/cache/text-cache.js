/**
 * # text-cache.js
 * ### By [Diego Enrique Marquez](http://treintipollo.com/)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [cache](@@cache@@)
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module is very similar to [image-cache](@@image-cache@@), but instead of caching
 * [Images](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement) it caches text drawn to a
 * [Canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas). Drawing text is quite taxing on the CPU, so drawing it once and then
 * keeping the rastered image can be a pretty good time saver.
 *
 * The module will cache dynamically generated [canvases](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas). A given canvas could
 * then be used to draw onto it to cache text for later use.
 *
 * A few downsides are:
 *
 * 1. If for whatever reason your text is going to change alot, you are better not caching. Infact caching would
 * be detrimental in this case.
 * 2. Rendering text in a [Canvas](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) is rather slow,
 * so consider using HTML for your text needs. After all, rendering text is the main activity in any browser, so they are very good at it.
 */

/**
 * --------------------------------
 */
define(function(require) {

	var TextCache = require('cache')
		.extend({
			/**
			 * <p style='color:#AD071D'><strong>name</strong></p>
			 *
			 * @return {String} The name of the cache
			 */
			name: function() {
				return 'Text Cache';
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>cache</strong></p>
			 *
			 * @param {String} id Id that will be used to retrieve the cached canvas
			 * @param {Object} textAttributes Attributes of the piece of text to cache
			 */
			cache: function(id, textAttributes) {
				var canvas = this.cacheObject[id];

				// Create a canvas for this ID if it doesn't exist yet
				if (!canvas) {
					canvas = document.createElement('canvas');
				}

				// Set the string that describes a font. Currently only size and font family are supported.
				textAttributes.font = textAttributes.size + "px" + " " + textAttributes.fontFamily;

				// Will be using this div to get the correct width and height of the string.
				// That way the cached canvas will have the exact size.
				var div = document.createElement('div')
				div.style.visibility = 'hidden';
				div.style.font = textAttributes.font;
				div.style.position = 'absolute';
				div.style.width = 'auto';
				div.style.height = 'auto';
				div.style.margin = 0;
				div.innerHTML = textAttributes.text;

				// Append the div to document to get it's width and height
				document.body.appendChild(div);

				var padding = textAttributes.padding || 0;

				// Set the canvas dimentions
				canvas.width = div.getBoundingClientRect()
					.width + padding;
				canvas.height = div.getBoundingClientRect()
					.height + padding;

				// Discard the div
				document.body.removeChild(div);

				var context = canvas.getContext('2d');

				// Clear the canvas
				context.clearRect(0, 0, canvas.width, canvas.height);

				context.fillStyle = textAttributes.background;
				context.fillRect(0, 0, canvas.width, canvas.height);

				// Set text drawing properties
				context.textBaseline = "middle";
				context.textAlign = textAttributes.align;
				context.lineWidth = textAttributes.lineWidth;
				context.fillStyle = textAttributes.fill;
				context.strokeStyle = textAttributes.stroke;
				context.font = textAttributes.font;

				// Draw the text
				context.fillText(textAttributes.text, 0, canvas.height / 2);
				context.strokeText(textAttributes.text, 0, canvas.height / 2);

				// Cache the canvas for later use
				this.cacheObject[id] = canvas;

				this.execute(this.CACHE, this.cacheObject[id]);
			}
			/**
			 * --------------------------------
			 */
		});

	return new TextCache();
});
