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

	Utils.prototype.distance = function(x1, y1, x2, y2) {
		var deltaX = x1 - x2;
		var deltaY = y1 - y2;

		return Math.sqrt((deltaX * deltaX) + (deltaY * deltaY))
	}

	Utils.prototype.polylineLength = function(polyline) {
		var result = 0;

		for (var i = 0; i < polyline.length - 1; i++) {
			result += this.distance(polyline[i].x, polyline[i].y, polyline[i + 1].x, polyline[i + 1].y);
		}

		return result;
	}

	/**
	 * <p style='color:#AD071D'><strong>normalize</strong></p>
	 *
	 * Normalize the given value in the given range to a number between 0 and 1
	 *
	 * @return {Number}
	 */
	Utils.prototype.normalize = function(v, min, max) {
		return (v - min) / (max - min);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>interpolate</strong></p>
	 *
	 * Interpolate the given value ( A number between 0 and 1 ) to obtain the corresponding number in the given range.
	 *
	 * @return {Number}
	 */
	Utils.prototype.interpolate = function(v, min, max) {
		return min + (max - min) * v;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>map</strong></p>
	 *
	 * Convert the given value from the first range into the second range
	 *
	 * @return {Number}
	 */
	Utils.prototype.map = function(value, min1, max1, min2, max2) {
		return this.interpolate(this.normalize(value, min1, max1), min2, max2);
	};
	/**
	 * --------------------------------
	 */

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
	 * @param {Object} first The first object
	 * @param {Object} second The second object
	 * @return {Object} Result of merging
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
	 * <p style='color:#AD071D'><strong>shallow_merge_many</strong></p>
	 *
	 * Performs a shallow merge of many objects.
	 *
	 * The object which are specified first will be overriden by the ones specified last
	 *
	 * @return {Object} Result of merging
	 */
	Utils.prototype.shallow_merge_many = function() {
		var result = {};

		for (var i = 0; i < arguments.length; i++) {
			if (arguments[i]) {
				this.shallow_copy(arguments[i], result);
			}
		}

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
	 * @param {Object} [from={}] The Object from which to copy properties
	 * @param {Object} [to={}] The Object to copy into
	 * @return {Object} Result of the copying
	 */
	Utils.prototype.shallow_copy = function(from, to) {
		from = from || {};
		to = to || {};

		for (var k in from) {
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
	 * @param {Object} o Object to destroy properties from
	 */
	Utils.prototype.destroyObject = function(o) {
		for (var propName in o) {
			if (o.hasOwnProperty(propName)) {
				delete o[propName];
			}
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>iterateObject</strong></p>
	 *
	 * Iterates through the properties of an object, executing a callback for each of them
	 *
	 * @param {Object} o Object to iterate
	 * @param {Function} c Callback to execute on each property of the provided object
	 */
	Utils.prototype.iterateObject = function(o, c) {
		for (var propName in o) {
			if (o.hasOwnProperty(propName)) {
				if (o[propName]) {
					c(o, propName);
				}
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
	 * @param {Array} a Array to destroy
	 * @param {Boolean} [resetLength=false] Whether to set the lenght of the array to 0
	 */
	Utils.prototype.destroyArray = function(a, resetLength) {
		for (var i = 0; i < a.length; i++) {
			a[i] = null;
		}

		if (resetLength) {
			a.length = 0;
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>iterateArray</strong></p>
	 *
	 * Iterate through the elements of an array, executing a callback for each of them
	 *
	 * @param {Array} a Array to iterate
	 * @param {Function} c Callback to execute on each element of the provided array
	 */
	Utils.prototype.iterateArray = function(a, c) {
		for (var i = 0; i < a.length; i++) {
			if (a[i]) {
				c(a, a[i], i);
			}
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>cache</strong></p>
	 *
	 * Get a function that will cache the first computed value
	 *
	 * @param {Function} func Function to cache
	 * @param {Oject|null} scope Scope to bind to
	 * @param {Object|null} args Arguments the cached function will receive
	 * @return {Function} Function that returns the first computed value. When called, this function may recieve a Boolean argument to force a refresh, by default it is false.
	 */
	Utils.prototype.cache = function(func, scope, args) {
		var r;

		var execute = function() {
			if (this.isArray(args)) {
				r = func.apply(scope || this, args);
			} else {
				r = func.call(scope || this, args);
			}
		}.bind(this);

		return function(refresh) {
			if (!r) {
				execute();
			}

			if (refresh) {
				execute();
			}

			return r;
		}
	}
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>defineGetter</strong></p>
	 *
	 * Define a getter using the native Object.defineProperty method
	 *
	 * @param {Object} object Object in which to create the getter
	 * @param {String} name Name of the getter
	 * @param {Function} func Function the getter should execute
	 */
	Utils.prototype.defineGetter = function(object, name, func) {
		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: true,
			get: func
		});
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>defineSetter</strong></p>
	 *
	 * Define a setter using the native Object.defineProperty method
	 *
	 * @param {Object} object Object in which to create the setter
	 * @param {String} name Name of the setter
	 * @param {Function} func Function the setter should execute
	 */
	Utils.prototype.defineSetter = function(object, name, func) {
		Object.defineProperty(object, name, {
			configurable: true,
			enumerable: true,
			set: func
		});
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>isFunction</strong></p>
	 *
	 * Determine if the specified object is a function
	 *
	 * @param {Object} o Object to test
	 *
	 * @return {Boolean}
	 */
	Utils.prototype.isFunction = function(o) {
		if (o) {
			return Object.prototype.toString.call(o) == '[object Function]';
		}

		return false;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>isObject</strong></p>
	 *
	 * Determine if the specified object is an object
	 *
	 * @param {Object} o Object to test
	 *
	 * @return {Boolean}
	 */
	Utils.prototype.isObject = function(o) {
		if (o) {
			return Object.prototype.toString.call(o) == '[object Object]';
		}

		return false;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>isArray</strong></p>
	 *
	 * Determine if the specified object is an array
	 *
	 * @param {Object} o Object to test
	 *
	 * @return {Boolean}
	 */
	Utils.prototype.isArray = function(o) {
		if (o) {
			return Object.prototype.toString.call(o) == '[object Array]';
		}

		return false;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>isString</strong></p>
	 *
	 * Determine if the specified object is a string
	 *
	 * @param {Object} o Object to test
	 *
	 * @return {Boolean}
	 */
	Utils.prototype.isString = function(o) {
		if (o) {
			return Object.prototype.toString.call(o) == '[object String]';
		}

		return false;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>isNumber</strong></p>
	 *
	 * Determine if the specified object is a number
	 *
	 * @param {Object} o Object to test
	 *
	 * @return {Boolean}
	 */
	Utils.prototype.isNumber = function(o) {
		return !isNaN(parseFloat(o)) && isFinite(o);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>isBoolean</strong></p>
	 *
	 * Determine if the specified object is a boolean value
	 *
	 * @param {Object} o Object to test
	 *
	 * @return {Boolean}
	 */
	Utils.prototype.isBoolean = function(o) {
		if (o === true) return true;
		if (o === false) return true;

		return false;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>wrapInRange</strong></p>
	 *
	 * Make a number 'wrap' in the given range
	 *
	 * @param {Number} x The value to wrap
	 * @param {Number} min Minimum value of the range
	 * @param {Number} max Maximum value of the range
	 *
	 * @return {Number}
	 */
	Utils.prototype.wrapInRange = function(x, min, max) {
		return x < min ? max - (min - x) : x > max ? min + (x - max) : x;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>generateUUID</strong></p>
	 *
	 * Generate a sufficiently random string
	 *
	 * @return {String}
	 */
	Utils.prototype.generateUUID = function() {
		var d = new Date()
			.getTime();

		var uuid = 'xxxyxxxxxxxxyxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random() * 16) % 16 | 0;
			d = Math.floor(d / 16);
			return (c == 'x' ? r : (r & 0x3 | 0x8))
				.toString(16);
		});

		return uuid;
	};
	/**
	 * --------------------------------
	 */

	// These functions are helpers to get various types of random values.
	// They all use Math.random under the hood.
	Utils.prototype.rand_f = function(min, max) {
		return Math.random() * (max - min) + min;
	};
	Utils.prototype.rand_i = function(min, max) {
		return Math.floor(Math.random() * (max - min + 1)) + min;
	};
	Utils.prototype.rand_pair = function(value1, value2) {
		return Math.random() >= 0.5 ? value1 : value2;
	};
	Utils.prototype.rand_b = function() {
		return Math.random() >= 0.5
	};
	Utils.prototype.rand_color = function() {
		return '#' + Math.floor(Math.random() * 16777215)
			.toString(16);
	};

	return new Utils();
});
