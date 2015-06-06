/**
 * # visibility-control.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module provides finer control when deciding which children of a [game-object-container](@@game-object-container@@)
 * should be hidden or shown along with it's parent. The default functionality is all of them, but sometimes you might want something else.
 *
 * Call the **show** and **hide** methods of a [game-object-container](@@game-object-container@@) with a single boolean parameter with a value of true
 * to get a handle of this object.
 *
 * Ej.
 * 
 * ``` javascript  
 * gameObject.hide(true).recurse().not().allWithType('AN_ID'));
 * ```
 *
 * The previous example would hide the [game-object-cotainer](@@game-object-cotainer@@) itself along with any children in all of it's
 * heriarchy that did not match the specified type.
 */

/**
 * Visibility Control
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(function() {

	var user = null;
	var visibility = null;
	var userVisibilityMethod = null;
	var not = false;
	var recurse = false;

	var VisibilityControl = function() {

	}

	/**
	 * <p style='color:#AD071D'><strong>user</strong></p>
	 *
	 * Chain this method to set the current [game-object-container](@@game-object-container@@) that will be affected
	 * 
	 * @param {Object} user
	 */
	VisibilityControl.prototype.user = function (u) {
		user = u;

		return this;
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>hide</strong></p>
	 *
	 * Chain this method to hide the user [game-object-container](@@game-object-container@@) and it's selected children
	 * 
	 * @param {Function} uvm The **hide** method of the current user [game-object-container](@@game-object-container@@) super class
	 */
	VisibilityControl.prototype.hide = function (uvm) {
		visibility = false;
		userVisibilityMethod = uvm;

		return this;
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>show</strong></p>
	 *
	 * Chain this method to show the user [game-object-container](@@game-object-container@@) and it's selected children
	 * 
	 * @param {Function} uvm The **show** method of the current user [game-object-container](@@game-object-container@@) super class
	 */
	VisibilityControl.prototype.show = function (uvm) {
		visibility = true;
		userVisibilityMethod = uvm;

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
	VisibilityControl.prototype.recurse = function () {
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
	VisibilityControl.prototype.not = function () {
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
	VisibilityControl.prototype.all = function (f) {
		common(all, f);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>allWithProp</strong></p>
	 *
	 * Chain this method to search for a matching property name
	 * 
	 * @param  {String} propName A property name to search for in the user [game-object-container](@@game-object-container@@) and it's children
	 */
	VisibilityControl.prototype.allWithProp = function (propName) {
		common(withProp, propName);
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
	VisibilityControl.prototype.allWithType = function (type) {
		common(withType, type);
	};
	/**
	 * --------------------------------
	 */

	var common = function(pass, args) {
		if (user === null || visibility === null || userVisibilityMethod === null)
			return;

		userVisibilityMethod.call(user);

		pass(args);

		user = null;
		recurse = false;
		not = false;
	}

	find = function() {
		var finder = user.findChildren();

		if (not) {
			finder = finder.not();
		}

		if (recurse) {
			finder = finder.recurse();
		}

		return finder;
	}

	all = function(f) {
		iterate(find().all(f));
	}

	withProp = function(propName) {
		iterate(find().allWithProp(propName));
	}

	withType = function(type) {
		iterate(find().allWithType(type));
	}

	var iterate = function(children) {
		if (!children) return;

		children.forEach(eachChild);
	}

	var eachChild = function (child) {
		if (visibility) {
			child.show();
		}	
		else {
			child.hide();
		}
	} 

	return new VisibilityControl();
});