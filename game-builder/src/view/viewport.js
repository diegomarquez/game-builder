/**
 * # viewport.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [game-object-container](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object-container.html)
 *
 * Inherits from:
 * [delegate](http://diegomarquez.github.io/game-builder/game-builder-docs/src/delegate.html)
 *
 * Depends of:
 * [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html)
 * [reclaimer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/reclaimer.html)
 * [matrix-3x3](http://diegomarquez.github.io/game-builder/game-builder-docs/src/math/matrix-3x3.html)
 * [sat](http://diegomarquez.github.io/game-builder/game-builder-docs/src/collision/sat.html)
 * [vector-2D](http://diegomarquez.github.io/game-builder/game-builder-docs/src/math/vector-2D.html)
 * [error-printer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/debug/error-printer.html)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module defines a viewport, it has an offset in relation to the top left of the screen, a width and height, and the position
 * of the world it is viewing. It is a rectangle.
 *
 * Aside from that it holds an array of [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) objects each with the [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) that this
 * viewport should draw.
 *
 * These objects extend [delegate](http://diegomarquez.github.io/game-builder/game-builder-docs/src/delegate.html) so they provide a few events to hook into:
 *
 * ### **ADD**
 * When a [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) is added
 *
 * Registered callbacks get the [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) as argument
 * ``` javascript
 * viewport.on(viewport.ADD, function(layer) {});
 * ```
 *
 * </br>
 *
 * ### **REMOVE**
 * When a [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) is removed
 *
 * Registered callbacks get the [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) as argument
 * ``` javascript
 * viewport.on(viewport.REMOVE, function(layer) {});
 * ```
 *
 * </br>
 *
 * ### **CHANGE**
 * When a [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) changes position
 *
 * Registered callbacks get the [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) as argument
 * ``` javascript
 * viewport.on(viewport.CHANGE, function(layer) {});
 * ```
 *
 * </br>
 *
 * ### **REMOVE_ALL**
 * When all the [layers](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) are removed
 *
 * ``` javascript
 * viewport.on(viewport.REMOVE_ALL, function() {});
 * ```
 *
 * </br>
 */

