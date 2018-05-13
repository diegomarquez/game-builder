/**
 * # groups.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [delegate](@@delegate@@)
 *
 * Depends of:
 * [root](@@root@@)
 * [group](@@group@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module defines an object to contain and work with [group](@@group@@) objects.
 *
 * It also acts as a wrapper for interacting with [root](@@root@@).
 *
 * This object extends [delegate](@@delegate@@) so it provides a few events to hook into:
 *
 * ### **ADD**
 * When a [group](@@group@@) is added
 *
 * Registered callbacks get the [group](@@group@@) as argument
 * ``` javascript
 * gb.groups.on(gb.groups.ADD, function(group) {});
 * ```
 *
 * </br>
 *
 * ### **REMOVE**
 * When a [group](@@group@@) is removed
 *
 * Registered callbacks get the [group](@@group@@) as argument
 * ``` javascript
 * gb.groups.on(gb.groups.REMOVE, function(group) {});
 * ```
 *
 * </br>
 *
 * ### **CHANGE**
 * When [group](@@group@@) changes position
 *
 * Registered callbacks get the [group](@@group@@) as argument
 * ``` javascript
 * gb.groups.on(gb.groups.CHANGE, function(group) {});
 * ```
 *
 * </br>
 *
 * ### **REMOVE_ALL**
 * When all the [groups](@@group@@) are removed
 *
 * ``` javascript
 * gb.groups.on(gb.groups.REMOVE_ALL, function() {});
 * ```
 *
 * <strong>Note: The snippets use the reference to <a href=@@groups@@>groups</a>
 * found in the <a href=@@gb@@>gb</a> module.
 * The way you get a hold to a reference to <a href=@@groups@@>groups</a>
 * may vary.</strong>
 */

