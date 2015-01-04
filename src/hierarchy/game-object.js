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
 * ### These objects extend [delegate](@@delegate@@) so they provide a few events to hook into:
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
 * * ### **ADD**
 * When a game object is added to a parent [game-object-container](@@game-object-container@@) 
 * The parent is sent to the registered callbacks as argument
 * 
 * ``` javascript  
 * gameObject.on(gameObject.ADD, function(parent) {});
 * ```
 *
 * </br>
 * 
 * * ### **REMOVE**
 * When a game object is removed from a parent [game-object-container](@@game-object-container@@) 
 * The parent is sent to the registered callbacks as argument
 * 
 * ``` javascript  
 * gameObject.on(gameObject.REMOVE, function(parent) {});
 * ```
 *
 * </br>
 * 
 * * ### **ADD_TO_VIEWPORT**
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
 * * ### **REMOVE_FROM_VIEWPORT**
 * When a game object is removed from a [viewport](@@viewport@@) + [layer](@@layer@@) pair
 *
 * An object that looks like this ``` [{viewport: 'ViewportName', layer:'LayerName'}] ```
 * is sent to all the registered callbacks as an argument
 * 
 * ``` javascript  
 * gameObject.on(gameObject.REMOVE_FROM_VIEWPORT, function(v) {});
 * ```
 */

