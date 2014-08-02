/**
 * # gb.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 *
 * Inherits from:
 *
 * Depends of: 
 * [game](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/game_canvas/game.html) 
 * [root](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/root.html) 
 * [layers](@@layers@@) 
 * [assembler](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/pools/assembler.html) 
 * [reclaimer](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/pools/reclaimer.html) 
 * [game-object-pool](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/pools/game-object-pool.html) 
 * [component-pool](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/pools/component-pool.html)
 * [json-cache](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/cache/json-cache.html) 	
 * [error-printer](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/debug/error-printer.html)
 *
 * A [requireJS](http://requirejs.org/) module.
 * 
 * This module acts as a hub for the main modules of [Game-Builder](http://diegomarquez.github.io/game-builder). So instead of loading them individualy, 
 * you just load this one and use the references that it provides.
 */

/**
 * A bunch of shortcuts
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(['game', 'root', 'groups', 'viewports', 'assembler', 'reclaimer', 'game-object-pool', 'component-pool', 'json-cache', 'error-printer'], 
	function(game, root, groups, viewports, assembler, reclaimer, gameObjectPool, componentPool, jsonCache) {
		
		var addToViewPorts = function(go, vports) {
			var v;

			if (typeof vports == 'string') {
				if (this.viewportsAliases[vports]) {
					v = this.viewportsAliases[vports];
				} else {
					ErrorPrinter.printError('Gb', 'Viewport shortcut ' + vports + ' does not exist.');					
				}
			} else {
				v = vports;
			}

			for (var i=0; i<v.length; i++) {
				viewports.get(v[i].viewport).addGameObject(v[i].layer, go);
			}
		};

		return {
			game: game,
			root: root,
			groups:groups,
			viewports: viewports,

			assembler: assembler,
			reclaimer: reclaimer,

			goPool: gameObjectPool,
			coPool: componentPool,
			jsonCache: jsonCache,

			debug: false,

			viewportsAliases: {},

			/**
			 * A reference to the main canvas object in index.html. 
			 */
			canvas: document.getElementById('game'),
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>setViewportShortCut</strong></p>
			 * 
			 * Store commonly used [viewport](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html) + [layer](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/layer.html) setups
			 * 
			 * @param {String} goId Id of [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) to add. View [game-object-pool](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/pools/game-object-pool.html), for more details.
			 * @param {String} groupId Id of the group to add the [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) to. View [groups](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/groups.html), for more details.
			 * @param {Array} vports An array specifying viewports and corresponding layers the [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) should be added to.
			 *
			 * @return {Object} The [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) that was just assembled.
			 */
			setViewportShortCut: function(alias, vports) {
				this.viewportsAliases[alias] = vports;
			},

			/**
			 * <p style='color:#AD071D'><strong>addToLayer</strong></p>
			 * 
			 * Wraps all the steps needed to start rendering a <a href=file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html>game-object</a>
			 * 
			 * @param {String} goId Id of [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) to add. View [game-object-pool](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/pools/game-object-pool.html), for more details.
			 * @param {String} groupId Id of the [group](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/group.html) to add the [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) to. View [groups](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/groups.html), for more details.
			 * @param {Array|String} vports If it is an array specifying [viewports](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html) and corresponding [layers](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/layer.html) 
			 *                              the [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) should be added to. 
			 *                              If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
			 *
			 * @return {Object} The [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) that was just assembled.
			 */
			add: function (goId, groupId, vports) {
				var go = assembler.get(goId);
				groups.get(groupId).add(go);
				addToViewPorts.call(this, go, vports);			
				go.start();

				return go;
			},
			
			/**
			 * <p style='color:#AD071D'><strong>addTextToLayer</strong></p>
			 * 
			 * This method is basically the same as **add** but it is used with [game-objects](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) that have a 
			 * [text-renderer](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/components/rendering/text-renderer.html) attached to them. 
			 * 
			 * @param {String} goId Id of [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) to add. View [game-object-pool](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/pools/game-object-pool.html), for more details.
			 * @param {String} groupId Id of the [group](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/group.html) to add the [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) to. View [groups](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/groups.html), for more details.		 
			 * @param {String} text  String to initialize the [text-renderer](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/components/rendering/text-renderer.html) with.
			 * @param {Array|String} vports If it is an array specifying [viewports](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/viewport.html) and corresponding [layers](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/view/layer.html) 
			 *                              the [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) should be added to. 
			 *                              If it is a string, it is used to pick one of the configurations already defined through **setViewportShortCut**
			 *
			 * @return {Object} The [game-object](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/hierarchy/game-object.html) that was just assembled.
			 */
			addText: function(goId, groupId, text, vports) {
				var go = assembler.get(goId);
				groups.get(groupId).add(go);
				addToViewPorts.call(this, go, vports);
				go.renderer.text = text;
				go.start();

				return go;
			},
			/**
			 * --------------------------------
			 */
			
			/**
			 * <p style='color:#AD071D'><strong>assetMap</strong></p>
			 *
			 * @return {Object} Cached object in the 'asset-map' key of the [json-cache](file://localhost/Users/johndoe/game-builder-gh-pages/game-builder-docs/src/cache/json-cache.html) module
			 */
			assetMap: function() {
				return this.jsonCache.get('asset-map')
			}
			/**
			 * --------------------------------
			 */
		}
	}
);

