/**
 * # game-object-configuration.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module describes the kind of objects that are held by the [game-object-pool](@@game-object-pool@@)
 */

/**
 * Game Object Configuration
 * --------------------------------
 */

define(function(require) {

	var getComponentDescription = function(id, args) {
		return {
			componentId: id,
			args: args
		}
	}

	var GameObjectConfiguration = function(pool, type, alias) {
		this.type = type;
		this.alias = alias;
		this.hardArguments = null;
		this.childs = [];
		this.components = [];
		this.renderer = null;

		Object.defineProperty(this, "pool", {
			configurable: false,
			enumerable: false,
			writable: false,
			value: pool
		});
	};



	/**
	 * <p style='color:#AD071D'><strong>typeId</strong></p>
	 *
	 * The id of the pool that objects are going to be taken off when building the [game-object](@@game-object@@)
	 * described in this configuration
	 *
	 * @return {String}
	 */
	GameObjectConfiguration.prototype.typeId = function() {
		return this.type;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>configurationId</strong></p>
	 *
	 * The id the built [game-object](@@game-object@@) will get
	 *
	 * @return {String}
	 */
	GameObjectConfiguration.prototype.configurationId = function() {
		return this.alias;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>args</strong></p>
	 *
	 * Set which arguments this configuration will apply to a [game-object](@@game-object@@). This method is chainable
	 *
	 * @param {Object} args
	 *
	 * @return {Object}
	 */
	GameObjectConfiguration.prototype.args = function(args) {
		this.hardArguments = args;
		this.pool.execute(this.pool.UPDATE_CONFIGURATION, this);
		return this;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>addChild</strong></p>
	 *
	 * Add a child, specifying an existing [game-object](@@game-object@@) configuration id,
	 * and arguments the child will take when initialized. This method is chainable
	 *
	 * @param {String} childId
	 * @param {Object} args
	 *
	 * @return {Object}
	 */
	GameObjectConfiguration.prototype.addChild = function(childId, args) {
		this.childs.push({
			childId: childId,
			args: args
		});

		this.pool.execute(this.pool.UPDATE_CONFIGURATION, this);
		return this;
	}
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>addComponent</strong></p>
	 *
	 * Add a [component](@@component@@), specifying an existing [component](@@component@@) configuration id,
	 * and arguments the component will take when initialized. This method is chainable
	 *
	 * @param {String} componentId
	 * @param {Object} args
	 *
	 * @return {Object}
	 */
	GameObjectConfiguration.prototype.addComponent = function(componentId, args) {
		this.components.push(getComponentDescription(componentId, args));
		this.pool.execute(this.pool.UPDATE_CONFIGURATION, this);
		return this;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>setRenderer</strong></p>
	 *
	 * Set a renderer, specifying an existing [component](@@component@@) configuration id,
	 * and arguments the renderer will take when initialized. This method is chainable
	 *
	 * @param {String} rendererId
	 * @param {Object} args
	 *
	 * @return {Object}
	 */
	GameObjectConfiguration.prototype.setRenderer = function(rendererId, args) {
		this.renderer = getComponentDescription(rendererId, args);
		this.pool.execute(this.pool.UPDATE_CONFIGURATION, this);
		return this;
	};
	/**
	 * --------------------------------
	 */

	return GameObjectConfiguration;
});
