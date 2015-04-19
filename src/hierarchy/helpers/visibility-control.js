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

	/**
	 * [VisibilityControl description]
	 * <p style='color:#AD071D'><strong>{{method}}</strong></p>
	 */
	var VisibilityControl = function() {

	}
	/**
	 * --------------------------------
	 */

	/**
	 * [setUser description]
	 * <p style='color:#AD071D'><strong>{{method}}</strong></p>
	 *
	 * @param {[type]} user [description]
	 */
	VisibilityControl.prototype.user = function (u) {
		user = u;

		return this;
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * [setUser description]
	 * <p style='color:#AD071D'><strong>{{method}}</strong></p>
	 *
	 * @param {[type]} user [description]
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
	 * [setUser description]
	 * <p style='color:#AD071D'><strong>{{method}}</strong></p>
	 *
	 * @param {[type]} user [description]
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
	 * [setUser description]
	 * <p style='color:#AD071D'><strong>{{method}}</strong></p>
	 *
	 * @param {[type]} user [description]
	 */
	VisibilityControl.prototype.recurse = function () {
		recurse = true;
		
		return this;
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * [setUser description]
	 * <p style='color:#AD071D'><strong>{{method}}</strong></p>
	 *
	 * @param {[type]} user [description]
	 */
	VisibilityControl.prototype.not = function () {
		not = true;
		
		return this;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * [all description]
	 * <p style='color:#AD071D'><strong>{{method}}</strong></p>
	 *
	 * @param  {[type]} f [description]
	 *
	 * @return {[type]}   [description]
	 */
	VisibilityControl.prototype.all = function (f) {
		common(all, f);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * [allWithProp description]
	 * <p style='color:#AD071D'><strong>{{method}}</strong></p>
	 *
	 * @param  {[type]} propName [description]
	 *
	 * @return {[type]}          [description]
	 */
	VisibilityControl.prototype.allWithProp = function (propName) {
		common(withProp, propName);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * [allWithType description]
	 * <p style='color:#AD071D'><strong>{{method}}</strong></p>
	 *
	 * @param  {[type]} type [description]
	 *
	 * @return {[type]}      [description]
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