/**
 * Main building block
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate", "matrix-3x3", "game-object-debug-draw", "util"], function(Delegate, Matrix, DebugDraw, Util) {
	var go, r;

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

			// These two properties are used by [layers](@@layers@@) to turn on and off activity
			// on a given [layer](@@layer@@).
			
			// If this is true the game object will update.
			this.canUpdate = false;
			// if this is true the game object will render.
			this.canDraw = false;

			// This object can be queried to tell whether this game-object is visible in a [viewport](@@viewport@@) or not
			// It's values are set in the method isGameObjectInside of the [viewport](@@viewport@@) module.
			this.viewportVisibility = {}
			// An array with the names of all the viewports this game objects is being renderer in.
			// This property is set by the [layer](@@layer@@) objects held by [viewports](@@viewport@@)
			this.viewports = [];
			// The current update [group](@@group@@) of this game object. This property is set when the game object is added to a [group](@@group@@)
			this.updateGroup = null;

			// Color that will be used to draw a little shape to outline the position if the **debug**
			// property of [gb](@@gb@@) is set to true;
			this.debugColor = "#FF00FF";
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

			if(this.renderer) {
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
		 * @param  {Number} delta Time ellapsed since the last update cycle
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
		 * @param  {Object} args Object which properties will be used to set values on this game object
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
			if(!renderer) return;

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
			if(!this.renderer) return;

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
		 * @param  {Object} component [component](@@component@@) to remove
		 */
		removeComponent: function(component) {
			if (!this.components) return;

			var index = this.components.indexOf(component);

			if (index != -1) {
				this.components.splice(index, 1);
				component.onRemoved();
				component.onRecycled();
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeComponents</strong></p>
		 *
		 * Removes all components.
		 */
		removeComponents: function() {
			if (!this.components) return;

			for (var i=this.components.length-1; i>=0; i--) {
				this.removeComponent(this.components[i]);
			}
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>findComponents</strong></p>
		 *
		 * Get an object to query the [component](@@component@@) list of the game object
		 *
		 * @return {Object}  An object to make the query. It has the following methods:
		 * **all** returns all [components](@@components@@) that return true for the specified function. Pass no argument to get all components 
		 * **allWithProp** returns all [components](@@component@@) that have the given property
		 * **allWithType** returns all [components](@@component@@) that have the given id in the [component-pool](@@component-pool@@)
		 * **first** returns the first [component](@@component@@) that returns true for the specified function
		 * **firstWithProp** returns the first [component](@@component@@) that has the given property
		 * **firstWithType** returns the first [components](@@component@@) that have the given id in the [component-pool](@@component-pool@@)
		 */
		findComponents: function() {
			var self = this;

			return {
				all: function(f) {
					if (!self.components) return;

					var r;

					for (var i = 0; i < self.components.length; i++) {
						var c = self.components[i];

						if (!f || f(c)) {
							if (!r) r = [];
							
							r.push(c);
						}
					}

					return r;
				}, 

				allWithProp: function(propName) {
					if (!self.components) return;

					var r;

					for (var i = 0; i < self.components.length; i++) {
						var c = self.components[i];

						if (Boolean(c[propName])) {
							if (!r) r = [];
							
							r.push(c);
						}
					}

					return r;
				},

				allWithType: function(id) {
					if (!self.components) return;

					var r;

					for (var i = 0; i < self.components.length; i++) {
						var c = self.components[i];

						if (c.typeId == id || c.poolId == id) {
							if (!r) r = [];
							
							r.push(c);
						}
					}

					return r;
				},

				first: function(f) {
					if (!self.components) return;

					for (var i = 0; i < self.components.length; i++) {
						var c = self.components[i];

						if (f(c)) {
							return c;
						}
					}		
				},

				firstWithProp: function(propName) {
					if (!self.components) return;

					for (var i = 0; i < self.components.length; i++) {
						var c = self.components[i];

						if (Boolean(c[propName])) {
							return c;
						}
					}
				},

				firstWithType: function(id) {
					if (!self.components) return;
					
					for (var i = 0; i < self.components.length; i++) {
						var c = self.components[i];

						if (c.typeId == id || c.poolId == id) {
							return c;
						}
					}
				}
			}
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
			this.getMatrix(this.matrix, options);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>draw</strong></p>
		 *
		 * Draws the game-object into the specified Context 2D, using it's [matrix-3x3](@@matrix-3x3@@)
		 * 
		 * @param  {Context 2D} context [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
		 * @param  {Object} viewport The [viewport](@@viewport@@) this objects is being drawn too
		 */
		draw: function(context, viewport) {
			context.save();

			context.transform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.tx, this.matrix.ty);
			
			if (this.matrix.alpha != 1) {
				 context.globalAlpha *= this.matrix.alpha;
			}

			if (this.matrix.alpha > 0) {
				if(this.renderer) {
					this.renderer.draw(context, viewport);
				}
			}
			
			DebugDraw.gameObject.call(this, context, viewport);

			context.restore();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>hide</strong></p>
		 *
		 * Prevents rendering
		 */
		hide: function() {
			this.canDraw = false;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>show</strong></p>
		 *
		 * Enables rendering
		 */
		show: function() {
			this.canDraw = true;
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
			var v = { viewport: viewportName, layer: layerName }
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
			for (var i = this.viewports.length-1; i >= 0; i--) {
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
		 * <p style='color:#AD071D'><strong>getViewportList</strong></p>
		 *
		 * @return {String} The update [group](@@group@@) this game object belongs to
		 */
		getUpdateGroup: function() {
			return this.updateGroup;
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
		 * @param  {Number} x        Local X coordinate
		 * @param  {Number} y        Local Y coordinate
		 * @param  {Number} scaleX   Scale on the X axis
		 * @param  {Number} scaleY   Scale on the Y axis
		 * @param  {Number} rotation Rotation in degrees
		 * @param  {Number} centerX  Registration point X coordinate. This value is added to the x coordinate.
		 * @param  {Number} centerY  Registration point Y coordinate. This value is added to the x coordinate.
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
		 * @param  {Number} x        Local X coordinate
		 * @param  {Number} y        Local Y coordinate
		 * @param  {Number} scaleX   Scale on the X axis
		 * @param  {Number} scaleY   Scale on the Y axis
		 * @param  {Number} rotation Rotation in degrees
		 * @param  {Number} centerX  Registration point X coordinate. This value is added to the x coordinate.
		 * @param  {Number} centerY  Registration point Y coordinate. This value is added to the x coordinate.
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
		 * <p style='color:#AD071D'><strong>getMatrix</strong></p>
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
		 * @param  {Object} [m=new Matrix()] A matrix object into which to put result.
		 * @param  {Object} [options=newObject()] Options to apply when concatenating the matrix. 
		 *
		 * @return {Object} The concatenated [matrix-3x3](@@matrix-3x3@@)
		 */
		getMatrix: function(m, options) {
			if (m) {
				m.identity();
			} else {
				m = new Matrix().identity();
			}

			go = this;

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
		 * @param  {Object} [r=new Object()] On object into which to put the result of this operation.
		 * @param  {Object} [m=new Matrix()] A matrix object into which put the result.
		 * @param  {Object} [options=newObject()] Options to apply when concatenating the matrix.
		 *
		 * @return {Object} Contains the individual properties of a trandformation. ej. x, y, rotation, scale
		 */
		getTransform: function(r, m, options) {
			if (m) {
				m.identity();
			} else {
				m = new Matrix().identity();
			}

			go = this;

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
				return !(this.parent.typeName() == 'Group' || this.parent.typeName() == 'Root');
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>debug_draw</strong></p>
		 *
		 * This method is only executed if the **debug** property of the parent [gb](@@gb@@)
		 * is set to true. It is better to leave the drawing to the [renderer](@@renderer@@) components.
		 * 
		 * @param  {Context 2D} context     [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
		 * @param  {Object} viewport A reference to the current [viewport](@@viewport@@)
		 * @param  {Object} draw     A reference to the [draw](@@draw@@) module
		 * @param  {Object} gb     A reference to the [gb](@@gb@@) module
		 */
		debug_draw: function(context, viewport, draw, gb) {
			if(!gb.gameObjectDebug) return;

			r = this.matrix.decompose(r);
				
			// Draw the center of the object
			context.save();
			context.translate(r.x, r.y);
			draw.circle(context, 0, 0, 1, null, this.debugColor, 2);
			context.restore();
		}
		/**
		 * --------------------------------
		 */
	});

	Object.defineProperty(GameObject.prototype, "X", { get: function() { return this.x + this.viewportOffsetX; } });
	Object.defineProperty(GameObject.prototype, "Y", { get: function() { return this.y + this.viewportOffsetY; } });

	// ### Getters for all the types of events a GameObject can hook into
	Object.defineProperty(GameObject.prototype, "START", { get: function() { return 'start'; } });
	Object.defineProperty(GameObject.prototype, "RECYCLE", { get: function() { return 'recycle'; } });
	Object.defineProperty(GameObject.prototype, "CLEAR", { get: function() { return 'clear'; } });
	Object.defineProperty(GameObject.prototype, "ADD", { get: function() { return 'added'; } });
	Object.defineProperty(GameObject.prototype, "REMOVE", { get: function() { return 'removed'; } });
	Object.defineProperty(GameObject.prototype, "ADD_TO_VIEWPORT", { get: function() { return 'added_to_viewport'; } });
	Object.defineProperty(GameObject.prototype, "REMOVE_FROM_VIEWPORT", { get: function() { return 'removed_from_viewport'; } });

	return GameObject;
});