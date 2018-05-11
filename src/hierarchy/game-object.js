/**
 * # game-object.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [delegate](@@delegate@@)
 *
 * Depends of:
 * [matrix-3x3](@@matrix-3x3@@)
 * [game-object-debug-draw](@@game-object-debug-draw@@)
 * [util](@@util@@)
 * [component-finder](@@component-finder@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This is the main thing in [Game-Builder](http://diegomarquez.github.io/game-builder). Everything
 * that you do will most likely be an extension of this, or something that creates objects like this one.
 *
 * ### Main features are:
 *
 * Attaching [component](@@component@@) objects and a [renderer](@@renderer@@)
 * object. Why only one renderer? Because I thought it made more sense to have only one renderer for each type of object.
 *
 * Support for affine transformations thanks to the [matrix-3x3](@@matrix-3x3@@) module.
 *
 * These objects extend [delegate](@@delegate@@) so they provide a few events to hook into:
 *
 * ### **START**
 * When the game object is started
 *
 * Registered callbacks get the game object as argument
 * ``` javascript
 * gameObject.on(gameObject.START, function(gameObject) {});
 * ```
 *
 * </br>
 *
 * ### **RECYCLE**
 * When a game object is sent back to the game object pool.
 * This happens before destroying properties in the object.
 *
 * Registered callbacks get the game object as argument
 * ``` javascript
 * gameObject.on(gameObject.RECYCLE, function(gameObject) {});
 * ```
 *
 * </br>
 *
 * ### **CLEAR**
 * When a game object is sent back to the game object pool.
 * This happens after destroying properties in the object.
 *
 * ``` javascript
 * gameObject.on(gameObject.CLEAR, function() {});
 * ```
 *
 * </br>
 *
 * ### **ADD**
 * When a game object is added to a parent [game-object-container](@@game-object-container@@)
 * The parent is sent to the registered callbacks as argument
 *
 * ``` javascript
 * gameObject.on(gameObject.ADD, function(parent) {});
 * ```
 *
 * </br>
 *
 * ### **REMOVE**
 * When a game object is removed from a parent [game-object-container](@@game-object-container@@)
 * The parent is sent to the registered callbacks as argument
 *
 * ``` javascript
 * gameObject.on(gameObject.REMOVE, function(parent) {});
 * ```
 *
 * </br>
 *
 * ### **ADD_TO_VIEWPORT**
 * When a game object is added to a [viewport](@@viewport@@) + [layer](@@layer@@) pair
 *
 * An object that looks like this ``` [{viewport: 'ViewportName', layer:'LayerName'}] ```
 * is sent to all the registered callbacks as an argument
 *
 * ``` javascript
 * gameObject.on(gameObject.ADD_TO_VIEWPORT, function(v) {});
 * ```
 *
 * </br>
 *
 * ### **REMOVE_FROM_VIEWPORT**
 * When a game object is removed from a [viewport](@@viewport@@) + [layer](@@layer@@) pair
 *
 * An object that looks like this ``` [{viewport: 'ViewportName', layer:'LayerName'}] ```
 * is sent to all the registered callbacks as an argument
 *
 * ``` javascript
 * gameObject.on(gameObject.REMOVE_FROM_VIEWPORT, function(v) {});
 * ```
 *
 * </br>
 *
 * ### **HIDE**
 * When a game object calls it's **hide** method
 *
 * Registered callbacks get the game object as argument
 *
 * ``` javascript
 * gameObject.on(gameObject.HIDE, function(gameObject) {});
 * ```
 *
 * </br>
 *
 * ### **SHOW**
 * When a game object calls it's **show** method
 *
 * Registered callbacks get the game object as argument
 *
 * ``` javascript
 * gameObject.on(gameObject.SHOW, function(gameObject) {});
 * ```
 *
 * </br>
 *
 * ### **STOP**
 * When a game object calls it's **stop** method
 *
 * Registered callbacks get the game object as argument
 *
 * ``` javascript
 * gameObject.on(gameObject.STOP, function(gameObject) {});
 * ```
 *
 * </br>
 *
 * ### **RUN**
 * When a game object calls it's **run** method
 *
 * Registered callbacks get the game object as argument
 *
 * ``` javascript
 * gameObject.on(gameObject.RUN, function(gameObject) {});
 * ```
 */