/**
 * Group management
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate", "root", "group", "error-printer"], function(Delegate, Root, Group, ErrorPrinter) {

	var GroupContainer = Delegate.extend({
		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 *
		 * Constructor
		 */
		init: function() {
			this._super();

			this.groups = {};
			this.groupsArray = [];
		},

		/**
		 * <p style='color:#AD071D'><strong>add</strong></p>
		 *
		 * Adds a new group. The group is managed in this object, but
		 * it also is added to [root](@@root@@), which is what will make it update.
		 *
		 * On that subject, it is important to note that if you re-arrange the elements
		 * of the array that the group is added to, nothing will happen to the order of
		 * updating or rendering, as that is controlled by the [root](@@root@@), which has
		 * a list of childs of it's own.
		 *
		 * @param {String} name Id of the group, used later to refer to the group.
		 *
		 * @return {Object} The [group](@@group@@) that was just created
		 */
		addGroup: function(name) {
			var group = new Group(name);

			Root.addChild(group)
				.start();
			this.groups[name] = group;
			this.groupsArray.push(group);

			this.execute(this.ADD, group);

			return group;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>remove</strong></p>
		 *
		 * Removes a group from the array in this object, and also from the [root](@@root@@).
		 * Prior to removing the group it also clears it from any [game-objects](@@game-object@@)
		 *
		 * A removed group can not be used again, if you wish to just remove all [game-objects](@@game-object@@)
		 * from a group you might want to use the **clear** method.
		 *
		 * @param {String} name Id of the group to remove
		 */
		removeGroup: function(name) {
			var group = this.groups[name];

			this.execute(this.REMOVE, group);

			group.clear();

			Root.removeChild(this.groups[name]);

			this.groupsArray.splice(this.groupsArray.indexOf(group), 1);
			delete this.groups[name];
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeAll</strong></p>
		 *
		 * Removes all [groups](@@group@@) from the array in this object, and also from the [root](@@root@@).
		 */
		removeAll: function() {
			for (var k in this.groups) {
				this.removeGroup(k);
			}

			this.execute(this.REMOVE_ALL);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>clear</strong></p>
		 *
		 * Clears a group from all [game-objects](@@game-object@@)
		 *
		 * A cleared group can still be used to add more things to it.
		 */
		clear: function(name) {
			this.groups[name].clear();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>get</strong></p>
		 *
		 * Get a reference to a group
		 *
		 * @param {String} name Id of the group to get a reference to.
		 *
		 * @throws {Error} If the provided name does not match any [group](@@group@@)
		 *
		 * @return {Group} The specified [group](@@group@@).
		 */
		get: function(name) {
			if (!this.groups[name]) {
				ErrorPrinter.printError('Groups', 'group with id:' + name + ' does not exist.')
			}

			return this.groups[name];
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>exists</strong></p>
		 *
		 * Tell whether a [group](@@group@@) exists or not
		 *
		 * @param {String} name Id of the group to check existance of.
		 */
		exists: function(name) {
			return this.groups[name] ? true : false;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>change</strong></p>
		 *
		 * Change the position of the specified [group](@@group@@)
		 *
		 * @param {String} name Id of the [group](@@group@@) to arrange.
		 */
		change: function(name, index) {
			var group = this.groups[name];
			var groupIndex = this.groupsArray.indexOf(group);

			this.groupsArray.splice(groupIndex, 1);
			this.groupsArray.splice(index, 0, group);

			this.execute(this.CHANGE, group);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>stop</strong></p>
		 *
		 * Stops updating and rendering everythin in the requested [group](@@group@@).
		 * For practical purposes this method pauses and makes invisible all the contents
		 * of a group.
		 *
		 * @param {String} name Id of the group in which to stop all activity
		 * @param {Boolean} [skipEvents=false] Whether to skip the **HIDE** and **STOP** events of the corresponding [group](@@group@@)
		 */
		stop: function(name, skipEvents) {
			this.stop_update(name, skipEvents);
			this.stop_draw(name, skipEvents);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>resume</strong></p>
		 *
		 * Resumes all activity in the specified [group](@@group@@).
		 *
		 * @param {String} name Id of the [group](@@group@@) to resume activity in
		 * @param {Boolean} [skipEvents=false] Whether to skip the **SHOW** and **RUN** events of the corresponding [group](@@group@@)
		 */
		resume: function(name, skipEvents) {
			this.resume_update(name, skipEvents);
			this.resume_draw(name, skipEvents);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>stop_draw</strong></p>
		 *
		 * Stops rendering of the specified [group](@@group@@). Effectively making everything in it invisible.
		 *
		 * @param {String} name Id of the [group](@@group@@) that should stop rendering
		 * @param {Boolean} [skipEvents=false] Whether to skip the **HIDE** event of the corresponding [group](@@group@@)
		 */
		stop_draw: function(name, skipEvents) {
			this.groups[name].hide(skipEvents);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>resume_draw</strong></p>
		 *
		 * Resumes rendering of the specified [group](@@group@@).
		 *
		 * @param {String} name Id of the [group](@@group@@) that should resume rendering
		 * @param {Boolean} [skipEvents=false] Whether to skip the **SHOW** event of the corresponding [group](@@group@@)
		 */
		resume_draw: function(name, skipEvents) {
			this.groups[name].show(skipEvents);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>stop_update</strong></p>
		 *
		 * Stops updating of the specified [group](@@group@@). Effectively pausing everything in it.
		 *
		 * @param {String} name Id of the [group](@@group@@) that should stop updating
		 * @param {Boolean} [skipEvents=false] Whether to skip the **STOP** event of the corresponding [group](@@group@@)
		 */
		stop_update: function(name, skipEvents) {
			this.groups[name].stop(skipEvents);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>resume_update</strong></p>
		 *
		 * Resumes updating of the specified [group](@@group@@).
		 *
		 * @param {String} name Id of the [group](@@group@@) that should resume updating
		 * @param {Boolean} [skipEvents=false] Whether to skip the **RUN** event of the corresponding [group](@@group@@)
		 */
		resume_update: function(name, skipEvents) {
			this.groups[name].run(skipEvents);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>allGroupNames</strong></p>
		 *
		 * Get an array with all the group names
		 *
		 * @return {Array} All the group names
		 */
		allGroupNames: function() {
			var r = [];

			for (var i = 0; i < this.groupsArray.length; i++) {
				var group = this.groupsArray[i];

				for (var k in this.groups) {
					if (this.groups[k] === group) {
						r.push(k);
					}
				}
			}

			return r;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>all</strong></p>
		 *
		 * Performs a given action on all the groups. The two arguments
		 * are concatenated to form the name of one of the methods described
		 * earlier to control groups. ej.:
		 *
		 * * ``` javascript
		 * groups.all('stop', 'update');
		 * ```
		 *
		 * Would stop the updating of all the groups.
		 *
		 * @param {String} action This can be either 'resume' or 'stop'
		 * @param {String} method This can be either 'draw' or update.
		 * @param {Function} which Groups passing this test will get the action and method applied to them
		 * @param {Boolean} [skipEvents=false] Whether to skip the events of the corresponding [groups](@@group@@)
		 */
		all: function(action, method, which, skipEvents) {
			if (method) action = action + '_' + method;

			for (var k in this.groups) {
				if (!which) {
					this[action](k, skipEvents);
				} else {
					if (which(this.groups[k])) {
						this[action](k, skipEvents);
					}
				}
			}
		},
		/**
		 * --------------------------------
		 */
	});

	Object.defineProperty(GroupContainer.prototype, "ADD", {
		get: function() {
			return 'add';
		}
	});
	Object.defineProperty(GroupContainer.prototype, "REMOVE", {
		get: function() {
			return 'remove';
		}
	});
	Object.defineProperty(GroupContainer.prototype, "CHANGE", {
		get: function() {
			return 'change';
		}
	});
	Object.defineProperty(GroupContainer.prototype, "REMOVE_ALL", {
		get: function() {
			return 'removeAll';
		}
	});

	return new GroupContainer();
});
