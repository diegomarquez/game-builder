/**
 * # delegate.js
 * ### By [Diego Enrique Marquez](http://treintipollo.com/)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [class](@@class@@)
 *
 * Depends of:
 * [util](@@util@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module defines a container of callbacks. Add the callbacks and later execute all the registered functions under
 * a given id.
 *
 * The basic workflow is the following:
 *
 * Add functions using <strong>on</strong>, always providing an id and a scope for each function.
 * At some point in the future call the method <strong>execute</strong>, passing an id.
 * All the functions registered under the id provided will be executed in the order they were added.
 */

/**
 * Totally usefull
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["class", "util"], function(Class, Util) {
	var Delegate = Class.extend({
		init: function() {
			this.callbackList = {};
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>on</strong></p>
		 *
		 * Use to register functions under the given id.
		 *
		 * @param {String} name Id that the function will be associated with
		 * @param {Object} scope Scope of the function, most of the time you will be passing 'this'
		 * @param {Function} callback Function you want to execute
		 * @param {Boolean} [removeOnExecute = false] The function will be removed from the corresponding list, after executing it once
		 * @param {Boolean} [keepOnCleanUp = false] Save the function when executing the **softCleanUp**
		 * @param {Boolean} [single = false] Do not add function if there is already one with the same id
		 * @param {String} [level = ''] Give the delegate a 'level'. Later all the delegates with the same level can be removed without keeping track of the delegate details.
		 */
		on: function(name, scope, callback, removeOnExecute, keepOnCleanUp, single, level) {
			if (!this.callbackList[name]) {
				this.callbackList[name] = [];
			}

			if (single) {
				if (this.callbackList[name].length == 1) {
					return;
				}
			}

			var callbackObject = {
				scope: scope,
				callback: callback,
				removeOnExecute: removeOnExecute,
				keep: keepOnCleanUp,
				level: level
			}

			this.callbackList[name].push(callbackObject);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>on</strong></p>
		 *
		 * Use to register functions under the given id. This method is a shorthand for
		 *
		 * ``` javascript
		 * delegate.on(name, scope, callback, true, false, false, level);
		 * ```
		 *
		 * The function will be removed from the corresponding list upon execution.
		 *
		 * @param {String} name Id that the function will be associated with
		 * @param {Object} scope Scope of the function, most of the time you will be passing 'this'
		 * @param {Function} callback Function you want to execute
		 * @param {String} [level = ''] Give the delegate a 'level'. Later all the delegates with the same level can be removed without keeping track of the delegate details.
		 */
		once: function(name, scope, callback, level) {
			this.on(name, scope, callback, true, false, false, level);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>on</strong></p>
		 *
		 * Use to register functions under the given id. This method is a shorthand for
		 *
		 * ``` javascript
		 * delegate.on(name, scope, callback, false, true, false, level);
		 * ```
		 *
		 * The function will not be removed from the corresponding list, if the **softCleanUp** method is called.
		 *
		 * @param {String} name Id that the function will be associated with
		 * @param {Object} scope Scope of the function, most of the time you will be passing 'this'
		 * @param {Function} callback Function you want to execute
		 * @param {String} [level = ''] Give the delegate a 'level'. Later all the delegates with the same level can be removed without keeping track of the delegate details.
		 */
		persist: function(name, scope, callback, level) {
			this.on(name, scope, callback, false, true, false, level);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>on</strong></p>
		 *
		 * Use to register functions under the given id. This method is a shorthand for
		 *
		 * ``` javascript
		 * delegate.on(name, scope, callback, false, false, true);
		 * ```
		 *
		 * Only a single function is added to the corresponding list, even if the method is called many times.
		 *
		 * @param {String} name Id that the function will be associated with
		 * @param {Object} scope Scope of the function, most of the time you will be passing 'this'
		 * @param {Function} callback Function you want to execute
		 * @param {String} [level = ''] Give the delegate a 'level'. Later all the delegates with the same level can be removed without keeping track of the delegate details.
		 */
		single: function(name, scope, callback, level) {
			this.on(name, scope, callback, false, false, true, level);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>remove</strong></p>
		 *
		 * Removes the specified function from the array it is in.
		 *
		 * @param {String} name Id the funtion you want to remove is associated with
		 * @param {Object} scope Scope used when adding the function
		 * @param {Function} callback Function you want to remove
		 */
		remove: function(name, scope, callback) {
			var list = this.callbackList[name];

			if (!list) return;

			for (var i = list.length - 1; i >= 0; i--) {
				var callbackObject = list[i];

				if (scope === callbackObject.scope && callback === callbackObject.callback) {
					list.splice(i, 1);
				}
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeAll</strong></p>
		 *
		 * Removes all the functions associated with an id.
		 *
		 * @param {String} name All functions matching this Id will be removed
		 */
		removeAll: function(name) {
			if (this.callbackList[name]) {
				this.callbackList[name].splice(0, this.callbackList[name].lenght);
				this.callbackList[name].lenght = 0;
				this.callbackList[name] = null;

				delete this.callbackList[name];
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>softCleanUp</strong></p>
		 *
		 * Removes every function,
		 * except for the ones that were configured to be kept in **on**.
		 */
		softCleanUp: function() {
			filterCallbacks.call(this, function(callbackObject) {
				return !callbackObject.keep;
			});
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>softCleanUp</strong></p>
		 *
		 * Removes every function for the specified level.
		 *
		 * @param {String} [level] All delegates with this 'level' will be removed
		 */
		levelCleanUp: function(level) {
			filterCallbacks.call(this, function(callbackObject) {
				return callbackObject.level === level;
			});
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>hardCleanUp</strong></p>
		 *
		 * Removes every registered function.
		 */
		hardCleanUp: function() {
			for (var k in this.callbackList) {
				this.removeAll(k);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>isRegistered</strong></p>
		 *
		 * @param {String} name Id of the group of functions
		 *
		 * @return {Boolean} Returns true if the given id has any callbacks registered
		 */
		isRegistered: function(name) {
			var list = this.callbackList[name];

			if (!list) return false;

			for (var i = 0; i < list.length; i++) {
				if (list[i]) {
					return true;
				}
			}

			return false;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>destroy</strong></p>
		 *
		 * Gets ready for garbage collection.
		 */
		destroy: function() {
			Util.destroyObject(this);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>execute</strong></p>
		 *
		 * Use this to call all the methods registered using **on**.
		 *
		 * @param {String} name All the functions registered with the id provided will be executed
		 * @param {Object} args This Object will be passed as argument to all the functions executed
		 * @param {String} [method = 'call'] Whether to use **call** or **apply** to execute the callbacks. This affects how the arguments are interpreted.
		 */
		execute: function(name, args, method) {

			if (!this.callbackList)
				throw new Error('No callback list found, did you forget to call init._super() ?');

			var list = this.callbackList[name];

			if (!list) return;

			method = method || 'call';

			var callbackCount = list.length;

			for (var i = 0; i < callbackCount; i++) {
				var callbackObject = list[i];

				if (!callbackObject) continue;

				callbackObject.callback[method](callbackObject.scope, args);

				if (callbackObject.removeOnExecute) {
					list[i] = null;
				}
			}

			this.removeAllNulls(list);
		},
		/**
		 * --------------------------------
		 */

		removeAllNulls: function(list) {
			if (!list) return;

			for (var i = list.length - 1; i >= 0; i--) {
				var callbackObject = list[i];

				if (!callbackObject) {
					list.splice(i, 1);
				}
			}
		}
	});

	var filterCallbacks = function(test) {
		for (var k in this.callbackList) {
			var list = this.callbackList[k];

			if (!list) continue;

			for (var i = list.length - 1; i >= 0; i--) {
				var callbackObject = list[i];

				if (test(callbackObject)) {
					list.splice(i, 1);
				}
			}
		}
	}

	return Delegate;
});