/**
 * Main building block
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate", "matrix-3x3", "game-object-debug-draw", "util", "component-finder"], function(Delegate, Matrix, DebugDraw, Util, ComponentFinder) {

	var GameObject = Delegate.extend({
		init: function() {
			this._super();
			// ### Game Objects have a bunch of properties

			/*
			 * Any of the following properties can be set when configuring the
			 * [game-object-pool](@@game-object-pool@@), like so:
			 *
			 * ``` javascript
			 * gb.goPool.createConfiguration("GameObject_1", "GameObject")
				.args({
					x: 0,
					y: 0
			 *	});
			 * ```
			 *
			 * If you are extending this base object, the properties of your
			 * object can also be set in the same way.
			 *
			 * You can also choose not to do that, and set the properties after
			 * requesting a game object to the [assembler](@@assembler@@) module.
			 */

			// A unique identifier assigned when the game object is built by the [assembler](@@assembler@@) module
			// It changes every time the game object is recycled
			this.uid = null;
			// The parent [game-object-container](@@game-object-container@@).
			this.parent = null;
			// [matrix-3x3](@@matrix-3x3@@) used to control affine transformations.
			this.matrix = new Matrix();
			// List of [components](@@component@@) attached.
			this.components = null;
			// The [renderer](@@renderer@@) attached.
			this.renderer = null;

			// Pair of local coordinates. This coordinates are relative to the
			// parent [game-object-container](@@game-object-container@@).
			this.x = 0;
			this.y = 0;
			// Registration point. Ussually 0, 0 means top left corner.
			this.centerX = 0;
			this.centerY = 0;
			// Rotation.
			this.rotation = 0;
			//Scale.
			this.scaleX = 1;
			this.scaleY = 1;
			//Alpha / Opacity.
			this.alpha = 1;
			// Offset to the corresponding [viewport](@@viewport@@)
			this.viewportOffsetX = 0;
			this.viewportOffsetY = 0;

			// The type id, is the id of the configuration that was used to put together this game object.
			// Set in the [game-object-pool](@@game-object-pool@@).
			// Very usefull to identify game objects
			this.typeId = null;
			// The pool id, is the id of the pool this game object came from. Not so usefull
			this.poolId = null;

			// These two properties are used by [layers](@@layer@@) to turn on and off activity
			// If this is true the game object will update.
			this.canUpdate = false;
			// if this is true the game object will render.
			this.canDraw = false;

			// This object can be queried to tell whether this game-object is visible in a [viewport](@@viewport@@) or not
			// It's values are set in the method **isGameObjectInside** of the [viewport](@@viewport@@) module.
			this.viewportVisibility = {}
			// An array with the names of all the viewports this game objects is being renderer in.
			// This property is set by the [layer](@@layer@@) objects held by [viewports](@@viewport@@)
			this.viewports = [];
			// The current update [group](@@group@@) of this game object. This property is set when the game object is added to a [group](@@group@@)
			this.updateGroup = null;

			// Color that will be used to draw a little shape to outline the position if the **debug**
			// property of [gb](@@gb@@) is set to true;
			this.debugColor = "#FF00FF";

			// This boolean signals that a transformation has taken place and hence the object can be drawn afterwards.
			// If an object tries to draw itself before a transformation has occured, the drawing will be skipped to avoid graphical glitches.
			// It can also be used when a component is added dynamically, to prevetn executing logic
			// in the update loop until the parent [game-object](@@game-object@@) has been transformed for
			// the first time
			this.isTransformed = false;

			this.decomposed = null;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>reset</strong></p>
		 *
		 * Not so interesting mehtod, it just resets some properties right
		 * before the [assembler](@@assembler@@) module starts putting together
		 * a game object.
		 */
		reset: function() {
			this.uid = null;
			this.rotation = 0;
			this.scaleX = 1;
			this.scaleY = 1;
			this.alpha = 1;
			this.viewportOffsetX = 0;
			this.viewportOffsetY = 0;
			this.centerX = 0;
			this.centerY = 0;
			this.viewportVisibility = {}
			this.viewports = [];
			this.updateGroup = null;
			this.isChildInContainer = false;
			this.isTransformed = false;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>added</strong></p>
		 *
		 * Executed when the game-object is added to a [game-object-container](@@game-object-container@@)
		 *
		 * @param {Object} [parent] The new parent [game-object-container](@@game-object-container@@)
		 */
		added: function(parent) {
			this.isTransformed = false;
			this.execute(this.ADD, this);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removed</strong></p>
		 *
		 * Executed when the [game-object](@@game-object@@) is removed from it's [game-object-container](@@game-object-container@@)
		 *
		 * @param {Object} [parent] The old parent [game-object-container](@@game-object-container@@)
		 */
		removed: function(parent) {
			this.execute(this.REMOVE, this);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * This mehtod needs to be called in order for the game object
		 * to start updating and rendering.
		 */
		start: function() {
			this.canUpdate = true;
			this.canDraw = true;

			if (this.renderer) {
				this.renderer.onStarted(this);
			}

			if (this.components) {
				for (var i = 0; i < this.components.length; i++) {
					this.components[i].onStarted(this);
				}
			}

			this.execute(this.START, this);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>update</strong></p>
		 *
		 * Called in each update cycle.
		 *
		 * @param {Number} delta Time ellapsed since the last update cycle
		 */
		update: function(delta) {},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>recycle</strong></p>
		 *
		 * This method is supposed to be redifined by objects extending this one.
		 * All the logic concerning clearing references should go in here.
		 */
		recycle: function() {
			this.execute(this.RECYCLE, this);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>configure</strong></p>
		 *
		 * Sets up the properties that were previously configured
		 * in the [game-object-pool](@@game-object-pool@@)
		 *
		 * @param {Object} args Object which properties will be used to set values on this game object
		 */
		configure: function(args) {
			if (!args) return;

			for (var ha in args) {
				this[ha] = args[ha];

				if (Util.isObject(args[ha])) {
					var getter = args[ha]['_get'];
					var setter = args[ha]['_set'];

					if (getter || setter) {
						if (Util.isFunction(getter)) {
							Util.defineGetter(this, ha, getter);
						}

						if (Util.isFunction(setter)) {
							Util.defineSetter(this, ha, setter);
						}
					} else {
						this[ha] = args[ha];
					}
				} else {
					this[ha] = args[ha];
				}
			}

			this.args = args;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>setRenderer</strong></p>
		 *
		 * Sets the [renderer](@@renderer@@) and notifies it, through the **onAdded**
		 * callback.
		 *
		 * @param {Object} renderer [renderer](@@renderer@@) added
		 */
		setRenderer: function(renderer) {
			if (!renderer) return;

			this.renderer = renderer;
			this.renderer.onAdded(this);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeRenderer</strong></p>
		 *
		 * Removes the [renderer](@@renderer@@), and notifies it through the **onRemove**
		 * and **onRecycled** callbacks.
		 */
		removeRenderer: function() {
			if (!this.renderer) return;

			this.renderer.onRemoved(this);
			this.renderer.onRecycled();
			this.renderer = null;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>addComponent</strong></p>
		 *
		 * Adds a component and notifies it was added through the **onAdded** callback.
		 *
		 * @param {Object} component [component](@@component@@) added
		 */
		addComponent: function(component) {
			if (!this.components) {
				this.components = [];
			}

			if (component.parent) {
				component.parent.removeComponent(component);
			}

			this.components.push(component);
			component.onAdded(this);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeComponent</strong></p>
		 *
		 * Removes a [component](@@component@@), and notifies it,
		 * it was removed through the **onRemoved** callback.
		 *
		 * @param {Object} component [component](@@component@@) to remove
		 */
		removeComponent: function(component) {
			if (!this.components) return;

			var index = this.components.indexOf(component);

			if (index != -1) {
				this.components.splice(index, 1);
				component.onRemoved(this);
				component.onRecycled(this);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeComponents</strong></p>
		 *
		 * Removes [components](@@component@@).
		 *
		 * @param {Array} [toRemove=null] Optional array of [components](@@component@@) to remove, if not specified all [components](@@component@@) are removed
		 */
		removeComponents: function(toRemove) {
			if (!this.components) return;

			if (toRemove && Util.isArray(toRemove)) {
				for (var i = 0; i < toRemove.length; i++) {
					this.removeComponent(toRemove[i]);
				}
			} else {
				for (var i = this.components.length - 1; i >= 0; i--) {
					this.removeComponent(this.components[i]);
				}
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>findComponents</strong></p>
		 *
		 * Get a reference to the [component-finder](@@component-finder@@) object, to search for [components](@@component@@) in the game object
		 *
		 * @return {Object}
		 */
		findComponents: function() {
			return ComponentFinder.user(this);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>transform</strong></p>
		 *
		 * Generates the concatenated [matrix-3x3](@@matrix-3x3@@) used to draw itself in the proper place
		 */
		transform: function(options) {
			this.concatenateMatrix(this.matrix, options);
			this.isTransformed = true;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>draw</strong></p>
		 *
		 * Draws the game-object into the specified Context 2D, using it's [matrix-3x3](@@matrix-3x3@@)
		 *
		 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
		 * @param {Object} viewport The [viewport](@@viewport@@) this objects is being drawn too
		 */
		draw: function(context, viewport) {
			if (!this.isTransformed) return;

			context.save();

			var m = this.getMatrix();

			context.transform(m.a, m.b, m.c, m.d, m.tx, m.ty);

			if (m.alpha !== 1) {
				context.globalAlpha *= m.alpha;
			}

			if (m.alpha > 0) {
				if (this.renderer && this.renderer.isEnabled()) {
					this.renderer.draw(context, viewport);
				}
			}

			DebugDraw.gameObject(this, context, viewport);

			context.restore();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>hide</strong></p>
		 *
		 * Prevents rendering
		 *
		 * @param {Boolean} [skipEvent=false]
		 */
		hide: function(skipEvent) {
			this.canDraw = false;

			if (!skipEvent) {
				this.execute(this.HIDE, this);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>show</strong></p>
		 *
		 * Enables rendering
		 *
		 * @param {Boolean} [skipEvent=false]
		 */
		show: function(skipEvent) {
			this.canDraw = true;

			if (!skipEvent) {
				this.execute(this.SHOW, this);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>toggleVisibility</strong></p>
		 *
		 * Toggle rendering
		 *
		 * @param {Boolean} [skipEvent=false]
		 */
		toggleVisibility: function(skipEvent) {
			this.canDraw = !this.canDraw;

			if (!skipEvent) {
				if (this.canDraw) {
					this.execute(this.SHOW, this);
				} else {
					this.execute(this.HIDE, this);
				}
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>stop</strong></p>
		 *
		 * Prevents updating
		 *
		 * @param {Boolean} [skipEvent=false]
		 */
		stop: function(skipEvent) {
			this.canUpdate = false;

			if (!skipEvent) {
				this.execute(this.STOP, this);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>run</strong></p>
		 *
		 * Enables updating
		 *
		 * @param {Boolean} [skipEvent=false]
		 */
		run: function(skipEvent) {
			this.canUpdate = true;

			if (!skipEvent) {
				this.execute(this.RUN, this);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>hasViewport</strong></p>
		 *
		 * Wheter or not this game-object is part of any viewport
		 *
		 * @return {Boolean}
		 */
		hasViewport: function() {
			return this.viewports.length > 0;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>addToViewport</strong></p>
		 *
		 * Adds the specified viewport and layer combo to the ones this game object belongs to
		 *
		 * @param {String} viewportName Name of the new viewport this object belongs to
		 * @param {String} layerName Name of the layer in the specified viewport
		 *
		 */
		addToViewportList: function(viewportName, layerName) {
			var v = {
				viewport: viewportName,
				layer: layerName
			}
			this.viewports.push(v);
			this.execute(this.ADD_TO_VIEWPORT, [v]);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeFromViewport</strong></p>
		 *
		 * Removes the viewport and layer combo from the ones this game object belongs to
		 *
		 * @param {String} viewportName Name of the viewport to remove from this game objects list
		 * @param {String} layerName Name of the layer in the specified viewport
		 *
		 */
		removeFromViewportList: function(viewportName, layerName) {
			for (var i = this.viewports.length - 1; i >= 0; i--) {
				var v = this.viewports[i];

				if (v.viewport === viewportName && v.layer === layerName) {
					this.viewports.splice(i, 1);
					this.execute(this.REMOVE_FROM_VIEWPORT, [v]);
				}
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>setViewportVisibility</strong></p>
		 *
		 * Set the visible state of the game-object in the specified viewport
		 * This is for checking purposes only, it doesn't actually affect the rendering
		 *
		 * @param {String} viewportName The name of the [viewport](@@viewport@@) to associate visibility with
		 * @param {Boolean} visible Wheter the game-object is visible or not in the specified [viewport](@@viewport@@)
		 */
		setViewportVisibility: function(viewportName, visible) {
			this.viewportVisibility[viewportName] = visible;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getViewportVisibility</strong></p>
		 *
		 * @param {String} viewportName The name of the [viewport](@@viewport@@) to get the visibility state from
		 *
		 * @return {Boolean} Wheter the game-object is visible or not in the specified [viewport](@@viewport@@)
		 */
		getViewportVisibility: function(viewportName) {
			return this.viewportVisibility[viewportName];
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getViewportList</strong></p>
		 *
		 * @return {Array} An array with all the [viewport](@@viewport@@) and [layer](@@layer@@) combinations this game object belongs to
		 */
		getViewportList: function() {
			var go = this;

			while (!go.viewports || go.viewports.length == 0) {
				go = go.parent;
				result = go.viewports;

				if (result && result.length > 0) {
					return result;
				}
			}

			return this.viewports;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getUpdateGroup</strong></p>
		 *
		 * @return {String} The update [group](@@group@@) this game object belongs to. If it has no update group, check it's parent recursively until a group is fround
		 */
		getUpdateGroup: function() {
			var go = this;

			while (!go.updateGroup) {
				go = go.parent;
			}

			return go.updateGroup;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>clear</strong></p>
		 *
		 * This is called to send back a game object and all of it's parts to their
		 * respective pools. This method is used by the [reclaimer](@@reclaimer@@) module.
		 */
		clear: function() {
			this.recycle();

			this.execute(this.CLEAR, this);

			this.removeRenderer();
			this.removeComponents();
			this.hardCleanUp();

			this.canUpdate = false;
			this.canDraw = false;
			this.parent = null;

			this.typeId = null;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>resetTransform</strong></p>
		 *
		 * Sets all the properties of the game object to the specified values,
		 * assuming defaults if not specified.
		 *
		 * @param {Number} x Local X coordinate
		 * @param {Number} y Local Y coordinate
		 * @param {Number} scaleX Scale on the X axis
		 * @param {Number} scaleY Scale on the Y axis
		 * @param {Number} rotation Rotation in degrees
		 * @param {Number} centerX Registration point X coordinate. This value is added to the x coordinate.
		 * @param {Number} centerY Registration point Y coordinate. This value is added to the x coordinate.
		 */
		resetTransform: function(x, y, scaleX, scaleY, rotation, centerX, centerY) {
			this.x = x || 0;
			this.y = y || 0;
			this.scaleX = scaleX == null ? 1 : scaleX;
			this.scaleY = scaleY == null ? 1 : scaleY;
			this.rotation = rotation || 0;
			this.centerX = centerX || 0;
			this.centerY = centerY || 0;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>setTransform</strong></p>
		 *
		 * Sets all the properties of the game object to the specified values,
		 * ommiting unspecified properties
		 *
		 * @param {Number} x Local X coordinate
		 * @param {Number} y Local Y coordinate
		 * @param {Number} scaleX Scale on the X axis
		 * @param {Number} scaleY Scale on the Y axis
		 * @param {Number} rotation Rotation in degrees
		 * @param {Number} centerX Registration point X coordinate. This value is added to the x coordinate.
		 * @param {Number} centerY Registration point Y coordinate. This value is added to the x coordinate.
		 */
		setTransform: function(x, y, scaleX, scaleY, rotation, centerX, centerY) {
			if (x) this.x = x;
			if (y) this.y = y;

			if (scaleX) this.scaleX = scaleX;
			if (scaleY) this.scaleY = scaleY;

			if (rotation) this.rotation = rotation;

			if (centerX) this.centerX = centerX;
			if (centerY) this.centerY = centerY;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>concatenateMatrix</strong></p>
		 *
		 * Get's the complete concatenated [matrix-3x3](@@matrix-3x3@@) of the game object.
		 *
		 * options argument if provided should look like this
		 *
		 * ``` javascript
		 	{
		 		// Setting this to true will get the concatenated matrix, with out taking into account the viewportOffset variables
				noViewportOffsets: true
		 	}
		 * ```
		 *
		 * @param {[matrix-3x3](@@matrix-3x3@@)} m A matrix object into which to put result.
		 * @param {Object} [options=null] Options to apply when concatenating the matrix.
		 *
		 * @return {Object} The concatenated [matrix-3x3](@@matrix-3x3@@)
		 */
		concatenateMatrix: function(m, options) {
			if (m) {
				m.identity();
			} else {
				m = new Matrix()
					.identity();
			}

			var go = this;

			while (go != null) {
				if (options) {
					if (options.noViewportOffsets) {
						m.prependTransform(go.x, go.y, go.scaleX, go.scaleY, go.rotation, go.centerX, go.centerY, this.alpha);
						go = go.parent;
						continue;
					}
				}

				m.prependTransform(go.x + go.viewportOffsetX, go.y + go.viewportOffsetY, go.scaleX, go.scaleY, go.rotation, go.centerX, go.centerY, this.alpha);
				go = go.parent;
			}

			return m;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getMatrix</strong></p>
		 *
		 * @return {[matrix-3x3](@@matrix-3x3@@)} The concatenated matrix of this game object
		 */
		getMatrix: function() {
			return this.matrix;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getTransform</strong></p>
		 *
		 * This will get an object with the properties that the [matrix-3x3](@@matrix-3x3@@)
		 * is describing. This is usefull to get the absolute position of a game object
		 * at any given point.
		 *
		 * options argument if provided should look like this
		 *
		 * ``` javascript
		 	{
		 		// Setting this to true will get the concatenated matrix, with out taking into account the viewportOffset variables
				noViewportOffsets: true
		 	}
		 * ```
		 *
		 * @param {Object} r On object into which to put the result of this operation.
		 * @param {[matrix-3x3](@@matrix-3x3@@)} m matrix object to work with.
		 * @param {Object} [options] Options to apply when concatenating the matrix.
		 *
		 * @return {Object} Contains the individual properties of a trandformation. ej. x, y, rotation, scale
		 */
		getTransform: function(r, m, options) {
			if (m) {
				m.identity();
			} else {
				m = new Matrix()
					.identity();
			}

			var go = this;

			while (go != null) {
				if (options) {
					if (options.noViewportOffsets) {
						m.prependTransform(go.x, go.y, go.scaleX, go.scaleY, go.rotation, go.centerX, go.centerY, this.alpha);
						go = go.parent;
						continue;
					}
				}

				m.prependTransform(go.x + go.viewportOffsetX, go.y + go.viewportOffsetY, go.scaleX, go.scaleY, go.rotation, go.centerX, go.centerY, this.alpha);
				go = go.parent;
			}

			return m.decompose(r);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>localToGlobal</strong></p>
		 *
		 * Convert a point from the game object's local coordinate space to the root global coordinate space
		 *
		 * @param {[matrix-3x3](@@matrix-3x3@@)} m matrix object to work with.
		 * @param {NUmber} x The local x coordinate to transform to global space
		 * @param {NUmber} y The local y coordinate to transform to global space
		 * @param {Object} pt On object into which to put the result of this operation.
		 * @return {Object} An object with the result of the transformation
		 */
		localToGlobal: function(m, x, y, pt) {
			return this.concatenateMatrix(m)
				.transformPoint(x, y, pt || {});
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>globalToLocal</strong></p>
		 *
		 * Convert a point from root global coordinate space to the local coordinate space of this game object
		 *
		 * @param {[matrix-3x3](@@matrix-3x3@@)} m matrix object to work with.
		 * @param {NUmber} x The global x coordinate to transform to local space
		 * @param {NUmber} y The global y coordinate to transform to local space
		 * @param {Object} pt On object into which to put the result of this operation.
		 * @return {Object} An object with the result of the transformation
		 */
		globalToLocal: function(m, x, y, pt) {
			return this.concatenateMatrix(m)
				.invert()
				.transformPoint(x, y, pt || {});
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>hasRenderer</strong></p>
		 *
		 * @return {Boolean} Whether there is a [renderer](@@renderer@@) or not
		 */
		hasRenderer: function() {
			return !!this.renderer;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>hasComponents</strong></p>
		 *
		 * @return {Boolean} Whether there are any [components](@@component@@) or not
		 */
		hasComponents: function() {
			if (this.components) {
				return this.components.length > 0;
			}

			return false;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getComponents</strong></p>
		 *
		 * Gets the array of [component](@@component@@) objects
		 *
		 * @return {Array} [description]
		 */
		getComponents: function() {
			return this.components;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>isContainer</strong></p>
		 *
		 * @return {Boolean} Wheter it is a container object or not
		 */
		isContainer: function() {
			return false;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>typeName</strong></p>
		 *
		 * @return {String} Returns the type name of this object
		 */
		typeName: function() {
			return 'GameObject';
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>isChild</strong></p>
		 *
		 * @return {Boolean} Wheter this game object is a child of a container or not
		 */
		isChild: function() {
			if (!this.parent) {
				return false;
			} else {
				return this.parent.typeName() == 'GameObjectContainer';
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>isPooled</strong></p>
		 *
		 * If the object has a typeId it means it is active, otherwise it must have been recycled
		 *
		 * @return {Boolean}
		 */
		isActive: function() {
			return !!this.typeId;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>isRunning</strong></p>
		 *
		 * Whether the game object is being updated ot not
		 *
		 * @return {Boolean}
		 */
		isRunning: function() {
			return this.canUpdate;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>isRunning</strong></p>
		 *
		 * Whether the game object is being drawn
		 *
		 * @return {Boolean}
		 */
		isDrawing: function() {
			return this.canDraw;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>transformedOnce</strong></p>
		 *
		 * Whether the game object has already gone throw the transformations
		 * of it heriarchy or not
		 *
		 * @return {Boolean}
		 */
		transformedOnce: function() {
			return this.isTransformed;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>debug_draw</strong></p>
		 *
		 * This method is only executed if the **debug** property in [gb](@@gb@@)
		 * is set to true. It is better to leave the drawing to the [renderer](@@renderer@@) components.
		 *
		 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
		 * @param {Object} viewport A reference to the current [viewport](@@viewport@@)
		 * @param {Object} draw A reference to the [draw](@@draw@@) module
		 * @param {Object} gb A reference to the [gb](@@gb@@) module
		 */
		debug_draw: function(context, viewport, draw, gb) {
			if (!gb.gameObjectDebug) return;

			this.decomposed = this.matrix.decompose(this.decomposed);

			// Draw the center of the object
			context.save();
			context.translate(this.decomposed.x, this.decomposed.y);
			draw.circle(context, 0, 0, 2, this.debugColor, null, 1);
			context.restore();
		}
		/**
		 * --------------------------------
		 */
	});

	Object.defineProperty(GameObject.prototype, "X", {
		get: function() {
			return this.x + this.viewportOffsetX;
		}
	});
	Object.defineProperty(GameObject.prototype, "Y", {
		get: function() {
			return this.y + this.viewportOffsetY;
		}
	});

	Object.defineProperty(GameObject.prototype, "START", {
		get: function() {
			return 'start';
		}
	});
	Object.defineProperty(GameObject.prototype, "RECYCLE", {
		get: function() {
			return 'recycle';
		}
	});
	Object.defineProperty(GameObject.prototype, "CLEAR", {
		get: function() {
			return 'clear';
		}
	});
	Object.defineProperty(GameObject.prototype, "ADD", {
		get: function() {
			return 'added';
		}
	});
	Object.defineProperty(GameObject.prototype, "REMOVE", {
		get: function() {
			return 'removed';
		}
	});
	Object.defineProperty(GameObject.prototype, "ADD_TO_VIEWPORT", {
		get: function() {
			return 'added_to_viewport';
		}
	});
	Object.defineProperty(GameObject.prototype, "REMOVE_FROM_VIEWPORT", {
		get: function() {
			return 'removed_from_viewport';
		}
	});

	Object.defineProperty(GameObject.prototype, "HIDE", {
		get: function() {
			return 'hide';
		}
	});
	Object.defineProperty(GameObject.prototype, "SHOW", {
		get: function() {
			return 'show';
		}
	});
	Object.defineProperty(GameObject.prototype, "STOP", {
		get: function() {
			return 'stop';
		}
	});
	Object.defineProperty(GameObject.prototype, "RUN", {
		get: function() {
			return 'run';
		}
	});

	return GameObject;
});
