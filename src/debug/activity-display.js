/**
 * # activity-display.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [extension](@@extension@@)
 *
 * Depends of: 
 * [gb](@@gb@@)
 * [util](@@util@@)
 * [game-object-pool](@@game-object-pool@@)
 * [component-pool](@@component-pool@@)
 * [json-cache](@@json-cache@@)
 * [image-cache](@@image-cache@@)
 * [path-cache](@@path-cache@@)
 * [text-cache](@@text-cache@@)
 * [sound-player](@@sound-player@@)
 * [timer-factory](@@timer-factory@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module displays information on everything that is pooled and cached in [Game-Builder](http://diegomarquez.github.io/game-builder)
 */

/**
 * Activity display
 * --------------------------------
 */


/**
 * --------------------------------
 */
define(function(require) {
	var gb = require('gb');
	var util = require('util');

	var gameObjectPool = require('game-object-pool');
	var componentPool = require('component-pool');
	var jsonCache = require('json-cache');
	var imageCache = require('image-cache');
	var pathCache = require('path-cache');
	var textCache = require('text-cache');
	var soundPlayer = require('sound-player');
	var timerFactory = require('timer-factory');

	var displayElement;
	var displays = [];

	var getDisplay = function(object, listener, trigger, events) {
		return {
			object: object,
			listener: listener,
			trigger: trigger,
			events: events
		}
	};

	var createDisplay = function(id, container) {
		var display = document.createElement('div');
		display.setAttribute('id', id); 
		display.style.fontSize = '10px';
		display.style.fontWeight = 'bold';
		display.style.color = '#fff';
		display.style.margin = '1px';
		display.style.padding = '1px';

		container.appendChild(display);
	};

	var positionInfoButton = function (element) {
		var x = 5;
		var y = gb.canvas.clientTop + gb.canvas.clientHeight - element.clientHeight - 5;

		displayElement.style.top = y + 'px';
		displayElement.style.left = x + 'px';
	};

	var updatePool = function(name, pool, displayId) {
		return function() {
			var display = document.getElementById(displayId);

			var text = name + ' => ';
			var numbers = [pool.getTotalActiveObjectsCount(), pool.getTotalPooledObjectsCount()];

			display.innerText = text + numbers.join(' / ');
		}
	};

	var updateCache = function(name, cache, displayId) {
		return function() {
			var display = document.getElementById(displayId);

			var text = name + ' => ';
			var numbers = cache.getTotalCount();

			display.innerText = text + numbers;
		}
	};

	var updateSoundDisplay = function() {
		var display = document.getElementById('soundPlayerDisplay');

		var text = 'Sound Player => ';
		var numbers = [soundPlayer.getPooledCount(), soundPlayer.getActiveCount(), soundPlayer.getAssignedCount(), soundPlayer.getPooledCount() + soundPlayer.getActiveCount() + soundPlayer.getAssignedCount()];

		display.innerText = text + numbers.join('/');
	};

	var updateTimerDisplay = function() {
		var display = document.getElementById('timerFactoryDisplay');

		var text = 'Timer Factory => ';
		var numbers = [timerFactory.getRunningCount(), timerFactory.getPausedCount(), timerFactory.getStoppedCount(), timerFactory.getTotalCount()];

		display.innerText = text + numbers.join('/');
	};

	displays.push(getDisplay(gameObjectPool, updatePool('Game Object Pool', gameObjectPool, 'goPoolDisplay'), 'init', ['INIT', 'GET', 'RETURN', 'CLEAR', 'CLEAR_OBJECTS', 'CLEAR_CONFIGURATION', 'CLEAR_CONFIGURATIONS']));
	displays.push(getDisplay(componentPool, updatePool('Component Pool', componentPool, 'coPoolDisplay'), 'init', ['INIT', 'GET', 'RETURN', 'CLEAR', 'CLEAR_OBJECTS', 'CLEAR_CONFIGURATION', 'CLEAR_CONFIGURATIONS']));
	displays.push(getDisplay(jsonCache, updateCache('Json Cache', jsonCache, 'jsonCacheDisplay'), 'cache', ['CACHE', 'CLEAR', 'CLEAR_ALL']));
	displays.push(getDisplay(imageCache, updateCache('Image Cache', imageCache, 'imageCacheDisplay'), 'cache', ['CACHE', 'CLEAR', 'CLEAR_ALL']));
	displays.push(getDisplay(pathCache, updateCache('Path Cache', pathCache, 'pathCacheDisplay'), 'cache', ['CACHE', 'CLEAR', 'CLEAR_ALL']));
	displays.push(getDisplay(textCache, updateCache('Text Cache', textCache, 'textCacheDisplay'), 'cache', ['CACHE', 'CLEAR', 'CLEAR_ALL']));
	displays.push(getDisplay(soundPlayer, updateSoundDisplay, 'play_single', ['ON_LOAD_ALL_COMPLETE', 'ON_LOAD_COMPLETE', 'CHANNELS_ASSIGN', 'CHANNELS_REVOKE', 'SINGLE_COMPLETE', 'PLAY_SINGLE', 'PLAY_LOOP', 'PAUSE', 'RESUME', 'STOP']));
	displays.push(getDisplay(timerFactory, updateTimerDisplay, 'create', ['CREATE', 'REMOVE', 'COMPLETE', 'REPEATE', 'START', 'PAUSE', 'RESUME', 'RESET', 'STOP']));

	var ActivityDisplay = require('extension').extend({
		init: function() {},

		type: function() {
			return gb.game.CREATE;
		},

		execute: function(args) {
			var hide = false;

			if (args) {
				hide = args.hide || false;
			}

			displayElement = document.createElement('div');
			displayElement.id = 'activity-display';

			var infoContainer = document.createElement('div');
			infoContainer.id = 'activity-display-info-container';

			var infoButton = document.createElement('button');
			infoButton.id = 'activity-display-button';
			infoButton.innerText = 'Show Info';
			infoButton.style.visibility = hide ? 'hidden' : 'visible';

			infoButton.addEventListener('click', function() {
				if (this.innerText == 'Show Info') {
					this.innerText = 'Hide Info';
					infoContainer.style.display = 'block';
				} else {
					this.innerText = 'Show Info';
					infoContainer.style.display = 'none';
				}

				positionInfoButton(displayElement);
			});

			createDisplay('goPoolDisplay', infoContainer);
			createDisplay('coPoolDisplay', infoContainer);
			createDisplay('jsonCacheDisplay', infoContainer);
			createDisplay('imageCacheDisplay', infoContainer);
			createDisplay('pathCacheDisplay', infoContainer);
			createDisplay('textCacheDisplay', infoContainer);
			createDisplay('soundPlayerDisplay', infoContainer);
			createDisplay('timerFactoryDisplay', infoContainer);

			displayElement.appendChild(infoButton);
			displayElement.appendChild(infoContainer);
			
			infoContainer.style.display = 'none';
			displayElement.style.position = 'absolute';

			gb.game.mainContainer.appendChild(displayElement);

			positionInfoButton(displayElement);

			for(var i = 0; i < displays.length; i++) {
				var p = displays[i];

				var events = p.events;

				for(var j = 0; j < events.length; j++) {
					p.object.single(p.object[events[j]], this, p.listener, 'activity-display');
				}

				p.object.execute(p.trigger);
			}
		},

		destroy: function() {
			gb.game.mainContainer.removeChild(displayElement);

			gameObjectPool.levelCleanUp('activity-display');
			componentPool.levelCleanUp('activity-display');
			jsonCache.levelCleanUp('activity-display');
			imageCache.levelCleanUp('activity-display');
			pathCache.levelCleanUp('activity-display');
			textCache.levelCleanUp('activity-display');
			soundPlayer.levelCleanUp('activity-display');
			timerFactory.levelCleanUp('activity-display');
		},

		toggle: function() {
			var infoContainer = document.getElementById('activity-display-info-container');

			if (infoContainer.style.display == 'block') {
				infoContainer.style.display = 'none';
			} else {
				infoContainer.style.display = 'block';
			}

			positionInfoButton(displayElement);
		}
	});

	return ActivityDisplay;
});