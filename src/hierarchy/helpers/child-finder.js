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
	ChildFinder.prototype.user = function (u) {
		user = u;

		return this;
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>recurse</strong></p>
	 *
	 * Chain this method to search for children recursively
	 */
	ChildFinder.prototype.recurse = function () {
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
	 */
	ChildFinder.prototype.not = function () {
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
	 * @param  {Function} f Test function to decide whether a child should change it's visibility. Receives a [game-object](@@game-object@@) as argument. Must return true or false.
	 */
	ChildFinder.prototype.all = function (f) {
		return common(all, f, 'all', 'truthyResult', 'collection');
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>allWithType</strong></p>
	 *
	 * Chain this method to search for [game-objects](@@game-object@@) with a mathing poolId or typeId
	 * 
	 * @param  {String} type
	 */
	ChildFinder.prototype.allWithType = function (type) {
		return common(withType, type, 'allWithType', 'matchingId', 'collection');
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>all</strong></p>
	 *
	 * Chain this method to select all the children that return true for the given function
	 * 
	 * @param  {Function} f Test function to decide whether a child should change it's visibility. Receives a [game-object](@@game-object@@) as argument. Must return true or false.
	 */
	ChildFinder.prototype.first = function (f) {
		return common(first, f, 'first', 'truthyResult', 'single');
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>allWithType</strong></p>
	 *
	 * Chain this method to search for [game-objects](@@game-object@@) with a mathing poolId or typeId
	 * 
	 * @param  {String} type
	 */
	ChildFinder.prototype.firstWithType = function (type) {
		return common(firstWithType, type, 'firstWithType', 'matchingId', 'single');
	};
	/**
	 * --------------------------------
	 */

	var commonFirst = function(pass, condition, findMethod, conditionChecker) {
		if (user === null)
			return;

		pass(condition, findMethod, conditionChecker);

		recurse = false;
		not = false;
		user = null;
	}

	var all = function(f, findMethod, conditionChecker) {
		var r = [];

		if (!user.childs) return r;

		var childCount = user.childs.length;

		for (var i = 0; i < childCount; i++) {
			var c = user.childs[i];

			if (truthyResult(c, f)) {
				r.push(c);
			}

			if (recurse) {
				if (c.isContainer()) {
					var cr = c.findChildren().all(f);
					
					if (cr) {
						r = r.concat(cr);		
					}
				}	
			}
		}

		return r;
	}

	var first = function(f) {
		if (!user.childs) return;

		var c;
		var childCount = user.childs.length;

		for (var i = 0; i < childCount; i++) {
			c = user.childs[i];

			if (truthyResult(c, f)) {
				return c;
			}
		}

		if (recurse) {
			for (var i = 0; i < childCount; i++) {
				c = user.childs[i];
				
				if (c.isContainer()) {
					return c.findChildren().first(f);
				}
			}	
		}
	}

	var withType = function(type) {
		if (!user.childs) return emptyResult;

		var r;
		var childCount = self.childs.length;

		for (var i = 0; i < childCount; i++) {
			var c = user.childs[i];

			if (matchingId(c, id)) {
				if (!r) r = [];
				r.push(c);
			}

			if (recurse) {
				if (c.isContainer()) {
					var cr = c.findChildren().allWithType(id);
					
					if (cr) {
						if (!r) r = [];
						r = r.concat(cr);		
					}
				}
			}
		}

		return r;
	}

	var firstWithType = function(type) {
		if (!user.childs) return;
					
		var c;
		var childCount = user.childs.length;

		for (var i = 0; i < childCount; i++) {
			c = user.childs[i];

			if (matchingId(c, id)) {
				return c;
			}
		}

		if (recurse) {
			for (var i = 0; i < childCount; i++) {
				c = user.childs[i];
				
				if (c.isContainer()) {
					return c.findChildren().firstWithType(id);
				}
			}	
		}
	}

	var matchingId = function(child, id) {
		return (c.typeId == id || c.poolId == id) ^ not);
	}

	var truthyResult = function(child, f) {
		return ((!f || f(c)) ^ not);
	} 

	return new ChildFinder();
});