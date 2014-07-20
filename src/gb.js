/**
 * # gb.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 *
 * Inherits from:
 *
 * Depends of: 
 * [game](@@game@@) 
 * [root](@@root@@) 
 * [layers](@@layers@@) 
 * [assembler](@@assembler@@) 
 * [reclaimer](@@reclaimer@@) 
 * [game-object-pool](@@game-object-pool@@) 
 * [component-pool](@@component-pool@@)
 * [json-cache](@@json-cache@@) 	
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
define(['game', 'root', 'groups', 'viewports', 'assembler', 'reclaimer', 'game-object-pool', 'component-pool', 'json-cache'], 
	function(game, root, groups, viewports, assembler, reclaimer, gameObjectPool, componentPool, jsonCache) {
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

			/**
			 * A reference to the main canvas object in index.html. 
			 */
			canvas: document.getElementById('game'),
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>addToLayer</strong></p>
			 * 
			 * Wraps all the steps needed to start rendering a <a href=@@game-object@@>game-object</a>
			 * 
			 * @param {String} goId Id of [game-object](@@game-object@@) to add. View [game-object-pool](@@game-object-pool@@), for more details.
			 * @param {String} groupId Id of the group to add the [game-object](@@game-object@@) to. View [groups](@@groups@@), for more details.
			 * @param {Array} vports An array specifying viewports and corresponding layers the [game-object](@@game-object@@) should be added to.
			 *
			 * @return {Object} The [game-object](@@game-object@@) that was just assembled.
			 */
			add: function (goId, groupId, vports) {
				var go = assembler.get(goId);
				groups.get(groupId).add(go);
				
				for (var i=0; i<vports.length; i++) {
					viewports.get(vports[i].viewport).addGameObject(vports[i].layer, go);
				}
			
				go.start();
			},
			
			/**
			 * <p style='color:#AD071D'><strong>addTextToLayer</strong></p>
			 * 
			 * This method is basically the same as **addToLayer** but it is used with [game-objects](@@game-object@@) that have a 
			 * [text-renderer](@@text-renderer@@) attached to them. 
			 * 
			 * @param {String} layerName Id of the layer to add the [game-object](@@game-object@@) to. View [layers](@@layers@@), for more details.
			 * @param {String} goId      Id of [game-object](@@game-object@@) to add. View [game-object-pool](@@game-object-pool@@), for more details.
			 * @param {String} text      String to initialize the [text-renderer](@@text-renderer@@) with.
			 *
			 * @return {Object} The [game-object](@@game-object@@) that was just assembled.
			 */
			addTextToLayer: function(layerName, goId, text) {
				var go = this.layers.get(layerName).add(this.assembler.get(goId));
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
			 * @return {Object} Cached object in the 'asset-map' key of the [json-cache](@@json-cache@@) module
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

