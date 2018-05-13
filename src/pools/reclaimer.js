/**
 * # reclaimer.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of:
 * [game-object-pool](@@game-object-pool@@)
 * [component-pool](@@component-pool@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module defines the object which is in charge of retrieving [game-objects](@@game-object@@)
 * at any given point. It's the last piece of [Game-Builder](http://diegomarquez.github.io/game-builder)
 * object management system.
 *
 * It has various methods to send [game-objects](@@game-object@@) to their respective pools.
 *
 * When you just want to get rid of everything, [reclaimer](@@reclaimer@@) has you covered.
 */

/**
 * Recycling
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(['game-object-pool', 'component-pool', 'error-printer'], function(GameObjectPool, ComponentPool, ErrorPrinter) {

	var Reclaimer = function() {
		this.marked = [];
	};

	/**
	 * <p style='color:#AD071D'><strong>claimWithId</strong></p>
	 *
	 * Removes a [game-object](@@game-object@@) from it's parent if it has one, and then
	 * calls it's **clear** method. This sends it and all of the objects
	 * that depend of it to their respective pools.
	 *
	 * @param {Object} go [game-object](@@game-object@@) to recycle
	 * @param {String} id Id assigned to the [game-object](@@game-object@@) in [game-object-pool](@@game-object-pool@@)
	 *
	 * @throws {Error} If the go argument is missing
	 * @throws {Error} If the id argument is missing
	 */
	Reclaimer.prototype.claimWithId = function(go, id) {
		if (!go) {
			ErrorPrinter.missingArgumentError('Reclaimer', 'go');
		}

		if (!id) {
			ErrorPrinter.missingArgumentError('Reclaimer', 'id');
		}

		if (go.typeId == id || go.poolId == id) {
			this.claim(go);
		}
	}
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>markWithId</strong></p>
	 *
	 * Marks a [game-object](@@game-object@@) for removal.
	 *
	 * @param {Object} go [game-object](@@game-object@@) to recycle
	 * @param {String} id Id assigned to the [game-object](@@game-object@@) in [game-object-pool](@@game-object-pool@@)
	 *
	 * @throws {Error} If the go argument is missing
	 * @throws {Error} If the id argument is missing
	 */
	Reclaimer.prototype.markWithId = function(go, id) {
		if (!go) {
			ErrorPrinter.missingArgumentError('Reclaimer', 'go');
		}

		if (!id) {
			ErrorPrinter.missingArgumentError('Reclaimer', 'id');
		}

		if (go.typeId == id || go.poolId == id) {
			this.mark(go);
		}
	}
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>claim</strong></p>
	 *
	 * Removes a [game-object](@@game-object@@) from it's parent if it has one, and then
	 * calls it's **clear** method. This sends it and all of the objects
	 * that depend of it to their respective pools.
	 *
	 * @param {Object} go [game-object](@@game-object@@) to recycle
	 */
	Reclaimer.prototype.claim = function(go) {
			if (go.parent) {
				go.parent.removeChild(go);
			}

			go.clear();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>mark</strong></p>
		 *
		 * Marks a [game-object](@@game-object@@) for removal. The last thing that [game](@@game@@) does in the update loop is calling
		 * **claimMarked** to claim back all marked objects that are pending for recycling
		 *
		 * @param {Object} go [game-object](@@game-object@@) to recycle
		 */
		Reclaimer.prototype.mark = function(go) {
			if (this.marked.indexOf(go) == -1 && go.isActive()) {
				this.marked.push(go);

				go.once(go.RECYCLE, this, function(go) {
					var index = this.marked.indexOf(go);

					if (index != -1) {
						this.marked.splice(index, 1);
					}
				});
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>claimMarked</strong></p>
		 *
		 * Claims all the [game-objects](@@game-object@@) marked for removal with the **mark** method.
		 */
		Reclaimer.prototype.claimMarked = function() {
			for (var i = this.marked.length - 1; i >= 0; i--) {
				if (this.marked[i]) {
					this.claim(this.marked[i]);
				}
			}

			if (this.clearObjectsFromPools) {
				GameObjectPool.clearObjects();
				ComponentPool.clearObjects();

				this.clearObjectsFromPools = false;
			}

			if (this.clearPools) {
				GameObjectPool.clear();
				ComponentPool.clear();

				this.clearPools = false;
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>claim</strong></p>
		 *
		 * Claims all the children from a [game-object-container](@@game-object-container@@),
		 * but does not claim the [game-object](@@game-object@@) itself.
		 *
		 * @param {Object} go [game-object-container](@@game-object-container@@) to remove children from
		 */
		Reclaimer.prototype.claimChildren = function(go) {
			if (go.isContainer()) {
				var children = go.findChildren()
					.all();

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
		 * Calls **claimWithId** on all the active [game-objects](@@game-object@@)
		 * that match the given type id.
		 *
		 * @param {String} typeName An id matching a existing type in [game-object-pool](@@game-object-pool@@)
		 */
		Reclaimer.prototype.claimType = function(typeName) {
			var activeGameObjects = GameObjectPool.getActiveObjects(typeName);

			for (var i = activeGameObjects.length - 1; i >= 0; i--) {
				this.claimWithId(activeGameObjects[i], typeName);
			}
		};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>markType</strong></p>
	 *
	 * Calls **markWithId** on all the active [game-objects](@@game-object@@)
	 * that match the given type id.
	 *
	 * @param {String} typeName An id matching a existing type in [game-object-pool](@@game-object-pool@@)
	 */
	Reclaimer.prototype.markType = function(typeName) {
		var activeGameObjects = GameObjectPool.getActiveObjects(typeName);

		for (var i = activeGameObjects.length - 1; i >= 0; i--) {
			this.markWithId(activeGameObjects[i], typeName);
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>claimConfiguration</strong></p>
	 *
	 * Calls **claimWithId** on all the active [game-objects](@@game-object@@)
	 * that match the given configuration id.
	 *
	 * @param {String} configurationName An id matching an existing configuration in [game-object-pool](@@game-object-pool@@)
	 */
	Reclaimer.prototype.claimConfiguration = function(configurationName) {
		var configuration = GameObjectPool.getConfigurationObject(configurationName);
		var activeGameObjects = GameObjectPool.getActiveObjects(configuration.type);

		for (var i = activeGameObjects.length - 1; i >= 0; i--) {
			this.claimWithId(activeGameObjects[i], configurationName);
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>claimAll</strong></p>
	 *
	 * Calls **claim** on all active [game-objects](@@game-object@@).
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
	 * <p style='color:#AD071D'><strong>markAll</strong></p>
	 *
	 * Marks all the active [game-objects](@@game-object@@) for claiming
	 */
	Reclaimer.prototype.markAll = function() {
		var allActiveGameObjects = GameObjectPool.getAllActiveObjects();

		for (var k in allActiveGameObjects) {
			this.markType(k);
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>claimAllBut</strong></p>
	 *
	 * Claims all the active [game-objects](@@game-object@@),
	 * but the ones specified in the second argument.
	 *
	 * @param {String} mode What are the id's in the second argument refering too.
	 * Can be either **"type"** or **"configuration"**
	 * @param {Array} doNotClaim Array of Id's not to claim
	 */
	Reclaimer.prototype.claimAllBut = function(mode, doNotClaim) {
		var allActiveGameObjects = GameObjectPool.getAllActiveObjects();

		var capitalizedMode = mode.charAt(0)
			.toUpperCase() + mode.slice(1);

		for (var k in allActiveGameObjects) {
			var activeCollection = allActiveGameObjects[k];

			for (var i = activeCollection.length - 1; i >= 0; i--) {
				var go = activeCollection[i];

				if (capitalizedMode == 'Configuration') {
					if (doNotClaim.indexOf(go.typeId) == -1) {
						this.claimWithId(go, go.typeId);
					}
				}

				if (capitalizedMode == 'Type') {
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
	 * Claims only the active [game-objects](@@game-object@@)
	 * specified.
	 *
	 * @param {String} mode What are the id's in the second argument refering too.
	 * Can be either **"type"** or **"configuration"**
	 * @param {Array} doNotClaim Array of Id's to claim
	 */
	Reclaimer.prototype.claimOnly = function(mode, only) {
		var capitalizedMode = mode.charAt(0)
			.toUpperCase() + mode.slice(1);

		for (var i = only.length - 1; i >= 0; i--) {
			this['claim' + capitalizedMode](only[i]);
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>clearAllPools</strong></p>
	 *
	 * Claims all the [game-objects](@@game-object@@) and then
	 * clears both [game-object-pool](@@game-object-pool@@) and
	 * [component-pool](@@component-pool@@). The Pools are no longer re-useable after this. They need to be configured again.
	 */
	Reclaimer.prototype.clearAllPools = function() {
		return {
			later: function() {
				this.markAll();
				this.clearPools = true;
			}.bind(this),

			now: function() {
				this.claimAll();
				GameObjectPool.clear();
				ComponentPool.clear();
			}.bind(this)
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>clearAllPools</strong></p>
	 *
	 * Claims all the [game-objects](@@game-object@@) and then
	 * clears off the instances held in both [game-object-pool](@@game-object-pool@@) and
	 * [component-pool](@@component-pool@@). Configurations are keptd so the pools can still be re-used.
	 */
	Reclaimer.prototype.clearAllObjectsFromPools = function() {
		return {
			later: function() {
				this.markAll();
				this.clearObjectsFromPools = true;
			}.bind(this),

			now: function() {
				this.claimAll();
				GameObjectPool.clearObjects();
				ComponentPool.clearObjects();
			}.bind(this)
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>clearGameObjectConfiguration</strong></p>
	 *
	 * Claims all the [game-objects](@@game-object@@) associated with the specified configuration id on the [game-object-pool](@@game-object-pool@@),
	 * it then destroys the configuration itself in the [game-object-pool](@@game-object-pool@@) so it can't be used anymore.
	 *
	 * @param {String} [configurationId] A configuration id set in [game-object-pool](@@game-object-pool@@)
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
