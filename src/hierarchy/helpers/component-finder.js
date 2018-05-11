/**
 * # child-finder.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module encapsulates the logic to search for [components](@@component@@) of a [game-object](@@game-object@@)
 *
 * Call the **findComponents** method of a [game-object](@@game-object@@) to get a handle of this object.
 *
 * Ej.
 *
 * ``` javascript
 * gameObject.findComponents().not().allWithType('AN_ID'));
 * ```
 *
 * The previous example will return an array with all the [componets](@@componet@@) that do not have the specified ID.
 */

/**
 * Find Components
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function() {

	var user = null;
	var not = false;

	var ComponentFinder = function() {

	}

	/**
	 * <p style='color:#AD071D'><strong>user</strong></p>
	 *
	 * Chain this method to set the current [game-object](@@game-object@@) that will be affected
	 *
	 * @param {Object} user
	 *
	 * @return {Object} The 'this' pointer
	 */
	ComponentFinder.prototype.user = function(u) {
		user = u;
		not = false;

		return this;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>not</strong></p>
	 *
	 * Chain this method to negate the search criteria
	 *
	 * @return {Object} The 'this' pointer
	 */
	ComponentFinder.prototype.not = function() {
		not = true;

		return this;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>all</strong></p>
	 *
	 * Chain this method to select all the [components](@@component@@) that return true for the given function
	 *
	 * @param {Function} f Test function to decide whether a [component](@@component@@) should be returned or not in the result.
	 *
	 * @return {Array}
	 */
	ComponentFinder.prototype.all = function(f) {
		return common(f, 'all', 'truthyResult', 'collection', not);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>allWithType</strong></p>
	 *
	 * Chain this method to search for [components](@@component@@) with a matching poolId or typeId
	 *
	 * @param {String} type
	 *
	 * @return {Array}
	 */
	ComponentFinder.prototype.allWithType = function(type) {
		return common(type, 'allWithType', 'matchingId', 'collection', not);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>allWithProp</strong></p>
	 *
	 * Chain this method to search for [components](@@components@@) that have the specified property
	 *
	 * @param {String} prop
	 *
	 * @return {Array}
	 */
	ComponentFinder.prototype.allWithProp = function(prop) {
		return common(prop, 'allWithProp', 'matchingProp', 'collection', not);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>first</strong></p>
	 *
	 * Chain this method to select the first [component](@@component@@) that returns true for the given function
	 *
	 * @param {Function} f Test function.
	 *
	 * @return {Object | null}
	 */
	ComponentFinder.prototype.first = function(f) {
		return common(f, 'first', 'truthyResult', 'single', not);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>firstWithType</strong></p>
	 *
	 * Chain this method to search for the first [components](@@components@@) with a matching poolId or typeId
	 *
	 * @param {String} type
	 *
	 * @return {Object | null}
	 */
	ComponentFinder.prototype.firstWithType = function(type) {
		return common(type, 'firstWithType', 'matchingId', 'single', not);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>firstWithType</strong></p>
	 *
	 * Chain this method to search for the first [component](@@component@@) with a matching poolId or typeId
	 *
	 * @param {String} prop
	 *
	 * @return {Object | null}
	 */
	ComponentFinder.prototype.firstWithProp = function(prop) {
		return common(prop, 'firstWithType', 'matchingProp', 'single', not);
	};
	/**
	 * --------------------------------
	 */

	var common = function(condition, findMethod, conditionChecker, resultType, negate) {
		if (user === null)
			return;

		var r;

		if (resultType == 'collection') {
			r = [];
		}

		if (resultType == 'single') {
			r = null;
		}

		if (!user.components) {
			user = null;
			return r;
		}

		r = resultTypes[resultType](user.components, condition, findMethod, conditionChecker, r, negate);

		user = null;
		return r;
	}

	var conditionCheckers = {
		'matchingId': function(c, id, negate) {
			return (c.typeId == id || c.poolId == id) ^ negate;
		},

		'matchingProp': function(c, prop, negate) {
			return (prop in c) ^ negate;
		},

		'truthyResult': function(c, f, negate) {
			return (!f || f(c)) ^ negate;
		}
	}

	var resultTypes = {
		'collection': function(components, condition, findMethod, conditionChecker, r, negate) {
			for (var i = 0; i < components.length; i++) {
				var c = components[i];

				if (conditionCheckers[conditionChecker](c, condition, negate)) {
					r.push(c);
				}
			}

			return r;
		},

		'single': function(components, condition, findMethod, conditionChecker, r, negate) {
			for (var i = 0; i < components.length; i++) {
				var c = components[i];

				if (conditionCheckers[conditionChecker](c, condition, negate)) {
					return c;
				}
			}
		}
	}

	return new ComponentFinder();
});
