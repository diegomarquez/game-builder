define(['game_object_pool'], function(GameObjectPool) {
	var Reclaimer = function() {};

	//This method only return an instance. It is up to the user to call the start method with arguments.
	Assembler.prototype.claim = function(name) {
		var activeGameObjects = GameObjectPool.getActiveObjects(name);

		for (var i=activeGameObjects.length; i>=0; i--) {
			activeGameObjects[i].clear();
		}
	};

	Assembler.prototype.claimAll = function() {
		var allActiveGameObjects = GameObjectPool.getAllActiveObjects();

		for (var k in allActiveGameObjects) {
			this.claim(k);
		}
	};

	Assembler.prototype.claimAllBut = function(doNotClaim) {
		var allActiveGameObjects = GameObjectPool.getAllActiveObjects();

		for (var k in allActiveGameObjects) {
			if (doNotClaim.indexOf(k) != -1) {
				this.claim(k);
			}
		}
	};

	Assembler.prototype.claimOnly = function(only) {
		var allActiveGameObjects = GameObjectPool.getAllActiveObjects();

		for (var k in allActiveGameObjects) {
			if (only.indexOf(k) == -1) {
				this.claim(k);
			}
		}
	};

	return new Reclaimer();
});