/**
 * A little window
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate", "layer", "reclaimer", "matrix-3x3", "sat", "vector-2D", "error-printer"], function(Delegate, Layer, Reclaimer, Matrix, SAT, Vector2D, ErrorPrinter) {
	var Viewport = Delegate.extend({

		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 *
		 * Constructor
		 *
		 * @param {String} name Name of the viewport
		 * @param {Number} width Width of the viewport
		 * @param {Number} height Height of the viewport
		 * @param {Number} offsetX X offset relative to the top left corner of the screen
		 * @param {Number} offsetY Y offset relative to the top left corner of the screen
		 * @param {Number} scaleX X scale of the viewport relative to the [world](http://diegomarquez.github.io/game-builder/game-builder-docs/src/world.html) size
		 * @param {Number} scaleY Y scale of the viewport relative to the [world](http://diegomarquez.github.io/game-builder/game-builder-docs/src/world.html) size
		 */
		init: function(name, width, height, offsetX, offsetY, scaleX, scaleY) {
			this._super();

			this.name = name;

			this.x = 0;
			this.y = 0;

			this.Width = width;
			this.Height = height;

			this.ScaleX = scaleX || 1;
			this.ScaleY = scaleY || 1;

			this.OffsetX = offsetX || 0;
			this.OffsetY = offsetY || 0;

			this.WorldFit = false;
			this.Culling = true;
			this.Clipping = true;
			this.MouseEnabled = true;
			this.MouseBounded = true;

			this.visible = true;

			this.layers = [];
			this.matrix = new Matrix();

			this.p1 = new Vector2D();
			this.p2 = new Vector2D();
			this.p3 = new Vector2D();
			this.p4 = new Vector2D();
			this.rOffsetX;
			this.rOffsetY;
			this.rWidth;
			this.rHeight;

			this.left = 0;
			this.top = 0;
			this.right = 0;
			this.bottom = 0;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>setStroke</strong></p>
		 *
		 * Set the border of the rectangle of the viewport
		 *
		 * @param {Number} width Line width of the stroke
		 * @param {Number} color Color of the stroke
		 */
		setStroke: function(width, color) {
			if (width) {
				this.strokeWidth = width;
			}

			if (color) {
				this.strokeColor = color;
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getStroke</strong></p>
		 *
		 * Get the stroke attributes of the viewport
		 *
		 * @return {Object} with stroke color and width
		 */
		getStroke: function() {
			return {
				width: this.strokeWidth,
				color: this.strokeColor
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>addLayer</strong></p>
		 *
		 * Adds a new [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) to the viewport
		 *
		 * @param {String} name Id of the new [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html)
		 *
		 * @return {Object} [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) that was just created. If the layer already exists, it is returned
		 */
		addLayer: function(name) {
			var result = createLayer.call(this, name);

			if (result.newLayer) {
				this.layers.push(result.layer);

				this.execute(this.ADD, result.layer);
			}

			return result.layer;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>addLayerAfter</strong></p>
		 *
		 * Adds a new [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) to the viewport after an existing [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html)
		 *
		 * @param {String} name Id of the new [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html)
		 * @param {String} after Id of the existing [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html)
		 *
		 * @return {Object} [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) that was just created. If the layer already exists, it is returned
		 */
		addLayerAfter: function(name, after) {
			var result = createLayer.call(this, name);

			if (result.newLayer) {
				this.layers.splice(findLayerIndex.call(this, after) + 1, 0, result.layer);

				this.execute(this.ADD, result.layer);
			}

			return result.layer;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>addLayerBefore</strong></p>
		 *
		 * Adds a new [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) to the viewport before an existing [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html)
		 *
		 * @param {String} name Id of the new [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html)
		 * @param {String} before Id of the existing [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html)
		 *
		 * @return {Object} [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) that was just created. If the layer already exists, it is returned
		 */
		addLayerBefore: function(name, before) {
			var result = createLayer.call(this, name);

			if (result.newLayer) {
				this.layers.splice(findLayerIndex.call(this, before), 0, result.layer);

				this.execute(this.ADD, result.layer);
			}

			return result.layer;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getLayers</strong></p>
		 *
		 * Gets all the [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) objects
		 *
		 * @return {Array} An array with all the [layers](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html)
		 */
		getLayers: function() {
			return this.layers;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getLayer</strong></p>
		 *
		 * Get the specified [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html), and error is thrown if the layer does not exist.
		 *
		 * @param {String} name The name of the [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) to get
		 *
		 * @return {Object} A [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html)
		 */
		getLayer: function(name) {
			return findLayer.call(this, name);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>changeLayer</strong></p>
		 *
		 * Change [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) position in it's collection
		 *
		 * @param {String} [name] Name of of the [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) to change
		 * @param {Number} [index] Index to put the selected [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) in
		 */
		changeLayer: function(name, index) {
			var layer = findLayer.call(this, name);
			var layerIndex = findLayerIndex.call(this, name);

			this.layers.splice(layerIndex, 1);
			this.layers.splice(index, 0, layer);

			this.execute(this.CHANGE, result.layer);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeLayer</strong></p>
		 *
		 * Removes the specified [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) from the viewport
		 *
		 * @param {String} name Id of the [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) to remove
		 *
		 * @throws {Error} If the specified id does not exist
		 */
		removeLayer: function(name) {
			for (var i = 0; i < this.layers.length; i++) {
				var layer = this.layers[i];

				if (layer.name == name) {
					this.execute(this.REMOVE, layer);

					recycleGameObjects(layer.removeAll());
					this.layers.splice(i, 1);

					return;
				}
			}

			ErrorPrinter.printError('Viewport', 'Layer with id:' + name + ' does not exist.');
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeAllLayers</strong></p>
		 *
		 * Remove all [layers](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) from the viewport
		 */
		removeAllLayers: function() {
			var layer;

			var gos = [];

			while (this.layers.length != 0) {
				gos = gos.concat(this.layers.pop()
					.removeAll());
			}

			recycleGameObjects(gos);

			this.execute(this.REMOVE_ALL);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>addGameObject</strong></p>
		 *
		 * Add a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to the specified [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) of the viewport
		 *
		 * @param {String} layerName Id of the [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) to add the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to
		 * @param {Object} go [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to add
		 */
		addGameObject: function(layerName, go) {
			var layer = findLayer.call(this, layerName);
			var success = layer.addGameObject(go);

			if (success) {
				go.on(go.RECYCLE, this, function(g) {
					layer.removeGameObject(g);
				}, true);
			}

			return success;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeGameObject</strong></p>
		 *
		 * Remove the specified [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) from the specified [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) of the viewport
		 *
		 * @param {String} layerName Id of the [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) to remove the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) from
		 * @param {Object} go [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to remove
		 */
		removeGameObject: function(layerName, go) {
			// Remove it from the old layer
			findLayer.call(this, layerName)
				.removeGameObject(go);
			recycleGameObjects(go);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>moveGameObject</strong></p>
		 *
		 * Move a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to the specified [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) of the viewport
		 *
		 * @param {String} oldLayerName Id of the old [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) belonged to
		 * @param {String} newLayerName Id of the new [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) will belong to
		 * @param {Object} go [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to move
		 */
		moveGameObject: function(oldLayerName, newLayerName, go) {
			// Add the game object to the new layer
			this.addGameObject(newLayerName, go);
			// Remove it from the old layer
			removeGameObject(oldLayerName, go);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeAllGameObjects</strong></p>
		 *
		 * Remove all [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) from the viewport
		 */
		removeAllGameObjects: function() {
			var gos = [];

			for (var i = 0; i < this.layers.length; i++) {
				gos = gos.concat(this.layers[i].removeAll());
			}

			recycleGameObjects(gos);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>destroy</strong></p>
		 *
		 * Destroys everything inside the viewport
		 */
		destroy: function() {
			this.matrix = null;
			this.removeAllLayers();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>draw</strong></p>
		 *
		 * Draw all the [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) in the viewport
		 *
		 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
		 */
		draw: function(context) {
			if (!this.visible) return;

			for (var i = 0; i < this.layers.length; i++) {
				this.layers[i].draw(context);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>show</strong></p>
		 *
		 * Make all the [layers](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) in the viewport visible
		 */
		show: function() {
			this.visible = true;

			for (var i = 0; i < this.layers.length; i++) {
				this.layers[i].show();
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>hide</strong></p>
		 *
		 * Make all the [layers](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) in the viewport invisible
		 */
		hide: function() {
			this.visible = false;

			for (var i = 0; i < this.layers.length; i++) {
				this.layers[i].hide();
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>isVisible</strong></p>
		 *
		 * Wether the layer is visible or not
		 *
		 * @return {Boolean}
		 */
		isVisible: function() {
			return this.visible;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>isGameObjectInside</strong></p>
		 *
		 * @param {Object} go [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to test
		 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
		 *
		 * @return {Boolean} Whether the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) is in the visible area of the viewport or not
		 */
		isGameObjectInside: function(go, context) {
			var r = go.renderer;
			var m = go.getMatrix();
			var tmp;

			if (r) {
				// Game Objects with renderers take dimentions from them
				this.rOffsetX = r.rendererOffsetX();
				this.rOffsetY = r.rendererOffsetY();
				this.rWidth = r.rendererWidth();
				this.rHeight = r.rendererHeight();
			} else {
				// Game Objects with no renderers take default dimentions
				this.rOffsetX = 0;
				this.rOffsetY = 0;
				this.rWidth = 1;
				this.rHeight = 1;
			}

			// Get the world coordinates of the game object corners
			this.p1 = m.transformPoint(this.rOffsetX, this.rOffsetY, this.p1);
			this.p2 = m.transformPoint(this.rOffsetX + this.rWidth, this.rOffsetY, this.p2);
			this.p3 = m.transformPoint(this.rOffsetX + this.rWidth, this.rOffsetY + this.rHeight, this.p3);
			this.p4 = m.transformPoint(this.rOffsetX, this.rOffsetY + this.rHeight, this.p4);

			if (this.Culling) {
				// Calculate left and right most values
				this.left = this.p1.x;
				this.right = this.p2.x;

				if (this.left > this.right) {
					tmp = this.left;

					this.left = this.right;
					this.right = tmp;
				}

				if (this.p3.x < this.left) {
					this.left = this.p3.x;
				}

				if (this.p3.x > this.right) {
					this.right = this.p3.x;
				}

				if (this.p4.x < this.left) {
					this.left = this.p4.x;
				}

				if (this.p4.x > this.right) {
					this.right = this.p4.x;
				}

				// Calculate top and bottom most value
				this.top = this.p1.y;
				this.bottom = this.p2.y;

				if (this.top > this.bottom) {
					tmp = this.top;

					this.top = this.bottom;
					this.bottom = tmp;
				}

				if (this.p3.y < this.top) {
					this.top = this.p3.y;
				}

				if (this.p3.y > this.bottom) {
					this.bottom = this.p3.y;
				}

				if (this.p4.y < this.top) {
					this.top = this.p4.y;
				}

				if (this.p4.y > this.bottom) {
					this.bottom = this.p4.y;
				}

				this.left *= this.ScaleX;
				this.top *= this.ScaleY;
				this.right *= this.ScaleX;
				this.bottom *= this.ScaleY;

				// The game object is surely outside the viewport
				if (this.left > -this.x + this.Width || -this.x > this.right || this.top > -this.y + this.Height || -this.y > this.bottom) {
					// Set the game object as not visible in this viewport
					go.setViewportVisibility(this.name, false);
					return false;
				} else {
					// Set the game object as not visible in this viewport
					go.setViewportVisibility(this.name, true);
					return true;
				}

			} else {
				// Viewport's matrix
				var vm = this.getMatrix();

				// Get the canvas coordinates of the game object's corners to build the game object collider that will work in canvas space
				this.p1 = vm.transformPoint(this.p1.x, this.p1.y, this.p1);
				this.p2 = vm.transformPoint(this.p2.x, this.p2.y, this.p2);
				this.p3 = vm.transformPoint(this.p3.x, this.p3.y, this.p3);
				this.p4 = vm.transformPoint(this.p4.x, this.p4.y, this.p4);

				// Calculate left and right most values
				this.left = this.p1.x;
				this.right = this.p2.x;

				if (this.left > this.right) {
					tmp = this.left;

					this.left = this.right;
					this.right = tmp;
				}

				if (this.p3.x < this.left) {
					this.left = this.p3.x;
				}

				if (this.p3.x > this.right) {
					this.right = this.p3.x;
				}

				if (this.p4.x < this.left) {
					this.left = this.p4.x;
				}

				if (this.p4.x > this.right) {
					this.right = this.p4.x;
				}

				// Calculate top and bottom most value
				this.top = this.p1.y;
				this.bottom = this.p2.y;

				if (this.top > this.bottom) {
					tmp = this.top;

					this.top = this.bottom;
					this.bottom = tmp;
				}

				if (this.p3.y < this.top) {
					this.top = this.p3.y;
				}

				if (this.p3.y > this.bottom) {
					this.bottom = this.p3.y;
				}

				if (this.p4.y < this.top) {
					this.top = this.p4.y;
				}

				if (this.p4.y > this.bottom) {
					this.bottom = this.p4.y;
				}

				this.left *= this.ScaleX;
				this.top *= this.ScaleY;
				this.right *= this.ScaleX;
				this.bottom *= this.ScaleY;

				// The game object is surely not visible in th canvas
				if (this.left > context.canvas.width || 0 > this.right || this.top > context.canvas.height || 0 > this.bottom) {
					// Set the game object as not visible in this viewport
					go.setViewportVisibility(this.name, false);
					return false;
				} else {
					// Set the game object as not visible in this viewport
					go.setViewportVisibility(this.name, true);
					return true;
				}
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>isPointInside</strong></p>
		 *
		 * @param {Number} x X coordinate
		 * @param {Number} y Y coordinate
		 *
		 * @return {Boolean} Whether the coordinates given are inside the viewport or not
		 */
		isPointInside: function(x, y) {
			if (x >= this.OffsetX && x <= this.OffsetX + this.Width) {
				if (y >= this.OffsetY && y <= this.OffsetY + this.Height) {
					return true;
				}
			}

			return false;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>layerExists</strong></p>
		 *
		 * Check whether the specified [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) exists
		 *
		 * @param {Boolean} name
		 *
		 * @return {Boolean} Whether the specified layer exists or not
		 */
		layerExists: function(name) {
			return findLayer.call(this, name, true) ? true : false;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>showLayer</strong></p>
		 *
		 * Makes the specified [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) visible
		 *
		 * @param {String} name Id of an existing [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html)
		 */
		showLayer: function(name) {
			findLayer.call(this, name)
				.show();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>hideLayer</strong></p>
		 *
		 * Makes the specified [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) invisible
		 *
		 * @param {String} name Id of an existing [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html)
		 */
		hideLayer: function(name) {
			findLayer.call(this, name)
				.hide();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getMatrix</strong></p>
		 *
		 * Get the concatenated [matrix-3x3](http://diegomarquez.github.io/game-builder/game-builder-docs/src/math/matrix-3x3.html) for this viewport
		 *
		 * @return {Object} The concatenated [matrix-3x3](http://diegomarquez.github.io/game-builder/game-builder-docs/src/math/matrix-3x3.html)
		 */
		getMatrix: function() {
			this.matrix.identity();
			this.matrix.prependTransform(this.x + this.OffsetX, this.y + this.OffsetY, this.ScaleX, this.ScaleY, 0, 0, 0, 1);
			return this.matrix;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>transformContext</strong></p>
		 *
		 * Applies the transformations this viewport defines to the current context
		 *
		 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
		 */
		transformContext: function(context) {
			// Translate to adjust for the current [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
			context.translate(this.x + this.OffsetX, this.y + this.OffsetY);
			// Scale to adjust for the current [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
			context.scale(this.ScaleX, this.ScaleY);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>canvasToLocalCoordinates</strong></p>
		 *
		 * Convert the given canvas coordinates to viewport coordinates
		 *
		 * @param {Number} x X coordinate in canvas space
		 * @param {Number} y Y coordinate in canvas space
		 * @param {Object} [r=null] Object to put the result in, if none is passed a new Object is created
		 *
		 * @return {Object} An object with x and y properties
		 */
		canvasToLocalCoordinates: function(x, y, r) {
			var m = this.getMatrix();
			m.invert();
			m.append(1, 0, 0, 1, x, y);

			r = r || {};

			r.x = m.tx;
			r.y = m.ty;

			return r;
		},
		/**
		 * --------------------------------
		 */
	});

	Object.defineProperty(Viewport.prototype, "ADD", {
		get: function() {
			return 'add';
		}
	});
	Object.defineProperty(Viewport.prototype, "REMOVE", {
		get: function() {
			return 'remove';
		}
	});
	Object.defineProperty(Viewport.prototype, "CHANGE", {
		get: function() {
			return 'change';
		}
	});
	Object.defineProperty(Viewport.prototype, "REMOVE_ALL", {
		get: function() {
			return 'remove_all';
		}
	});

	var defineNumberGetterAndSetter = function(name) {
		var prop = name.replace(/^./, name.charAt(0)
			.toLowerCase());

		Object.defineProperty(Viewport.prototype, name, {
			get: function() {
				return Number(this[prop]);
			},
			set: function(value) {
				this[prop] = value;
			}
		});
	}

	var defineBooleanGetterAndSetter = function(name) {
		var prop = name.replace(/^./, name.charAt(0)
			.toLowerCase());

		Object.defineProperty(Viewport.prototype, name, {
			get: function() {
				return this[prop];
			},
			set: function(value) {
				if (typeof value === 'string') {
					this[prop] = value.toLowerCase() == 'true' ? true : false;
				} else {
					this[prop] = value;
				}
			}
		});
	}

	defineBooleanGetterAndSetter('WorldFit');
	defineBooleanGetterAndSetter('Culling');
	defineBooleanGetterAndSetter('Clipping');
	defineBooleanGetterAndSetter('MouseEnabled');
	defineBooleanGetterAndSetter('MouseBounded');

	defineNumberGetterAndSetter('X');
	defineNumberGetterAndSetter('Y');
	defineNumberGetterAndSetter('Width');
	defineNumberGetterAndSetter('Height');
	defineNumberGetterAndSetter('OffsetX');
	defineNumberGetterAndSetter('OffsetY');
	defineNumberGetterAndSetter('ScaleX');
	defineNumberGetterAndSetter('ScaleY');

	var createLayer = function(name) {
		var layer = findLayer.call(this, name, true);

		if (layer) {
			return {
				layer: layer,
				newLayer: false
			};
		}

		return {
			layer: new Layer(name, this),
			newLayer: true
		};
	}

	var findLayer = function(name, skipError) {
		for (var i = 0; i < this.layers.length; i++) {
			if (this.layers[i].name == name) {
				return this.layers[i];
			}
		}

		if (!skipError) {
			ErrorPrinter.printError('Viewport', 'Layer with id:' + name + ' does not exist.');
		}
	}

	var findLayerIndex = function(name, skipError) {
		for (var i = 0; i < this.layers.length; i++) {
			if (this.layers[i].name == name) {
				return i;
			}
		}

		if (!skipError) {
			ErrorPrinter.printError('Viewport', 'Layer with id:' + name + ' does not exist.');
		}
	}

	var recycleGameObjects = function(gos) {
		if (gos.typeId) {
			// Single object sent
			recycle(gos);
		} else {
			// Collection to test for recycling
			for (var i = 0; i < gos.length; i++) {
				recycle(gos[i]);
			}
		}
	}

	var recycle = function(go) {
		// If a game object is not rendered anywhere send it back to it's pool
		if (!go.hasViewport()) {
			Reclaimer.claim(go);
		}
	}

	return Viewport;
});
