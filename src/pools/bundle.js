/**
 * # bundle.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [class](@@class@@)
 *
 * Depends of:
 * [gb](@@gb@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This is a helper module to define a block of [game-object-pool](@@game-object-pool@@) and
 * [component-pool](@@component-pool@@) configurations.
 *
 * The basic workflow is extending this module and putting all the required code
 * to configure the pools in there. That way you can reuse that code in different places.
 *
 * The module defines five convinience methods
 * </br>
 * **createComponentPool**,
 * </br>
 * **createGameObjectPool**,
 * </br>
 * **createDynamicGameObjectPool**,
 * </br>
 * **createComponentConfiguration**
 * </br>
 * and **createGameObjectConfiguration**
 *
 * These should make setting up the [game-object-pool](@@game-object-pool@@) and the [component-pool](@@component-pool@@) a little easier.
 *
 * An additional feature is that getter methods are created dynamically in the bundle prototype for pools and configurations
 * defined using any of the methods described above.
 * These dynamic methods return the ids used for a pool or a configuration. In the case that you want to use a configuration id
 * or a pool id defined in a bundle, you don't have to use the raw string in your code, instead you can **require** the corresponding
 * bundle, and call one of these methods to get the id you are looking for.
 *
 * Ej.
 * ```
 * // This method sets up a component pool using the 'circle-collider' module
 * this.createComponentPool(function() { return require('circle-collider') });
 *
 * // As a result this method is created in the prototype
 * // which returns the string 'circle-collider'
 * this.getCircleColliderPoolId()
 *
 * ```
 *
 * Ej.
 * ```
 *
 * // This method sets up a game object pool using the 'game-object' module
 * this.createGameObjectPool(function() { return require('game-object') }, 10);
 *
 * // As a result this method is created in the prototype
 * // which returns the string 'game-object'
 * this.getGameObjectPoolId()
 *
 * ```
 *
 * Ej.
 * ```
 *
 * // This method creates a configuration for a game object pool
 * this.createGameObjectConfiguration('Object_1', 'Pool_1');
 *
 * // As a result this method is created in the prototype
 * // which returns the string 'Object_1'
 * this.getObject_1ConfigurationId()
 *
 * ```
 */

/**
 * Bundle up!
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function(require) {
	var Bundle = require('class')
		.extend({
			init: function() {
				var gb = require('gb');

				this.gameObjectPool = gb.goPool;
				this.componentPool = gb.coPool;
				this.canvas = gb.canvas;
				this.assetMap = gb.assetMap();
			},

			/**
			 * <p style='color:#AD071D'><strong>create</strong></p>
			 *
			 * Modules extending this one should implement this method.
			 *
			 * @throws {Error} If it is not overriden
			 * @param {Object} [args=null]
			 */
			create: function(args) {
				require('error-printer')
					.mustOverrideError('Bundle');
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>createComponentPool</strong></p>
			 *
			 * Creates a component pool. The name is generated from the function provided as argument
			 *
			 * ```
			 * this.createComponentPool(function() { return require('a-component-module-name')});
			 * ```
			 *
			 * It is necessary to use that syntax so the name can be infered from the argument
			 *
			 * @param {Function} moduleGetter A function that returns the result of a **require** call
			 */
			createComponentPool: function(moduleGetter) {
				var name = getModuleName(moduleGetter);

				this.componentPool.createPool(name, moduleGetter());
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>createGameObjectPool</strong></p>
			 *
			 * Creates a game object pool. The name is generated from the function provided as argument
			 *
			 * ```
			 * this.createGameObjectPool(function() { return require('a-game-object-module-name')}, 10);
			 * ```
			 *
			 * It is necessary to use that syntax so the name can be infered from the argument
			 *
			 * @param {Function} moduleGetter A function that returns the result of a **require** call
			 * @param {Number} amount The amount of object the pool will hold
			 */
			createGameObjectPool: function(moduleGetter, amount) {
				var name = getModuleName(moduleGetter);

				this.gameObjectPool.createPool(name, moduleGetter(), amount);

				addPoolIdGetter.call(this, name);
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>createDynamicGameObjectPool</strong></p>
			 *
			 * Creates a dynamic game object pool. The name is generated from the function provided as argument
			 *
			 * ```
			 * this.createDynamicGameObjectPool(function() { return require('a-game-object-module-name')});
			 * ```
			 *
			 * It is necessary to use that syntax so the name can be infered from the argument
			 *
			 * @param {Function} moduleGetter A function that returns the result of a **require** call
			 */
			createDynamicGameObjectPool: function(moduleGetter) {
				var name = getModuleName(moduleGetter);

				this.gameObjectPool.createDynamicPool(name, moduleGetter());

				addPoolIdGetter.call(this, name);
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>createComponentConfiguration</strong></p>
			 *
			 * Creates a configuration for a component pool
			 *
			 * @param {String} configurationId The id that will be used to create objects based on this configuration
			 * @param {String} poolId The id of the basic type of object this configuration referes too
			 *
			 * @return {Object} The configuration
			 */
			createComponentConfiguration: function(configurationId, poolId) {
				var configuration = this.componentPool.createConfiguration(configurationId, poolId);

				addConfigurationIdGetter.call(this, configurationId);

				return configuration;
			},
			/**
			 * --------------------------------
			 */

			/**
			 * <p style='color:#AD071D'><strong>createGameObjectConfiguration</strong></p>
			 *
			 * Creates a configuration for a game object pool
			 *
			 * @param {String} configurationId The id that will be used to create objects based on this configuration
			 * @param {String} poolId The id of the basic type of object this configuration referes too
			 *
			 * @return {Object} The configuration
			 */
			createGameObjectConfiguration: function(configurationId, poolId) {
				var configuration = this.gameObjectPool.createConfiguration(configurationId, poolId);

				addConfigurationIdGetter.call(this, configurationId);

				return configuration;
			}
			/**
			 * --------------------------------
			 */
		});

	var getModuleName = function(moduleGetter) {
		return moduleGetter.toString()
			.match(/\(['|"](.*?)['|"]\)/)[1]
	}

	var addPoolIdGetter = function(name) {
		var n = name.split('-')
			.map(function(word) {
				return word.charAt(0)
					.toUpperCase() + word.slice(1);
			})
			.join("");
		var method = 'get' + n + 'PoolId';

		this.constructor.prototype[method] = function() {
			return name;
		}
	}

	var addConfigurationIdGetter = function(name) {
		var method = 'get' + name + 'ConfigurationId';

		this.constructor.prototype[method] = function() {
			return name;
		}
	}

	return Bundle;
});
