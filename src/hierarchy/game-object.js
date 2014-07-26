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
 * 
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This is the main thing in [Game-Builder](http://diegomarquez.github.io/game-builder). Everything
 * that you do will most likely be an extension of this, or something that creates objects like this one.
 *
 * ### Main features are: 
 * 
 * Attaching [component](@@component@@) objects and a [renderer](@@renderer@@)
 * object. Why only one renderer? Because honestly, how many times do you need to add more than one
 * thing to be rendered by the same entity?
 *
 * Support for affine transformations thanks to the [matrix-3x3](@@matrix-3x3@@) module.
 * 
 * ### These objects extend [delegate](@@delegate@@) so they provide a few events to hook into:
 *
 * ### **start** 
 * When the game object is started 
 * 
 * Registered callbacks get the game object as argument 
 * ``` javascript  
 * gameObject.on(gameObject.START, function(gameObject) {});
 * ``` 
 *
 * ### **recycle**
 * When a gameObject is sent back to the game object pool. 
 * This happens before destroying properties in the object.
 *
 * Registered callbacks get the game object as argument
 * ``` javascript  
 * gameObject.on(gameObject.RECYCLE, function() {});
 * ```
 *
 * ### **clear**
 * When a gameObject is sent back to the game object pool.
 * This happens after destroying properties in the object.
 * 
 * ``` javascript  
 * gameObject.on(gameObject.CLEAR, function() {});
 * ```
 */

/**
 * Main building block
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate", "matrix-3x3", "game-object-debug-draw"], function(Delegate, Matrix, DebugDraw) {
	var go;

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
			this.rotation = 0;
			this.scaleX = 1;
			this.scaleY = 1;
			this.alpha = 1;
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
				this.renderer.start(this);
			}

			if (this.components) {
				for (var i = 0; i < this.components.length; i++) {
					this.components[i].start(this);
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
				removeComponent(this.components[i]);
			}
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>transform</strong></p>
		 *
		 * Generates the concatenated [matrix-3x3](@@matrix-3x3@@) used to itself in the proper place
		 */
		transform: function() {
			this.getMatrix(this.matrix);
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
		 */
		draw: function(context, viewX, viewY, viewOffsetX, viewOffsetY, viewWidth, viewHeight) {
			if (!this.canDraw) return;

			context.save();

			context.transform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.tx, this.matrix.ty);

			if(this.renderer) {
				this.renderer.draw(context);
			}

			DebugDraw.call(this, context);

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
		 * @param  {Object} [m=new Matrix()] A matrix object into which to put result.
		 *
		 * @return {Object} The concatenated [matrix-3x3](@@matrix-3x3@@)
		 */
		getMatrix: function(m) {
			if (m) {
				m.identity();
			} else {
				m = new Matrix().identity();
			}

			go = this;

			while (go != null) {
				m.prependTransform(go.x, go.y, go.scaleX, go.scaleY, go.rotation, go.centerX, go.centerY);
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
		 * @param  {Object} [r=new Object()] On object into which to put the result of this operation.
		 * @param  {Object} [m=new Matrix()] A matrix object into which put the result.
		 *
		 * @return {Object} Contains the individual properties of a trandformation. ej. x, y, rotation, scale
		 */
		getTransform: function(r, m) {
			if (m) {
				m.identity();
			} else {
				m = new Matrix().identity();
			}

			go = this;

			while (go != null) {
				m.prependTransform(go.x, go.y, go.scaleX, go.scaleY, go.rotation, go.centerX, go.centerY);
				go = go.parent;
			}

			return m.decompose(r);
		}
		/**
		 * --------------------------------
		 */
	});

	// ### Getters for all the types of events a GameObject can hook into
	Object.defineProperty(GameObject.prototype, "START", { get: function() { return 'start'; } });
	Object.defineProperty(GameObject.prototype, "RECYCLE", { get: function() { return 'recycle'; } });
	Object.defineProperty(GameObject.prototype, "CLEAR", { get: function() { return 'clear'; } });

	return GameObject;
});