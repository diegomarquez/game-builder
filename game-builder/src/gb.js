/**
 * # gb.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 *
 * Inherits from:
 * [delegate](http://diegomarquez.github.io/game-builder/game-builder-docs/src/delegate.html)
 *
 * Depends of:
 * [game](http://diegomarquez.github.io/game-builder/game-builder-docs/src/game_canvas/game.html)
 * [groups](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/groups.html)
 * [assembler](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/assembler.html)
 * [reclaimer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/reclaimer.html)
 * [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html)
 * [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html)
 * [json-cache](http://diegomarquez.github.io/game-builder/game-builder-docs/src/cache/json-cache.html)
 * [asset-map](@@asset-map@@)
 * [error-printer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/debug/error-printer.html)
 *
 * A [requireJS](http://requirejs.org/) module.
 *
 * This module acts as a hub for the main modules of [Game-Builder](http://diegomarquez.github.io/game-builder). So instead of loading them individualy,
 * you just load this one and use the references that it provides.
 *
 * These module extend [delegate](http://diegomarquez.github.io/game-builder/game-builder-docs/src/delegate.html) so it provides a few events to hook into:
 *
 * ### **GAME_OBJECT_ADDED**
 * When a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) is created by the **add**, **create** or **addChildTo** methods
 *
 * Registered callbacks get the game object as argument
 * ``` javascript
 * gb.on(gameObject.GAME_OBJECT_ADDED, function(go) {});
 * ```
 */

