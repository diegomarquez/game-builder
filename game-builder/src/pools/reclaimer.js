/**
 * # reclaimer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of: 
 * [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html)
 * [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html)
 * [error-printer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/debug/error-printer.html)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines the object which is in charge of retrieving [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
 * at any given point. It's the last piece of [Game-Builder](http://diegomarquez.github.io/game-builder)
 * object management system.
 *
 * It has various methods to send [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to their respective pools.
 * 
 * When you just want to get rid of everything, [reclaimer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/reclaimer.html) has you covered.
 */

/**
 * Recycling
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(['game-object-pool', 'component-pool', 'error-printer'], function(GameObjectPool, ComponentPool, ErrorPrinter) {
	var Reclaimer = function() {};

	/**
	 * <p style='color:#AD071D'><strong>claim</strong></p>
	 *
	 * Removes a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) from it's parent if it has one, and then
	 * calls it's **clear** method. This sends it and all of the objects
	 * that depend of it to their respective pools.
	 * 
	 * @param  {Object} go [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to recycle
	 * @param  {String} id Id assigned to the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) in [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html)
	 *
	 * @throws {Error} If the id argument is missing.
	 */
	Reclaimer.prototype.claimWithId = function(go, id) {
		if(!go) {
			ErrorPrinter.missingArgumentError('Reclaimer', 'go');
		}

		if(!id) {
			ErrorPrinter.missingArgumentError('Reclaimer', 'id');
		}

		if(go.typeId == id || go.poolId == id) {
			this.claim(go);
		}
	}
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>claim</strong></p>
	 *
	 * Removes a [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) from it's parent if it has one, and then
	 * calls it's **clear** method. This sends it and all of the objects
	 * that depend of it to their respective pools.
	 * 
	 * @param  {Object} go [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) to recycle
	 */
	Reclaimer.prototype.claim = function(go) {	
		if (go.parent) {
			go.parent.remove(go);
		}

		go.clear();
	},
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>claim</strong></p>
	 *
	 * Claims all the children from a [game-object-container](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object-container.html), 
	 * but does not claim the [game-object](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) itself.
	 * 
	 * @param  {Object} go [game-object-container](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object-container.html) to remove children from
	 */
	Reclaimer.prototype.claimChildren = function(go) {	
		if (go.isContainer()) {
			var children = go.findChildren().all();

			for (var i = 0; i < children.length; i++) {
				this.claim(children[i]);
			}
		}
	},
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>claimType</strong></p>
	 *
	 * Calls **claimWithId** on all the active [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
	 * that match the given type id. 
	 * 
	 * @param  {String} typeName An id matching a existing type in [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html)
	 */
	Reclaimer.prototype.claimType = function(typeName) {
		var activeGameObjects = GameObjectPool.getActiveObjects(typeName);

		for (var i=activeGameObjects.length-1; i>=0; i--) {
			this.claimWithId(activeGameObjects[i], typeName);
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>claimConfiguration</strong></p>
	 *
	 * Calls **claimWithId** on all the active [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
	 * that match the given configuration id. 
	 * 
	 * @param  {String} configurationName An id matching an existing configuration in [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html)
	 */
	Reclaimer.prototype.claimConfiguration = function(configurationName) {
		var configuration = GameObjectPool.getConfigurationObject(configurationName);
		var activeGameObjects = GameObjectPool.getActiveObjects(configuration.type);

		for (var i=activeGameObjects.length-1; i>=0; i--) {		
			this.claimWithId(activeGameObjects[i], configurationName);
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>claimAll</strong></p>
	 *
	 * Calls **claim** on all active [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html).
	 * Good ol' screen clear.
	 */
	Reclaimer.prototype.claimAll = function() {
		var allActiveGameObjects = GameObjectPool.getAllActiveObjects();

		for (var k in allActiveGameObjects) {
			this.claimType(k);
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>claimAllBut</strong></p>
	 *
	 * Claims all the active [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html), 
	 * but the ones specified in the second argument.
	 * 
	 * @param  {String} mode       What are the id's in the second argument refering too.
	 *                             Can be either **"type"** or **"configuration"** 
	 * @param  {Array} doNotClaim Array of Id's not to claim
	 */
	Reclaimer.prototype.claimAllBut = function(mode, doNotClaim) {
		var allActiveGameObjects = GameObjectPool.getAllActiveObjects();

		capitalizedMode = mode.charAt(0).toUpperCase() + mode.slice(1);

		for (var k in allActiveGameObjects) {
			var activeCollection = allActiveGameObjects[k];

			for (var i=0; i<activeCollection.length; i++) {
				var go = activeCollection[i];

				if(capitalizedMode == 'Configuration') {
					if (doNotClaim.indexOf(go.typeId) == -1) {
						this.claimWithId(go, go.typeId);
					}
				}

				if(capitalizedMode == 'Type') {
					if (doNotClaim.indexOf(go.poolId) == -1) {
						this.claimWithId(go, go.poolId);
					}
				}
			}
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>claimOnly</strong></p>
	 *
	 * Claims only the active [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html)
	 * specified. 
	 * 
	 * @param  {String} mode       What are the id's in the second argument refering too.
	 *                             Can be either **"type"** or **"configuration"** 
	 * @param  {Array} doNotClaim Array of Id's to claim
	 */
	Reclaimer.prototype.claimOnly = function(mode, only) {
		capitalizedMode = mode.charAt(0).toUpperCase() + mode.slice(1);

		for (var i=0; i<only.length; i++) {
			this['claim' + capitalizedMode](only[i]);
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>clearAllPools</strong></p>
	 *
	 * Claims all the [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) and then
	 * clears both [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html) and
	 * [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html). The Pools are no longer re-useable after this. They need to be configured again.
	 */
	Reclaimer.prototype.clearAllPools = function() {
		this.claimAll();
		GameObjectPool.clear();
		ComponentPool.clear();
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>clearAllPools</strong></p>
	 *
	 * Claims all the [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) and then
	 * clears off the instances held in both [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html) and
	 * [component-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/component-pool.html). Configurations are kepts so the pools can still be re-used.
	 */
	Reclaimer.prototype.clearAllObjectsFromPools = function() {
		this.claimAll();
		GameObjectPool.clearObjects();
		ComponentPool.clearObjects();
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>clearGameObjectConfiguration</strong></p>
	 *
	 * Claims all the [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) associated with the specified configuration id on the [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html),
	 * it then destroys the configuration itself in the [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html) so it can't be used anymore.
	 *
	 * @param {String} [configurationId] A configuration id set in [game-object-pool](http://diegomarquez.github.io/game-builder/game-builder-docs/src/pools/game-object-pool.html)
	 */
	Reclaimer.prototype.clearGameObjectConfiguration = function(configurationId) {
		this.claimConfiguration(configurationId);
		GameObjectPool.clearConfiguration(configurationId);
	};
	/**
	 * --------------------------------
	 */

	return new Reclaimer();
});