/**
 * # activity-display.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of: 
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module displays information on everything that is pooled and cached in [Game-Builder](http://diegomarquez.github.io/game-builder)
 */

/**
 * Caches, pools and more!
 * --------------------------------
 */


/**
 * --------------------------------
 */
define(function(require) {
	var gb = require('gb');

	var gameObjectPool = require('game-object-pool');
	var componentPool = require('component-pool');
	var imageCache = require('image-cache');
		// - Cached Images
	var pathCache = require('path-cache');
		// - Cached Paths
	var textCache = require('text-cache');
		// - Cached Text
	var jsonCache = require('json-cache');
	
	var soundPlayer = require('sound-player');
		// - Pooled Sound Channels
		// - Active Sound Channels
		// - Loaded Sounds
		// - Assigned Channels
	var timerFactory = require('timer-factory');
		// - Timers

	var ActivityDisplay = function() {}

	var displayElement;

	var createDisplay = function(id, container) {
		var display = document.createElement('div');
		display.setAttribute('id', id); 
		display.style.fontSize = 'xx-small';

		container.appendChild(display);
	}

	var create = function() {
		displayElement = document.createElement('div');

		createDisplay('goPoolDisplay', displayElement);
		createDisplay('coPoolDisplay', displayElement);
		createDisplay('soundPlayerDisplay', displayElement);
		createDisplay('timerFactoryDisplay', displayElement);
		createDisplay('imageCacheDisplay', displayElement);
		createDisplay('pathCacheDisplay', displayElement);
		createDisplay('textCacheDisplay', displayElement);
		createDisplay('jsonCacheDisplay', displayElement);
		
		gb.game.mainContainer.appendChild(displayElement);
	}

	var updatePool = function(name, pool, displayId) {
		return function() {
			var display = document.getElementById(displayId);

			var text = name + ' => Total / Active';
			var numbers = pool.getTotalPooledObjectsCount() + ' / ' + pool.getTotalActiveObjectsCount();

			display.innerText = text + ' - ' + numbers;
		}
	}

	var updateCache = function(name, cache, displayId) {
		return function() {
			var display = document.getElementById(displayId);

			var text = name + ' => Total Object: ';
			var numbers = cache.getTotalCount();

			display.innerText = text + numbers;
		}
	}

	var updatGoPool = updatePool('Game Object Pool', gameObjectPool, 'goPoolDisplay');
	var updatCoPool = updatePool('Component Pool', componentPool, 'coPoolDisplay');

	var updatJsonCache = updateCache('Json Cache', jsonCache, 'jsonCacheDisplay');
	var updateImageCache = updateCache('Image Cache', imageCache, 'imageCacheDisplay');
	var updatPathCache = updateCache('Path Cache', pathCache, 'pathCacheDisplay');
	var updatTextCache = updateCache('Text Cache', textCache, 'textCacheDisplay');

	ActivityDisplay.prototype.show = function() {
		if(!displayElement) {
			create();
		}

		gameObjectPool.single(gameObjectPool.INIT, this, updatGoPool);
		gameObjectPool.single(gameObjectPool.GET, this, updatGoPool);
		gameObjectPool.single(gameObjectPool.RETURN, this, updatGoPool);
		gameObjectPool.single(gameObjectPool.CLEAR, this, updatGoPool);

		componentPool.single(componentPool.INIT, this, updatCoPool);
		componentPool.single(componentPool.GET, this, updatCoPool);
		componentPool.single(componentPool.RETURN, this, updatCoPool);
		componentPool.single(componentPool.CLEAR, this, updatCoPool);

		jsonCache.single(jsonCache.CACHE, this, updatJsonCache);
		jsonCache.single(jsonCache.CLEAR, this, updatJsonCache);
		jsonCache.single(jsonCache.CLEAR_ALL, this, updatJsonCache);

		gameObjectPool.execute('init');
		componentPool.execute('init');
		jsonCache.execute('cache');

		displayElement.style.visibility = 'visible';
	}

	ActivityDisplay.prototype.hide = function() {
		gameObjectPool.remove(gameObjectPool.INIT, this, updatGoPool);
		gameObjectPool.remove(gameObjectPool.GET, this, updatGoPool);
		gameObjectPool.remove(gameObjectPool.RETURN, this, updatGoPool);
		gameObjectPool.remove(gameObjectPool.CLEAR, this, updatGoPool);

		componentPool.remove(componentPool.INIT, this, updatCoPool);
		componentPool.remove(componentPool.GET, this, updatCoPool);
		componentPool.remove(componentPool.RETURN, this, updatCoPool);
		componentPool.remove(componentPool.CLEAR, this, updatCoPool);

		jsonCache.remove(jsonCache.CACHE, this, updatJsonCache);
		jsonCache.remove(jsonCache.CLEAR, this, updatJsonCache);
		jsonCache.remove(jsonCache.CLEAR_ALL, this, updatJsonCache);

		displayElement.style.visibility = 'hidden';
	}

	return new ActivityDisplay();
});