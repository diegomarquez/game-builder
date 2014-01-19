/**
 * # gb.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 *
 * Inherits from:
 *
 * Depends of: 
 * [game](http://diegomarquez.github.io/game-builder/game-builder-docs/src/game_canvas/game.html) 
 * [root](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/root.html) 
 * [layers](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/layers.html) 
 * [assembler](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/assembler.html) 
 * [reclaimer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/reclaimer.html) 
 * [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html) 
 * [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html) 	
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
define(['game', 'root', 'layers', 'assembler', 'reclaimer', 'game-object-pool', 'component-pool'], 
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
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>addToLayer</strong></p>
			 * 
			 * Wraps all the steps needed to add a <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html>game-object</a>
			 * into a <a href=@@layer>layer</a>. 
			 * 
			 * @param {String} layerName Id of the layer to add the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to. View [layers](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/layers.html), for more details.
			 * @param {String} goId      Id of [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to add. View [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html), for more details.
			 *
			 * @return {Object} The [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) that was just assembled.
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

