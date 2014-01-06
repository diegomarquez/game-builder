define(['game-object-pool', 'component-pool'], function(GameObjectPool, ComponentPool) {
	var Reclaimer = function() {};

	Reclaimer.prototype.claim = function(go, id) {
		if(!id) {
			throw new Error('Reclaimer: ' + 'id argument is: ' + id);
		}

		if(go.typeId == id || go.poolId == id) {
			if (go.parent) {
				go.parent.remove(go);
			}

			go.clear();
		}
	}

	Reclaimer.prototype.claimType = function(typeName) {
		var activeGameObjects = GameObjectPool.getActiveObjects(typeName);

		for (var i=activeGameObjects.length-1; i>=0; i--) {
			this.claim(activeGameObjects[i], typeName);
		}
	};

	Reclaimer.prototype.claimConfiguration = function(configurationName) {
		var configuration = GameObjectPool.getConfigurationObject(configurationName);
		var activeGameObjects = GameObjectPool.getActiveObjects(configuration.type);

		for (var i=activeGameObjects.length-1; i>=0; i--) {		
			this.claim(activeGameObjects[i], configurationName);
		}
	};

	Reclaimer.prototype.claimAll = function() {
		var allActiveGameObjects = GameObjectPool.getAllActiveObjects();

		for (var k in allActiveGameObjects) {
			this.claimType(k);
		}
	};

	Reclaimer.prototype.claimAllBut = function(mode, doNotClaim) {
		var allActiveGameObjects = GameObjectPool.getAllActiveObjects();

		capitalizedMode = mode.charAt(0).toUpperCase() + mode.slice(1);

		for (var k in allActiveGameObjects) {
			var activeCollection = allActiveGameObjects[k];

			for (var i=0; i<activeCollection.length; i++) {
				var go = activeCollection[i];

				if(capitalizedMode == 'Configuration') {
					if (doNotClaim.indexOf(go.typeId) == -1) {
						this.claim(go, go.typeId);
					}
				}

				if(capitalizedMode == 'Type') {
					if (doNotClaim.indexOf(go.poolId) == -1) {
						this.claim(go, go.poolId);
					}
				}
			}
		}
	};

	Reclaimer.prototype.claimOnly = function(mode, only) {
		capitalizedMode = mode.charAt(0).toUpperCase() + mode.slice(1);

		for (var i=0; i<only.length; i++) {
			this['claim' + capitalizedMode](only[i]);
		}
	};

	Reclaimer.prototype.clearAllPools = function() {
		this.claimAll();
		GameObjectPool.clear();
		ComponentPool.clear();
	};

	return new Reclaimer();
});