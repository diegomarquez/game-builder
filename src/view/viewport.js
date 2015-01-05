/**
 * # viewport.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [game-object-container](@@game-object-container@@)
 *
 * Inherits from:
 * [delegate](@@delegate@@)
 *
 * Depends of:
 * [layer](@@layer@@)
 * [reclaimer](@@reclaimer@@)
 * [matrix-3x3](@@matrix-3x3@@)
 * [sat](@@sat@@)
 * [vector-2D](@@vector-2D@@)
 * [error-printer](@@error-printer@@)
 * [util](@@util@@)
 * 
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module defines a viewport, it has an offset in relation to the top left of the screen, a width and height, and the position
 * of the world it is viewing. It is a rectangle.
 *
 * Aside from that it holds an array of [layer](@@layer@@) objects each with the [game-objects](@@game-object@@) that this
 * viewport should draw.
 *
 * These objects extend [delegate](@@delegate@@) so they provide a few events to hook into:
 *
 * ### **ADD** 
 * When a [layer](@@layer@@) is added
 * 
 * Registered callbacks get the [layer](@@layer@@) as argument 
 * ``` javascript  
 * viewport.on(viewport.ADD, function(layer) {});
 * ``` 
 *
 * </br>
 *
 * ### **REMOVE** 
 * When a [layer](@@layer@@) is removed 
 * 
 * Registered callbacks get the [layer](@@layer@@) as argument 
 * ``` javascript  
 * viewport.on(viewport.REMOVE, function(layer) {});
 * ``` 
 *
 * </br>
 *
 * ### **CHANGE** 
 * When a [layer](@@layer@@) changes position
 *
 * Registered callbacks get the [layer](@@layer@@) as argument 
 * ``` javascript  
 * viewport.on(viewport.CHANGE, function(layer) {});
 * ``` 
 *
 * </br>
 *
 * ### **REMOVE_ALL** 
 * When all the [layers](@@layer@@) are removed
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
define(["delegate", "layer", "reclaimer", "matrix-3x3", "sat", "vector-2D", "error-printer", "util"], function(Delegate, Layer, Reclaimer, Matrix, SAT, Vector2D, ErrorPrinter, Util){
  var p1 = {};
  var p2 = {};
  var p3 = {};
  var p4 = {};
  var m = null;
  var vm = null;
  var r = null;
  var rOffsetX, rOffsetY, rWidth, rHeight;
  var x, y, w, h;

  var canvasCollider = new SAT.FixedSizePolygon(
    new Vector2D(),
    [ new Vector2D(), new Vector2D(), new Vector2D(), new Vector2D() ]
  );

  var viewportCollider = new SAT.FixedSizePolygon(
    new Vector2D(),
    [ new Vector2D(), new Vector2D(), new Vector2D(), new Vector2D() ]
  );

  var gameObjectCollider = new SAT.FixedSizePolygon(
    new Vector2D(),
    [ new Vector2D(), new Vector2D(), new Vector2D(), new Vector2D() ]
  );

  var Viewport = Delegate.extend({

    /**
     * <p style='color:#AD071D'><strong>init</strong></p>
     *
     * Constructor
     *
     * @param  {String} name   Name of the viewport
     * @param  {Number} width   Width of the viewport
     * @param  {Number} height  Height of the viewport
     * @param  {Number} offsetX X offset relative to the top left corner of the screen
     * @param  {Number} offsetY Y offset relative to the top left corner of the screen
     * @param  {Number} scaleX X scale of the viewport relative to the [world](@@world@@) size
     * @param  {Number} scaleY Y scale of the viewport relative to the [world](@@world@@) size
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
    },

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
     * Adds a new [layer](@@layer@@) to the viewport
     *
     * @param {String} name Id of the new [layer](@@layer@@)
     *
     * @return {Object} [layer](@@layer@@) that was just created. If the layer already exists, it is returned
     */
    addLayer: function(name) {      
      var result = createLayer.call(this, name);

      if(result.newLayer) {
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
     * Adds a new [layer](@@layer@@) to the viewport after an existing [layer](@@layer@@)
     *
     * @param {String} name Id of the new [layer](@@layer@@)
     * @param {String} after Id of the existing [layer](@@layer@@)
     *
     * @return {Object} [layer](@@layer@@) that was just created. If the layer already exists, it is returned
     */
    addLayerAfter: function(name, after) {
      var result = createLayer.call(this, name);

      if(result.newLayer) {
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
     * Adds a new [layer](@@layer@@) to the viewport before an existing [layer](@@layer@@)
     *
     * @param {String} name Id of the new [layer](@@layer@@)
     * @param {String} before Id of the existing [layer](@@layer@@)
     *
     * @return {Object} [layer](@@layer@@) that was just created. If the layer already exists, it is returned
     */
    addLayerBefore: function(name, before) {
      var result = createLayer.call(this, name);

      if(result.newLayer) {
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
     * Gets all the [layer](@@layer@@) objects
     *
     * @return {Array} An array with all the [layers](@@layer@@)
     */
    getLayers: function() {
      return this.layers;
    },
    /**
     * --------------------------------
     */
    
    /**
     * <p style='color:#AD071D'><strong>changeLayer</strong></p>
     *
     * Change [layer](@@layer@@) position in it's collection
     *
     * @param {String} [name] Name of of the [layer](@@layer@@) to change
     * @param {Number} [index] Index to put the selected [layer](@@layer@@) in
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
     * Removes the specified [layer](@@layer@@) from the viewport
     *
     * @param  {String} name Id of the [layer](@@layer@@) to remove
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
     * Remove all [layers](@@layer@@) from the viewport
     */
    removeAllLayers: function() {
      var layer;

      var gos = [];

      while (this.layers.length != 0) {
        gos = gos.concat(this.layers.pop().removeAll());
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
     * Add a [game-object](@@game-object@@) to the specified [layer](@@layer@@) of the viewport
     *
     * @param {String} layerName Id of the [layer](@@layer@@) to add the [game-object](@@game-object@@) to
     * @param {Object} go        [game-object](@@game-object@@) to add
     */
    addGameObject: function(layerName, go) {
      var layer = findLayer.call(this, layerName);
      var success = layer.add(go);
      
      if (success) {
        go.on(go.RECYCLE, this, function(g) {
          layer.remove(g);
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
     * Remove the specified [game-object](@@game-object@@) from the specified [layer](@@layer@@) of the viewport
     *
     * @param {String} layerName Id of the [layer](@@layer@@) to remove the [game-object](@@game-object@@) from
     * @param {Object} go        [game-object](@@game-object@@) to remove
     */
    removeGameObject: function(layerName, go) {
      // Remove it from the old layer
      findLayer.call(this, layerName).remove(go);
      recycleGameObjects(go);
    },
    /**
     * --------------------------------
     */
    
    /**
     * <p style='color:#AD071D'><strong>moveGameObject</strong></p>
     *
     * Move a [game-object](@@game-object@@) to the specified [layer](@@layer@@) of the viewport
     *
     * @param {String} oldLayerName Id of the old [layer](@@layer@@) the [game-object](@@game-object@@) belonged to
     * @param {String} newLayerName Id of the new [layer](@@layer@@) the [game-object](@@game-object@@) will belong to
     * @param {Object} go        [game-object](@@game-object@@) to move
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
     * Remove all [game-objects](@@game-object@@) from the viewport
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
     * Draw all the [game-objects](@@game-object@@) in the viewport
     *
     * @param  {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
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
     * Make all the [layers](@@layer@@) in the viewport visible
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
     * Make all the [layers](@@layer@@) in the viewport invisible
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
     * @param  {Object}  go [game-object](@@game-object@@) to test
     * @param  {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
     *
     * @return {Boolean} Whether the [game-object](@@game-object@@) is in the visible area of the viewport or not
     */
    isGameObjectInside: function(go, context) {
			if (!go.renderer) {
				// If there is no renderer, just tell the game object it is not visible in this viewport
				go.setViewportVisibility(this.name, false);
			}
			else {
				// If there is a renderer do some setup...
				r = go.renderer;
	      m = go.matrix;

	      rOffsetX = r.rendererOffsetX();
	      rOffsetY = r.rendererOffsetY();
	      rWidth = r.rendererWidth();
	      rHeight = r.rendererHeight();

				if (this.Culling) {
					// If the viewport is performing culling logic...
					// Do a collision test between the viewport and the game object

					// Build the viewport collider
		      viewportCollider.points[0].x = -this.x;
		      viewportCollider.points[0].y = -this.y;

		      viewportCollider.points[1].x = -this.x + this.Width;
		      viewportCollider.points[1].y = -this.y;

		      viewportCollider.points[2].x = -this.x + this.Width;
		      viewportCollider.points[2].y = -this.y + this.Height;

		      viewportCollider.points[3].x = -this.x;
		      viewportCollider.points[3].y = -this.y + this.Height;

		      // Get the world coordinates of the game object corners
		      p1 = m.transformPoint(rOffsetX, rOffsetY, p1);
		      p2 = m.transformPoint(rOffsetX + rWidth, rOffsetY, p2);
		      p3 = m.transformPoint(rOffsetX + rWidth, rOffsetY + rHeight, p3);
		      p4 = m.transformPoint(rOffsetX, rOffsetY + rHeight, p4);

		      // Build the game object collider with the world positions of it's corners, adjusting for the scale if the viewport
		      gameObjectCollider.points[0].x = p1.x * this.ScaleX;
		      gameObjectCollider.points[0].y = p1.y * this.ScaleY;

		      gameObjectCollider.points[1].x = p2.x * this.ScaleX;
		      gameObjectCollider.points[1].y = p2.y * this.ScaleY;

		      gameObjectCollider.points[2].x = p3.x * this.ScaleX;
		      gameObjectCollider.points[2].y = p3.y * this.ScaleY;

		      gameObjectCollider.points[3].x = p4.x * this.ScaleX;
		      gameObjectCollider.points[3].y = p4.y * this.ScaleY;

		      viewportCollider.recalc();
		      gameObjectCollider.recalc();

		      // Test if the viewport is colliding with the game object, and tell the game object if it is visible in this viewport or not
		      go.setViewportVisibility(this.name, SAT.testPolygonPolygon(viewportCollider, gameObjectCollider));
				} else {
					// If the viewport is not performing culling logic...
					// Do a collision test between the canvas and the game object

					// Build the collider for the canvas
					canvasCollider.points[0].x = 0;
		      canvasCollider.points[0].y = 0;

		      canvasCollider.points[1].x = context.canvas.width;
		      canvasCollider.points[1].y = 0;

		      canvasCollider.points[2].x = context.canvas.width;
		      canvasCollider.points[2].y = context.canvas.height;

		      canvasCollider.points[3].x = 0;
		      canvasCollider.points[3].y = context.canvas.height;

		      // Get the world coordinates of the game object corners
		      p1 = m.transformPoint(rOffsetX, rOffsetY, p1);
		      p2 = m.transformPoint(rOffsetX + rWidth, rOffsetY, p2);
		      p3 = m.transformPoint(rOffsetX + rWidth, rOffsetY + rHeight, p3);
		      p4 = m.transformPoint(rOffsetX, rOffsetY + rHeight, p4);

		      // Viewports matrix
		      vm = this.getMatrix();
  		
  				// Get the canvas coordinates of the game object's corners to build the game object collider that will work in canvas splace
					p1 = vm.transformPoint(p1.x, p1.y, p1);
					p2 = vm.transformPoint(p2.x, p2.y, p2);
					p3 = vm.transformPoint(p3.x, p3.y, p3);
					p4 = vm.transformPoint(p4.x, p4.y, p4);

					gameObjectCollider.points[0].x = p1.x;
		      gameObjectCollider.points[0].y = p1.y;

		      gameObjectCollider.points[1].x = p2.x;
		      gameObjectCollider.points[1].y = p2.y;

		      gameObjectCollider.points[2].x = p3.x;
		      gameObjectCollider.points[2].y = p3.y;

		      gameObjectCollider.points[3].x = p4.x;
		      gameObjectCollider.points[3].y = p4.y;

		      canvasCollider.recalc();
					gameObjectCollider.recalc();

					// Test if the canvas is colliding with the game object, and tell the game object if it is visible in the canvas or not
					go.setViewportVisibility(this.name, SAT.testPolygonPolygon(canvasCollider, gameObjectCollider));
				}	
			}

			return go.getViewportVisibility(this.name);
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>isPointInside</strong></p>
     *
     * @param  {Number}  x X coordinate
     * @param  {Number}  y Y coordinate
     *
     * @return {Boolean}   Whether the coordinates given are inside the viewport or not
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
     * Check whether the specified [layer](@@layer@@) exists
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
     * Makes the specified [layer](@@layer@@) visible
     *
     * @param  {String} name Id of an existing [layer](@@layer@@)
     */
    showLayer: function(name) {
      findLayer.call(this, name).show();
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>hideLayer</strong></p>
     *
     * Makes the specified [layer](@@layer@@) invisible
     *
     * @param  {String} name Id of an existing [layer](@@layer@@)
     */
    hideLayer: function(name) {
      findLayer.call(this, name).hide();
    },
    /**
     * --------------------------------
     */
    
    /**
     * <p style='color:#AD071D'><strong>getMatrix</strong></p>
     *
     * Get the concatenated [matrix-3x3](@@matrix-3x3@@) for this viewport
     * 
     * @return {Object} The concatenated [matrix-3x3](@@matrix-3x3@@)
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
     * @param  {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
     */
    transformContext: function(context) {
      // Translate to adjust for the current [viewport](@@viewport@@)
      context.translate(this.x + this.OffsetX, this.y + this.OffsetY);
      // Scale to adjust for the current [viewport](@@viewport@@)
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

  Object.defineProperty(Viewport.prototype, "ADD", { get: function() { return 'add'; } });
  Object.defineProperty(Viewport.prototype, "REMOVE", { get: function() { return 'remove'; } });
  Object.defineProperty(Viewport.prototype, "CHANGE", { get: function() { return 'change'; } });
  Object.defineProperty(Viewport.prototype, "REMOVE_ALL", { get: function() { return 'remove_all'; } });

  var defineNumberGetterAndSetter = function(name) {
  	var prop = name.replace(/^./, name.charAt(0).toLowerCase()); 

  	Object.defineProperty(Viewport.prototype, name, { 
	    get: function() { return Number(this[prop]); },
	    set: function(value) { this[prop] = value; } 
	  });
  }

  var defineBooleanGetterAndSetter = function(name) {
  	var prop = name.replace(/^./, name.charAt(0).toLowerCase());

  	Object.defineProperty(Viewport.prototype, name, { 
	    get: function() { return this[prop]; },
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

    if (layer) 
      return { layer:layer, newLayer:false }; 
      
    return { layer:new Layer(name, this), newLayer:true };
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

