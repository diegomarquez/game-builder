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
define(['game', 'root', 'layers', 'assembler', 'reclaimer', 'game-object-pool', 'component-pool', 'json-cache'], 
	function(game, root, layers, assembler, reclaimer, gameObjectPool, componentPool, jsonCache) {
		return {
			game: game,
			root: root,
			layers:layers,

			assembler: assembler,
			reclaimer: reclaimer,

			goPool:gameObjectPool,
			coPool:componentPool,
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
			 * Wraps all the steps needed to add a <a href=@@game-object@@>game-object</a>
			 * into a <a href=@@layer>layer</a>. 
			 * 
			 * @param {String} layerName Id of the layer to add the [game-object](@@game-object@@) to. View [layers](@@layers@@), for more details.
			 * @param {String} goId      Id of [game-object](@@game-object@@) to add. View [game-object-pool](@@game-object-pool@@), for more details.
			 *
			 * @return {Object} The [game-object](@@game-object@@) that was just assembled.
			 */
			addToLayer: function(layerName, goId) {
				var go = this.layers.get(layerName).add(this.assembler.get(goId));
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