/**
 * A bunch of shortcuts
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require) {

	var toggle = function(state, prop) {
		if (state === false || state === true) {
			this[prop] = state;
		} else {
			this[prop] = !this[prop];
		}
	}

	var Gb = require('delegate')
		.extend({
			init: function() {
				this._super();

				this.debug = false;
				this.colliderDebug = false;
				this.rendererDebug = false;
				this.gameObjectDebug = false;

				this.viewportsAliases = {};

				/**
				 * A reference to the main canvas object in index.html.
				 */
				this.canvas = document.getElementById('game');
				/**
				 * --------------------------------
				 */
			},

			/**
			 * <p style='color:#AD071D'><strong>setViewportShortCut</strong></p>
			 *
			 * Store commonly used [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) + [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) setups
			 *
			 * @param {String} alias Id to later indentify the object sent in the **vports** argument
			 * @param {Array} vports An array specifying viewports and corresponding layers. The objects in the array should look like this
			 * ``` { viewport: 'ViewportName', layer: 'LayerName' }
			 * ```
			 */
			setViewportShortCut: function(alias, vports) {
				this.viewportsAliases[alias] = vports;
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>removeViewportShortCut</strong></p>
			 *
			 * Removes the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) + [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) setups for the given id
			 *
			 * @param {Strin} alias Id of the shortcut to remove
			 */
			removeViewportShortCut: function(alias) {
				delete this.viewportsAliases[alias];
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>getViewportShortCuts</strong></p>
			 *
			 * Get all the viewport shortcut names
			 *
			 * @return {Array} All the shortcut names
			 */
			getViewportShortCuts: function() {
				var r = [];

				for (var k in this.viewportsAliases) {
					r.push(k);
				}

				return r;
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>add</strong></p>
			 *
			 * Wraps all the steps needed to start rendering a <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html>game-object</a>
			 *
			 * @param {String} goId Id of [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to add. View [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html), for more details.
			 * @param {String} groupId Id of the [group](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/group.html) to add the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to. View [groups](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/groups.html), for more details.
			 * @param {Array|String} vports If it is an array it should be a collection of objects looking like this
			 * ``` { viewport: 'ViewportName', layer: 'LayerName' }
			 * ```
			 * If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
			 * @param {Object} [args=null] Object with arguments to be applied to the created [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
			 *
			 * @return {Object} The [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) that was just assembled.
			 */
			add: function(goId, groupId, vports, args) {
				var go = this.assembler.get(goId, args, false, false);
				this.groups.get(groupId)
					.addChild(go);
				this.addToViewports(go, vports);

				go.start();

				this.execute(this.GAME_OBJECT_ADDED, go);

				return go;
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>create</strong></p>
			 *
			 * Wraps all the steps needed to start rendering a <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html>game-object</a>
			 * This method will create a new object if the corresponding [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html) doesn't
			 * have any available
			 *
			 * @param {String} goId Id of [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to add. View [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html), for more details.
			 * @param {String} groupId Id of the [group](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/group.html) to add the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to. View [groups](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/groups.html), for more details.
			 * @param {Array|String} vports If it is an array it should be a collection of objects looking like this
			 * ``` { viewport: 'ViewportName', layer: 'LayerName' }
			 * ```
			 * If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
			 * @param {Object} [args=null] Object with arguments to be applied to the created [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
			 *
			 * @return {Object} The [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) that was just assembled.
			 */
			create: function(goId, groupId, vports, args) {
				var go = this.assembler.get(goId, args, false, true);
				this.groups.get(groupId)
					.addChild(go);
				this.addToViewports(go, vports);

				go.start();

				this.execute(this.GAME_OBJECT_ADDED, go);

				return go;
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>getGameObject</strong></p>
			 *
			 * Wraps all the steps needed to setup a <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html>game-object</a>.
			 * The main difference with **add** and **create** is that this method does not start the objects
			 *
			 * @param {String} goId Id of [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to add. View [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html), for more details.
			 * @param {String} groupId Id of the [group](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/group.html) to add the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to. View [groups](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/groups.html), for more details.
			 * @param {Array|String} vports If it is an array it should be a collection of objects looking like this
			 * ``` { viewport: 'ViewportName', layer: 'LayerName' }
			 * ```
			 * If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
			 * @param {Object} args Object with arguments to be applied to the child [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
			 * @param {String} method Method to get a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html), can be either 'get' or 'create'
			 *
			 * @return {Object} The [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) that was just assembled.
			 */
			getGameObject: function(goId, groupId, vports, args, method) {
				var go;

				if (method == 'create') {
					go = this.assembler.get(goId, args, false, true);
				} else {
					go = this.assembler.get(goId, args, false, false);
				}

				this.groups.get(groupId)
					.addChild(go);
				this.addToViewports(go, vports);

				return go;
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>addChildTo</strong></p>
			 *
			 * Wraps all the steps needed to add a child [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to a [game-object-container](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object-container.html)
			 *
			 * If the vports aregument is specified, the child will be drawn in the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) and [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) pairs specified.
			 * The parent [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) will be ignored.
			 *
			 * @param {Object} go [game-object-container](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object-container.html) to add the child to
			 * @param {String} chidlGoId Id of [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to add. View [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html), for more details
			 * @param {Array|String} vports If it is an array it should be a collection of objects looking like this
			 * ``` { viewport: 'ViewportName', layer: 'LayerName' }
			 * ```
			 * If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
			 * @param {Object} args Object with arguments to be applied to the child [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
			 * @param {String} method Method to get a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html), can be either 'get' or 'create'
			 * @param {Boolean} [start=true] Whether the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) should be started right away
			 *
			 * @return {Object} The child [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
			 */
			addChildTo: function(parent, chidlGoId, vports, args, method, start) {

				var child;

				if (method == 'create') {
					child = this.assembler.get(chidlGoId, args, false, true);
				} else {
					child = this.assembler.get(chidlGoId, args, false, false);
				}

				parent.addChild(child);

				if (vports) {
					this.addToViewports(child, vports);
					parent.setChildOptions(child, {
						draw: false
					});
				}

				start = start === undefined ? true : false;

				if (start) {
					child.start();
				}

				this.execute(this.GAME_OBJECT_ADDED, child);

				return child;
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>addToViewports</strong></p>
			 *
			 * Adds a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to the specified [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) and [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) combos
			 *
			 * @param {Object} go An active [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
			 * @param {Array|String} vports If it is an array it should be a collection of objects looking like this
			 * ``` { viewport: 'ViewportName', layer: 'LayerName' }
			 * ```
			 * If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
			 */
			addToViewports: function(go, vports) {
				var v;

				if (typeof vports == 'string') {
					if (this.viewportsAliases[vports]) {
						v = this.viewportsAliases[vports];
					} else {
						require('error-printer')
							.printError('Gb', 'Viewport shortcut ' + vports + ' does not exist.');
					}
				} else {
					if (Object.prototype.toString.call(vports) != '[object Array]') {
						require('error-printer')
							.printError('Gb', 'Viewport argument must be an array');
					} else {
						v = vports;
					}
				}

				for (var i = 0; i < v.length; i++) {
					this.viewports.get(v[i].viewport)
						.addGameObject(v[i].layer, go);
				}
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>removeFromViewports</strong></p>
			 *
			 * Removes a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) from the specified [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) and [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) combos
			 *
			 * @param {Object} go An active [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
			 * @param {Array|String} vports If it is an array specifying [viewports](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) and corresponding [layers](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html)
			 * the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) should be removed from.
			 * If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
			 */
			removeFromViewports: function(go, vports) {
				var v;

				if (typeof vports == 'string') {
					if (this.viewportsAliases[vports]) {
						v = this.viewportsAliases[vports];
					} else {
						require('error-printer')
							.printError('Gb', 'Viewport shortcut ' + vports + ' does not exist.');
					}
				} else {
					if (Object.prototype.toString.call(vports) != '[object Array]') {
						require('error-printer')
							.printError('Gb', 'Viewport argument must be an array');
					} else {
						v = vports;
					}
				}

				for (var i = 0; i < v.length; i++) {
					this.viewports.get(v[i].viewport)
						.removeGameObject(v[i].layer, go);
				}
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>addComponentTo</strong></p>
			 *
			 * Wraps all the steps needed to add <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html>component</a> to a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
			 *
			 * @param {Object} go [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to add the [component](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html) to
			 * @param {String} coId Id of [component](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html) to add. View [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html), for more details
			 * @param {Object} [args=null] Object with arguments to be applied to the [component](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html)
			 *
			 * @return {Object} A [component](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html)
			 */
			addComponentTo: function(go, coId, args) {
				var co = this.assembler.getComponent(coId, args);
				go.addComponent(co);
				co.onStarted(go);

				return co;
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>addComponentsTo</strong></p>
			 *
			 * Wraps all the steps needed to add a list of <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html>components</a> to a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
			 *
			 * @param {Object} go [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to add the [component](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html) to
			 * @param {Array} coIds Ids of [components](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html) to add. View [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html), for more details
			 * @param {Array} [args=null] Array with arguments to be applied to each [component](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html)
			 *
			 * @return {Array} An array with all the [components](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html) added
			 */
			addComponentsTo: function(go, coIds, args) {
				var result = [];
				var isArgsArray = require('util')
					.isArray(args);

				for (var i = 0; i < coIds.length; i++) {
					if (isArgsArray) {
						result.push(this.addComponentTo(go, coIds[i], args[i]));
					} else {
						result.push(this.addComponentTo(go, coIds[i], args));
					}
				}

				return result;
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>setRendererTo</strong></p>
			 *
			 * Wraps all the steps needed to set the <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/renderer.html>renderer</a> of a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
			 *
			 * @param {Object} go [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to add the [renderer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/renderer.html) to
			 * @param {String} rId Id of [renderer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/renderer.html) to add. View [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html), for more details
			 * @param {Object} [args=null] Object with arguments to be applied to the [renderer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/renderer.html)
			 *
			 * @return {Object} A [renderer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/renderer.html)
			 */
			setRendererTo: function(go, rId, args) {
				var r = this.assembler.getComponent(rId, args);
				go.removeRenderer();
				go.setRenderer(r);
				r.onStarted(go);

				return r;
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>removeComponentFrom</strong></p>
			 *
			 * Wraps all the steps needed to remove a <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html>component</a> from a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
			 *
			 * @param {Object} go [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to remove a [component](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html) from
			 * @param {String} coId Id of [component](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/component.html) to remove. View [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html), for more details
			 */
			removeComponentFrom: function(go, coId) {
				var c = go.findComponents()
					.firstWithType(coId);
				go.removeComponent(c);
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>findGameObjectsOfType</strong></p>
			 *
			 * Get all the currently active [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) that are similar to the one specified
			 *
			 * @param {Object} go The [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) is used to return all other active ones that are similar to this one
			 *
			 * @return {Array} An array with all the matching [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
			 */
			findGameObjectsOfType: function(go) {
				var gos = this.goPool.getActiveObjects(go.poolId);

				var result = [];

				for (var i = 0; i < gos.length; i++) {
					if (gos[i].typeId == go.typeId) {
						result.push(gos[i]);
					}
				}

				return result;
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>addTextToLayer</strong></p>
			 *
			 * This method is basically the same as **add** but it is used with [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) that have a
			 * [text-renderer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/text-renderer.html) attached to them.
			 *
			 * @param {String} goId Id of [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to add. View [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html), for more details.
			 * @param {String} groupId Id of the [group](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/group.html) to add the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to. View [groups](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/groups.html), for more details.
			 * @param {String} text String to initialize the [text-renderer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/text-renderer.html) with.
			 * @param {Array|String} vports If it is an array it should be a collection of objects looking like this
			 * ``` { viewport: 'ViewportName', layer: 'LayerName' }
			 * ```
			 * If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
			 *
			 * @return {Object} The [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) that was just assembled.
			 */
			addText: function(goId, groupId, text, vports) {
				var go = this.assembler.get(goId);
				this.groups.get(groupId)
					.addChild(go);

				this.addToViewports(go, vports);

				go.renderer.text = text;
				go.start();

				this.execute(this.GAME_OBJECT_ADDED, go);

				return go;
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>assetMap</strong></p>
			 *
			 * Wrapper for the [asset-map](@@asset-map@@) module
			 *
			 * @return {Object} An object with the local and remote asset URLs
			 */
			assetMap: function() {
				return require('asset-map')
					.get();
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>toggleDebug</strong></p>
			 *
			 * Toggle the global debug option which triggers a bunch of debug drawing
			 *
			 * @param {Boolean} state=false If specified the debug option is set to that value
			 */
			toggleDebug: function(state) {
				toggle.call(this, state, 'debug');
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>toggleColliderDebug</strong></p>
			 *
			 * Toggle the debug drawing of [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) [collision-components](http://diegomarquez.github.io/game-builder/game-builder-docs/src/collision/collision-component.html)
			 *
			 * @param {Boolean} state=false If specified the debug option is set to that value
			 */
			toggleColliderDebug: function(state) {
				toggle.call(this, state, 'colliderDebug');
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>toggleRendererDebug</strong></p>
			 *
			 * Toggle the debug drawing of [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) [renderers](http://diegomarquez.github.io/game-builder/game-builder-docs/src/components/rendering/renderer.html)
			 *
			 * @param {Boolean} state=false If specified the debug option is set to that value
			 */
			toggleRendererDebug: function(state) {
				toggle.call(this, state, 'rendererDebug');
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>toggleGameObjectDebug</strong></p>
			 *
			 * Toggle the debug drawinf of [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) centers
			 *
			 * @param {Boolean} state=false If specified the debug option is set to that value
			 */
			toggleGameObjectDebug: function(state) {
				toggle.call(this, state, 'gameObjectDebug');
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>getEnvironment</strong></p>
			 *
			 * Get the environment where the application is running
			 *
			 * @return {String} Can be "dev" or "prod"
			 */
			getEnvironment: function() {
				var hostname = window.location.hostname;

				if (hostname === 'localhost')
					return 'dev';

				if (hostname === '')
					return 'dev';

				return "prod";
			}
			/**
			 * --------------------------------
			 */
		});

	var defineProperty = function(name, value) {
		Object.defineProperty(Gb.prototype, name, {
			configurable: false,
			enumerable: false,
			writable: false,
			value: value
		});
	}

	defineProperty("game", require('game'));
	defineProperty("groups", require('groups'));
	defineProperty("viewports", require('viewports'));

	defineProperty("assembler", require('assembler'));
	defineProperty("reclaimer", require('reclaimer'));

	defineProperty("goPool", require('game-object-pool'));
	defineProperty("coPool", require('component-pool'));
	defineProperty("jsonCache", require('json-cache'));

	defineProperty("GAME_OBJECT_ADDED", 'game-object-added');

	return new Gb();
});
