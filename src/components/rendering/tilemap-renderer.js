/**
 * # tilemap-renderer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [renderer](@@renderer@@) 
 *
 * Depends of: 
 * [image-cache](@@image-cache@@)
 * [xml-cache](@@xml-cache@@)
 * [error-printer](@@error-printer@@)
 * 
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module renders a tilemap using an image as source for the tiles and a file to extract the tile information.
 * It is prepared to understand files exported by [Tiled](https://www.mapeditor.org/). As other objects it can
 * receive a bunch of configuration options when setting it up in the [component-pool](@@component-pool@@). ej.
 *
 * ``` javascript
 * gb.coPool.createConfiguration("Tilemap", 'Tilemap_Renderer')
 	.args({ 
 		//Path to the image you want to draw.
 		//This is required
		imagePath: 'some/path/to/image.jpg',
		
		//Path to the tile map data file you want to use.
 		//This is required
		dataPath: 'some/path/to/tilemap.tmx'
 *	});
 * ```
 * <strong>Note: The snippet uses the reference to the <a href=@@component-pool@@>component-pool</a>
 * found in the <a href=@@gb@@>gb</a> module. 
 * The way you get a hold to a reference to the <a href=@@component-pool@@>component-pool</a>
 * may vary.</strong>
 */

/**
 * Draw Tilemaps
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["renderer", "image-cache", "xml-cache", "error-printer"], function(Renderer, ImageCache, XMLCache, ErrorPrinter) {

	var TilemapRenderer = Renderer.extend({
		init: function() {
			this._super();

			this.width = NaN;
			this.height = NaN;

			this.mapWidth = NaN;
			this.mapHeight = NaN;

			this.tileWidth = NaN;
			this.tileHeight = NaN;

			this.data = null;

			this.imagePath = '';
			this.dataPath = '';

			this.imageCache = ImageCache;
			this.xmlCache = XMLCache;

			this.ret = {};
		},

		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * This is called by the [game-object](@@game-object@@) using this renderer.
		 * It sends the image path configured to the [image-cache](@@image-cache@@) module
		 * and loads the tile data into the [xml-cache](@@xml-cache@@)
		 */
		start: function(parent) {
			if (!this.imagePath) {
				ErrorPrinter.missingArgumentError('Tilemap Renderer', 'imagePath');
			}

			if (!this.dataPath) {
				ErrorPrinter.missingArgumentError('Tilemap Renderer', 'dataPath');
			}

			this.imageCache.cache(this.imagePath);
			
			var self = this;

			this.xmlCache.cache(this.dataPath, function()
			{
				var tilemapData = self.xmlCache.get(self.dataPath);

				self.mapWidth = Number(tilemapData.getElementsByTagName("map")[0].getAttribute("width"));
				self.mapHeight = Number(tilemapData.getElementsByTagName("map")[0].getAttribute("height"));

				self.tileWidth = Number(tilemapData.getElementsByTagName("tileset")[0].getAttribute("tilewidth"));
				self.tileHeight = Number(tilemapData.getElementsByTagName("tileset")[0].getAttribute("tileheight"));

				self.width = self.mapWidth * self.tileWidth;
				self.height = self.mapHeight * self.tileHeight;

				var csvData = tilemapData.getElementsByTagName("data")[0].textContent.replace(/[^\d,]/g, "");

				self.data = csvData.split(",").map(function(n) { return Number(n) - 1 });
			});
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>draw</str ong></p>
		 *
		 * Draws the tiles into the canvas
		 * 
		 * @param  {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
		 * @param  {Object} viewport     The [viewport](@@viewport@@) this renderer is being drawn to
		 */
		draw: function(context, viewport) {
			var image = this.imageCache.get(this.imagePath);
			var tilemapData = this.xmlCache.get(this.dataPath);

			if (!image || !tilemapData)
				return;

			var mw = this.mapHeight;
			var mh = this.mapWidth;

			var tw = this.tileWidth;
			var th = this.tileHeight;

			var ox = this.rendererOffsetX();
			var oy = this.rendererOffsetY();

			var columns = Math.floor(image.width / tw);

			if (this.tinted)
				image = this.tintImage(this.imagePath, image);

			for (var i = 0; i < mw; i++) {
				for (var j = 0; j < mh; j++) {

					var dataIndex = i + mw * j;

					var tileIndex = this.data[dataIndex];

					if (tileIndex < 0)
						continue;

					var dx = i * tw;
					var dy = j * th;
					
					var top = this.parent.Y + dy;
					var left = this.parent.X + dx;
					var bottom = top + th;
					var right = left + tw;

					if (!viewport.isRectIntersecting(top, left, bottom, right))
					 	continue;
					
					var sx = tw * (tileIndex % columns);
					var sy = th * Math.floor(tileIndex / columns);

					context.drawImage(
						image,
						sx,
						sy,
						tw,
						th,
						Math.floor(ox + dx),
						Math.floor(oy + dy),
						tw,
						th
					);
				}
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
			return this.width;
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
			return this.height;
		}
		/**
		 * --------------------------------
		 */
	});

	return TilemapRenderer;
});
