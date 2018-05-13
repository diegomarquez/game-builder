/**
 * # game-object-container.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [game-object](@@game-object@@)
 *
 * Depends of:
 * [visibility-control](@@visibility-control@@)
 * [child-finder](@@child-finder@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This modules defines a container for [game-objects](@@game-object@@), which in turn
 * is a [game-object](@@game-object@@) itself. Being a parent means that all of it's child
 * [game-objects](@@game-object@@) will follow it according to it's transformation matrix.
 *
 * It's a pretty usefull behaviour to form more complex displays out of smaller, more manageable
 * pieces.
 *
 * A note on drawing: A container will execute it's renderer code, and then the rendering code
 * of it's children. This means that the parent drawing will show up, below it's children's.
 *
 * Asides from that, a container is no different to a regular [game-object](@@game-object@@),
 * so go look at that part of the documentation for more details on every method here.
 */

/**
 * Nesting FTW!
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["game-object", "visibility-control", "child-finder"], function(GameObject, VisibilityControl, ChildFinder) {

	var GameObjectContainer = GameObject.extend({
		init: function() {
			this._super();

			this.childs = null;
		},

		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * Starts itself and all of it's children.
		 */
		start: function() {
			this._super();

			if (!this.childs) return;

			for (var i = 0; i < this.childs.length; i++) {
				this.childs[i].start();
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>addChild</strong></p>
		 *
		 * Adds the specified child [game-object](@@game-object@@) to this container.
		 * If the child already is part of another parent, it is removed from it
		 * and added to this one.
		 *
		 * @param {Object} child The child [game-object](@@game-object@@) to add
		 */
		addChild: function(child) {
			if (!child) return;

			if (!this.childs) this.childs = [];

			if (child.parent) {
				child.parent.removeChild(child);
			}

			child.parent = this;

			this.childs.push(child);
			child.added(this);

			return child;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeChild</strong></p>
		 *
		 * Removes the specified child [game-object](@@game-object@@) from this container.
		 *
		 * @param {Object} child The child [game-object](@@game-object@@) to remove
		 */
		removeChild: function(child) {
			if (!child) return;

			child.parent = null;

			if (!this.childs) return;

			this.childs.splice(this.childs.indexOf(child), 1);

			if (this.childrenOptions && this.childrenOptions[child.uid]) {
				delete this.childrenOptions[child.uid];
			}

			child.removed(this);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>update</strong></p>
		 *
		 * Updates all of it's children.
		 *
		 * @param {Number} delta Time ellapsed since the last update
		 */
		update: function(delta) {
			this.transform();

			if (!this.childs) return;

			var child = null
			var hasRenderer;

			for (var i = 0; i < this.childs.length; i++) {
				child = this.childs[i];

				if (!child.canUpdate) continue;

				if (this.childrenOptions && this.childrenOptions[child.uid]) {
					if (!this.childrenOptions[child.uid].update) continue;
				}

				child.update(delta);

				hasRenderer = child.hasRenderer();

				if (!child.hasComponents()) {
					if (hasRenderer) {
						child.renderer.update(delta);
					}

					if (!child.isContainer()) {
						child.transform();
					}
				} else {
					if (child.transformedOnce()) {
						for (var k = 0; k < child.components.length; k++) {
							if (child.components[k].update && child.components[k].isEnabled()) {
								child.components[k].update(delta);
							}
						}
					}

					if (hasRenderer) {
						child.renderer.update(delta);
					}

					if (!child.isContainer()) {
						child.transform();
					}
				}
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>draw</strong></p>
		 *
		 * Draws the game-object into the specified Context 2D, using it's [matrix-3x3](@@matrix-3x3@@)
		 *
		 * Then it draws all of it's children
		 *
		 * @param {Context 2D} context [CanvasRenderingContext2D](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D)
		 * @param {Object} viewport The [viewport](@@viewport@@) this objects is being drawn too
		 */
		draw: function(context, viewport) {
			// Draw only if inside the viewport and is allowed to be drawn
			if (this.canDraw && viewport.isGameObjectInside(this, context)) {
				this._super(context, viewport);
			}

			if (!this.childs) return;

			var child = null;

			for (var i = 0; i < this.childs.length; i++) {
				child = this.childs[i];

				if (child.isContainer()) {
					// If the child is a container game object...
					// Call draw method, it will figure out if it actually needs to be drawn, and do the same for it's children
					child.draw(context, viewport);
				} else {
					// If the child is a regular game object...
					// Try to skip drawing as soon as possible

					// Draw only if inside the viewport and is allowed to be drawn
					if (child.canDraw && viewport.isGameObjectInside(child, context)) {
						// If there are options for this child, apply them
						if (this.childrenOptions && this.childrenOptions[child.uid]) {
							if (this.childrenOptions[child.uid].draw) {
								child.draw(context, viewport);
							}
						} else {
							// If there are no options, just draw the child
							child.draw(context, viewport);
						}
					}
				}
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>hide</strong></p>
		 *
		 * Prevents rendering of itself and all of it's children
		 *
		 * @param {Boolean} [getControl=false] If set to true returns a [visibility-control](@@visibility-control@@) object for more fine grained control
		 */
		hide: function(getControl) {
			if (!getControl) {
				this._super();

				if (!this.childs) return;

				for (var i = 0; i < this.childs.length; i++) {
					this.childs[i].hide();
				}
			} else {
				return VisibilityControl.user(this)
					.hide(this._super);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>show</strong></p>
		 *
		 * Enables rendering of itself and all of it's children
		 *
		 * @param {Boolean} [getControl=false] If set to true return a [visibility-control](@@visibility-control@@) object for more fine grained control
		 */
		show: function(getControl) {
			if (!getControl) {
				this._super();

				if (!this.childs) return;

				for (var i = 0; i < this.childs.length; i++) {
					this.childs[i].show();
				}
			} else {
				return VisibilityControl.user(this)
					.show(this._super);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>stop</strong></p>
		 *
		 * Prevents updating on itself and all of it's children
		 *
		 * @param {Boolean} [skipEvent=false]
		 */
		stop: function(skipEvent) {
			this._super(skipEvent);

			if (!this.childs) return;

			for (var i = 0; i < this.childs.length; i++) {
				this.childs[i].stop(skipEvent);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>run</strong></p>
		 *
		 * Enables updating on itself and all of it's childdren
		 *
		 * @param {Boolean} [skipEvent=false]
		 */
		run: function(skipEvent) {
			this._super(skipEvent);

			if (!this.childs) return;

			for (var i = 0; i < this.childs.length; i++) {
				this.childs[i].run(skipEvent);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>toggleVisibility</strong></p>
		 *
		 * Toggles the rendering of itself and all of it's children
		 *
		 * @param {Boolean} [getControl=false] If set to true return a [visibility-control](@@visibility-control@@) object for more fine grained control
		 */
		toggleVisibility: function(getControl) {
			if (!getControl) {
				this._super();

				if (!this.childs) return;

				for (var i = 0; i < this.childs.length; i++) {
					this.childs[i].toggleVisibility();
				}
			} else {
				return VisibilityControl.user(this)
					.toggle(this._super);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>addToViewport</strong></p>
		 *
		 * Adds the specified [viewport](@@viewport@@) and [layer](@@layer@@) combo to the ones this game object belongs to.
		 * It also does it for it's children
		 *
		 * @param {String} viewportName Name of the new [viewport](@@viewport@@) this object belongs to
		 * @param {String} layerName Name of the [layer](@@layer@@) in the specified viewport
		 */
		addToViewportList: function(viewportName, layerName) {
			this._super(viewportName, layerName);

			if (!this.childs) return;

			for (var i = 0; i < this.childs.length; i++) {
				this.childs[i].addToViewportList(viewportName, layerName);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeFromViewport</strong></p>
		 *
		 * Removes the [viewport](@@viewport@@) and [layer](@@layer@@) combo from the ones this game object belongs to.
		 * It also does it for it's children
		 *
		 * @param {String} viewportName Name of the [viewport](@@viewport@@) to remove from this game objects list
		 * @param {String} layerName Name of the [layer](@@layer@@) in the specified viewport
		 *
		 */
		removeFromViewportList: function(viewportName, layerName) {
			this._super(viewportName, layerName);

			if (!this.childs) return;

			for (var i = 0; i < this.childs.length; i++) {
				this.childs[i].removeFromViewportList(viewportName, layerName);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>setChildOptions</strong></p>
		 *
		 * This method allows to set options that will affect a [game-object](@@game-object@@) only on this container
		 *
		 * The options argument must have a **draw** key and an **update** key, these will determine if the child [game-object](@@game-object@@)
		 * is drawn or updated on this container. The properties will be evaluated as truthy or falsy.
		 *
		 * If the keys are not provided, they are added and set to **true** by default
		 *
		 * @param {Object} child Child [game-object](@@game-object@@) to set options to
		 * @param {Object} options Options that will be applied to the specified child on this container
		 */
		setChildOptions: function(child, options) {
			if (!this.childrenOptions) this.childrenOptions = {};

			options = options || {};

			if (!options.hasOwnProperty('update')) {
				options.update = true;
			}
			if (!options.hasOwnProperty('draw')) {
				options.draw = true;
			}

			this.childrenOptions[child.uid] = options;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getChildOptions</strong></p>
		 *
		 * Get the options set in the **setChildOptions** method for the specified child [game-object](@@game-object@@)
		 *
		 * @param {Object} child A child [game-obejct](@@game-obejct@@) of this container
		 *
		 * @return {Object} An object like the one set in the **setChildOptions** method
		 */
		getChildOptions: function(child) {
			if (!this.childrenOptions) this.childrenOptions = {};

			if (this.childrenOptions[child.uid]) {
				return this.childrenOptions[child.uid];
			} else {
				this.setChildOptions(child);
				return this.childrenOptions[child.uid];
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>findChildren</strong></p>
		 *
		 * Gets a reference to the [child-finder](@@child-finder@@) object, to search for children of this container
		 *
		 * @return {Object}
		 */
		findChildren: function() {
			return ChildFinder.user(this);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>recycle</strong></p>
		 *
		 * Calls the recycle method on every child, and then on itself,
		 * nulling every reference on it's way.
		 */
		recycle: function() {
			if (this.childs) {
				for (var i = 0; i < this.childs.length; i++) {
					this.childs[i].recycle();
				}

				this.childs.length = 0;
				this.childs = null;
			}

			this._super();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>clear</strong></p>
		 *
		 * Calls the clear method on each child, and then on it self.
		 * It also removes all the childs.
		 */
		clear: function() {
			if (this.childs) {
				while (this.childs.length) {
					this.childs.pop()
						.clear();
				}

				this.childs.length = 0;
				this.childs = null;
			}

			this.childrenOptions = null;

			this._super();
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
			return true;
		},
		/**
		 *
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>typeName</strong></p>
		 *
		 * @return {String} Returns the type name of this object
		 */
		typeName: function() {
			return 'GameObjectContainer';
		},
		/**
		 * --------------------------------
		 */
	});

	return GameObjectContainer;
});
