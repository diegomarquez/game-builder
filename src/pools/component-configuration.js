/**
 * # component-configuration.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module describes the kind of objects that are held by the [component-pool](@@component-pool@@)
 */

/**
 * Component Configuration
 * --------------------------------
 */

define(function(require) {

	var ComponentConfiguration = function(pool, type, alias) {
		this.componentId = type;
		this.alias = alias;

		this.componentArgs = null;

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
	 * The id of the pool that this configuration takes [components](@@component@@) from
	 *
	 * @return {String}
	 */
	ComponentConfiguration.prototype.typeId = function() {
		return this.type;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>configurationId</strong></p>
	 *
	 * The id the activated [components](@@components@@) will get
	 *
	 * @return {String}
	 */
	ComponentConfiguration.prototype.configurationId = function() {
		return this.alias;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>args</strong></p>
	 *
	 * Set which arguments this configuration will apply to a[component](@@component@@)
	 *
	 * @param {Object} args
	 */
	ComponentConfiguration.prototype.args = function(args) {
		this.componentArgs = args;
		this.pool.execute(this.pool.UPDATE_CONFIGURATION, this);
	};
	/**
	 * --------------------------------
	 */

	return ComponentConfiguration;
});
