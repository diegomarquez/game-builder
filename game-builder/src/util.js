/**
 * # util.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * All projects have a junk drawer where to drop miscelaneous stuff. In this case, this is it. Maybe
 * I should consider just using a popular library for this kind of thing, 
 * like [lodash](http://lodash.com/) or [underscore](http://underscorejs.org/).
 *
 * They are so little functions though, that using an external library sounds like overkill.
 */

/**
 * Miscelaneous methods
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function() {
	var Utils = function() {}

 	/**
 	 * <p style='color:#AD071D'><strong>shallow_merge</strong></p>
 	 *
 	 * Performs a shallow merge of two objects.
 	 * 
 	 * It is shallow because reference values are kept as references. It creates a new object into which
 	 * all the properties of the first object are copied into, then all the properties of the second object
 	 * are copied into it.
 	 *
 	 * This means that properties of the second object have precedence over those in the first object.
 	 * 
 	 * @param  {Object} first  The first object
 	 * @param  {Object} second The second object
 	 * @return {Object}        Result of merging
 	 */
	Utils.prototype.shallow_merge = function(first, second) {
		var result = {};

		this.shallow_copy(first, result);
		this.shallow_copy(second, result);

		return result;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>shallow_copy</strong></p>
	 *
	 * Performs a shallow copy properties.
	 * 
	 * The copy is shallow because reference values are kept as references.
	 * 
	 * @param  {Object} [from={}] The Object from which to copy properties
	 * @param  {Object} [to={}]   The Object to copy into
	 * @return {Object}			  Result of the copying
	 */
	Utils.prototype.shallow_copy = function(from, to) {
		from = from || {};
		to   = to || {};

		for(var k in from) {
			to[k] = from[k];
		}

		return to;
	};	
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>destroyObject</strong></p>
	 *
	 * Destroys all the properties of an object.
	 * 
	 * @param  {Object} o        Object to destroy properties from          
	 */
	Utils.prototype.destroyObject = function(o) {
		for(var propName in o) {
			if(o.hasOwnProperty(propName)){
				delete o[propName];
			}
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>destroyArray</strong></p>
	 *
	 * Null all the elements of an array.
	 * 
	 * @param  {Array} a        Array to destroy
	 * @param  {Boolean} [resetLength=false] Whether to set the lenght of the array to 0
	 */
	Utils.prototype.destroyArray = function(a, resetLength) {
		for(var i=0; i<a.length; i++) {
			a[i] = null;
		}

		if(resetLength) {
			a.length = 0;	
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>bind</strong></p>
	 *
	 * Get a function binded to the given scope.
	 * 
	 * Managing the scope of functions is a pretty big thing in Javascript.
	 * 
	 * @param  {Function} func  Function to bind
	 * @param  {Oject} scope Scope to bind to
	 * @param  {Object} args  Arguments the binded function will receive
	 * @return {Function}       Binded function
	 */
	Utils.prototype.bind = function(func, scope, args) {
		return function() {
			func.apply(scope, args);
		}
	}
	/**
	 * --------------------------------
	 */

	
	// These functions are helpers to get various types of random values. 
	// They all use Math.random under the hood.
	Utils.prototype.rand_f     = function (min, max) { return Math.random() * (max - min) + min; };
	Utils.prototype.rand_i     = function (min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; };
	Utils.prototype.rand_pair  = function (value1, value2) { return Math.random() >= 0.5 ? value1 : value2; };
	Utils.prototype.rand_b     = function () { return Math.random() >= 0.5 };
	Utils.prototype.rand_color = function () { return '#'+Math.floor(Math.random()*16777215).toString(16); };

	return new Utils();
});