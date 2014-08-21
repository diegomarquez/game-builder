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
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module defines a viewport, it has an offset in relation to the top left of the screen, a width and height, and the position
 * of the world it is viewing. It is a rectangle.
 *
 * Aside from that it holds an array of [layer](@@layer@@) objects each with the [game-objetcs](@@game-objetc@@) that this
 * viewport should draw.
 */

/**
 * A little window
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate", "layer", "matrix-3x3", "sat", "vector-2D", "error-printer"], function(Delegate, Layer, Matrix, SAT, Vector2D, ErrorPrinter){
  var p1 = {};
  var p2 = {};
  var p3 = {};
  var p4 = {};
  var m = null;
  var r = null;
  var rOffsetX, rOffsetY, rWidth, rHeight;
  var x, y, w, h;

  var viewportCollider = new SAT.FixedSizePolygon(
    new Vector2D(),
    [ new Vector2D(),new Vector2D(),new Vector2D(),new Vector2D() ]
  );

  var gameObjectCollider = new SAT.FixedSizePolygon(
    new Vector2D(),
    [ new Vector2D(),new Vector2D(),new Vector2D(),new Vector2D() ]
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
     */
    init: function(name, width, height, offsetX, offsetY) {
      this.name = name;

      this.x = 0;
      this.y = 0;

      this.scaleX = 1;
      this.scaleY = 1;

      this.offsetX = offsetX;
      this.offsetY = offsetY;

      this.width = width;
      this.height = height;

      this.layers = [];

      this.matrix = new Matrix();
      
      this.visible = true;
      this.registerMouseEvents = true;
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
      this.strokeWidth = width;
      this.strokeColor = color;
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
     */
    addLayer: function(name) {
      var layer = new Layer(name, this);
      this.layers.push(layer);
      return layer;
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
        if (this.layers[i].name == name) {
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

      for (var i = 0; i < this.layers.length; i++) {
        layer = this.layers.pop();
        layer.removeAll();
      }
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>addGameObject</strong></p>
     *
     * Add a [game-object](@@game-object@@) to the specified [layer](@@layer@@) of the viewport
     *
     * @param {String} layerName Id of the layer to add the [game-object](@@game-object@@) to
     * @param {Object} go        [game-object](@@game-object@@) to add
     */
    addGameObject: function(layerName, go) {
      var layer = findLayer.call(this, layerName);

      layer.add(go);

      go.on(go.RECYCLE, this, function(g) {
        layer.remove(g);
      }, true);
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
      for (var i = 0; i < this.layers.length; i++) {
        this.layers[i].removeAll();
      }
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>draw</strong></p>
     *
     * Draw all the [game-objects](@@game-object@@) in the viewport
     *
     * @param  {Context 2D} context [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
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
     * <p style='color:#AD071D'><strong>mouseEnabled</strong></p>
     *
     * @returns {Boolean} Wether or not this viewport responds to mouse events
     */
    mouseEnabled: function() {
      return this.registerMouseEvents;
    },
    /**
     * --------------------------------
     */

    /**
     * <p style='color:#AD071D'><strong>isGameObjectInside</strong></p>
     *
     * @param  {Object}  go [game-object](@@game-object@@) to test
     *
     * @return {Boolean} Whether the [game-object](@@game-object@@) is in the visible area of the viewport or not
     */
    isGameObjectInside: function(go) {
      if (!go.renderer) return;

      r = go.renderer;
      m = go.matrix;

      rOffsetX = r.rendererOffsetX();
      rOffsetY = r.rendererOffsetY();
      rWidth = r.rendererWidth();
      rHeight = r.rendererHeight();

      // Viewport collider
      viewportCollider.points[0].x = -this.x;
      viewportCollider.points[0].y = -this.y;

      viewportCollider.points[1].x = -this.x + this.width;
      viewportCollider.points[1].y = -this.y;

      viewportCollider.points[2].x = -this.x + this.width;
      viewportCollider.points[2].y = -this.y + this.height;

      viewportCollider.points[3].x = -this.x;
      viewportCollider.points[3].y = -this.y + this.height;

      p1 = m.transformPoint(rOffsetX, rOffsetY, p1);
      p2 = m.transformPoint(rOffsetX + rWidth, rOffsetY, p2);
      p3 = m.transformPoint(rOffsetX + rWidth, rOffsetY + rHeight, p3);
      p4 = m.transformPoint(rOffsetX, rOffsetY + rHeight, p4);

      // Game Object collider
      gameObjectCollider.points[0].x = p1.x * this.scaleX;
      gameObjectCollider.points[0].y = p1.y * this.scaleY;

      gameObjectCollider.points[1].x = p2.x * this.scaleX;
      gameObjectCollider.points[1].y = p2.y * this.scaleY;

      gameObjectCollider.points[2].x = p3.x * this.scaleX;
      gameObjectCollider.points[2].y = p3.y * this.scaleY;

      gameObjectCollider.points[3].x = p4.x * this.scaleX;
      gameObjectCollider.points[3].y = p4.y * this.scaleY;

      viewportCollider.recalc();
      gameObjectCollider.recalc();

      return SAT.testPolygonPolygon(viewportCollider, gameObjectCollider);
    },

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
      this.matrix.prependTransform(this.x + this.offsetX, this.y + this.offsetY, this.scaleX, this.scaleY, 0, 0, 0, 1);
      return this.matrix;
    },
    /**
     * --------------------------------
     */
    }
    /**
     * --------------------------------
     */
  });

  var findLayer = function(name) {
    for (var i = 0; i < this.layers.length; i++) {
      if (this.layers[i].name == name) {
        return this.layers[i];
      }
    }

    ErrorPrinter.printError('Viewport', 'Layer with id:' + name + ' does not exist.');
  }

  return Viewport;
});
