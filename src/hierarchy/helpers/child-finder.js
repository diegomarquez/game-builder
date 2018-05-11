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
 * This module encapsulates the logic to search through the structure of a [game-object-container](@@game-object-container@@)
 *
 * Call the **findChildren** method of a [game-object-container](@@game-object-container@@) to get a handle of this object.
 *
 * Ej.
 *
 * ``` javascript
 * gameObject.findChildren().not().recurse().allWithType('AN_ID'));
 * ```
 *
 * The previous example will return an array with all the children that do not have the specified ID. The search will be recursive.
 */

/**
 * Find Children
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function() {

	var user = null;
	var not = false;
	var recurse = false;

	var ChildFinder = function() {

	}

	/**
	 * <p style='color:#AD071D'><strong>user</strong></p>
	 *
	 * Chain this method to set the current [game-object-container](@@game-object-container@@) that will be affected
	 *
	 * @param {Object} user
	 */
	ChildFinder.prototype.user = function(u) {
		user = u;
		recurse = false;
		not = false;

		return this;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>recurse</strong></p>
	 *
	 * Chain this method to search for children recursively
	 *
	 * @return {Object} The 'this' pointer
	 */
	ChildFinder.prototype.recurse = function() {
		recurse = true;

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
	ChildFinder.prototype.not = function() {
		not = true;

		return this;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>all</strong></p>
	 *
	 * Chain this method to select all the children that return true for the given function
	 *
	 * @param {Function} f Test function to decide whether a child should be returned or not in the result.
	 *
	 * @return {Array}
	 */
	ChildFinder.prototype.all = function(f) {
		return common(f, 'all', 'truthyResult', 'collection', not, recurse);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>allWithType</strong></p>
	 *
	 * Chain this method to search for [game-objects](@@game-object@@) with a matching poolId or typeId
	 *
	 * @param {String} type
	 *
	 * @return {Array}
	 */
	ChildFinder.prototype.allWithType = function(type) {
		return common(type, 'allWithType', 'matchingId', 'collection', not, recurse);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>first</strong></p>
	 *
	 * Chain this method to select the first child that returns true for the given function
	 *
	 * @param {Function} f Test function.
	 *
	 * @return {Object | null}
	 */
	ChildFinder.prototype.first = function(f) {
		return common(f, 'first', 'truthyResult', 'single', not, recurse);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>firstWithType</strong></p>
	 *
	 * Chain this method to search for the first [game-objects](@@game-object@@) with a matching poolId or typeId
	 *
	 * @param {String} type
	 *
	 * @return {Object | null}
	 */
	ChildFinder.prototype.firstWithType = function(type) {
		return common(type, 'firstWithType', 'matchingId', 'single', not, recurse);
	};
	/**
	 * --------------------------------
	 */

	var common = function(condition, findMethod, conditionChecker, resultType, negate, recursive) {
		if (user === null)
			return;

		var r;

		if (resultType == 'collection') {
			r = [];
		}

		if (resultType == 'single') {
			r = null;
		}

		if (!user.childs) {
			user = null;
			return r;
		}

		r = resultTypes[resultType](user.childs, condition, findMethod, conditionChecker, r, negate, recursive);

		user = null;
		return r;
	}

	var conditionCheckers = {
		'matchingId': function(c, id, negate) {
			return (c.typeId == id || c.poolId == id) ^ negate;
		},

		'truthyResult': function(c, f, negate) {
			return (!f || f(c)) ^ negate;
		}
	}

	var resultTypes = {
		'collection': function(childs, condition, findMethod, conditionChecker, r, negate, recursive) {
			for (var i = 0; i < childs.length; i++) {
				var c = childs[i];

				if (conditionCheckers[conditionChecker](c, condition, negate)) {
					r.push(c);
				}

				if (recursive) {
					if (c.isContainer()) {

						var cr;

						if (negate) {
							cr = c.findChildren()
								.recurse()
								.not()[findMethod](condition);
						} else {
							cr = c.findChildren()
								.recurse()[findMethod](condition);
						}

						if (cr) {
							r = r.concat(cr);
						}
					}
				}
			}

			return r;
		},

		'single': function(childs, condition, findMethod, conditionChecker, r, negate, recursive) {
			for (var i = 0; i < childs.length; i++) {
				var c = childs[i];

				if (conditionCheckers[conditionChecker](c, condition, negate)) {
					return c;
				}
			}

			if (recursive) {
				for (var i = 0; i < childs.length; i++) {
					c = childs[i];

					if (c.isContainer()) {
						if (negate) {
							return c.findChildren()
								.recurse()
								.not()[findMethod](condition);
						} else {
							return c.findChildren()
								.recurse()[findMethod](condition);
						}
					}
				}
			}
		}
	}

	return new ChildFinder();
});
