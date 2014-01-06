/**
 * # gb.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 *
 * Inherits from: ---
 *
 * Depends of: [game](@@game), [root](@@root), [layers](@@layers), [assembler](@@assembler), [reclaimer](@@reclaimer), [game_object_pool](@@game_object_pool), [component_pool](@@component_pool) 	
 *
 * A [requireJS](http://requirejs.org/) module.
 * 
 * This module acts as a hub for the main modules of [Game-Builder](http://diegomarquez.github.io/game-builder). So instead of loading them individualy, 
 * you just lod this one and use the references that it provides.
 */

/**
 * A bunch of shortcuts
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(['game', 'root', 'layers', 'assembler', 'reclaimer', 'game_object_pool', 'component_pool'], 
	function(game, root, layers, assembler, reclaimer, gameObjectPool, componentPool) {
		return {
			game: game,
			root: root,
			layers:layers,

			assembler: assembler,
			reclaimer: reclaimer,

			goPool:gameObjectPool,
			coPool:componentPool,

			/**
			 * A reference to the main canvas object in index.html. 
			 */
			canvas: document.getElementById('game'),

			/**
			 * <p style='color:#AD071D'><strong>addToLayer<strong> wraps all the steps needed to add a [game_object](@@game_object)
			 * into a layer. </p>
			 * @param {String} layerName Id of the layer to add the [game_object](@@game_object) to. View [layers](@@layers), for more details.
			 * @param {String} goId      Id of [game_object](@@game_object) to add. View [game_object_pool](@@game_object_pool), for more details
			 */
			addToLayer: function(layerName, goId) {
				var go = this.layers.get(layerName).add(this.assembler.get(goId));
				go.start();	
				return go;
			}
			/**
			 * --------------------------------
			 */
		}
	}
);

