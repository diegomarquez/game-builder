/**
 * # groups.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
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
 * Not much else needs to be said about this module, it's not very complex.
 */

/**
 * Group management
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["root", "group", "error-printer"], function(Root, Group, ErrorPrinter) {

	var GroupContainer = function() {
		this.groups = {};
	};

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
	 */
	GroupContainer.prototype.add = function(name) {
		var group = new Group();

		Root.add(group).start();
		this.groups[name] = group;

		return group;
	};
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
	 * @param  {String} name Id of the group to remove
	 */
	GroupContainer.prototype.remove = function(name) {
		this.groups[name].clear();
		delete this.groups[name];
		Root.remove(this.groups[name]);
	};
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
	GroupContainer.prototype.clear = function(name) { 
		this.groups[name].clear(); 
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>get</strong></p>
	 *
	 * Get a reference to a group
	 * 
	 * @param  {String} name Id of the group to get a reference to.
	 *
	 * @throws {Error} If the provided name does not match any [group](@@group@@)
	 * 
	 * @return {Group} The specified [group](@@group@@).    
	 */
	GroupContainer.prototype.get = function(name) { 
		if (!this.groups[name]) {
			ErrorPrinter.printError('Groups', 'group with id:' + name + ' does not exist.')
		}

		return this.groups[name]; 
	};
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
	 * @param  {String} name Id of the group in which to stop all activity
	 */
	GroupContainer.prototype.stop = function(name) { 
		this.stop_update(name);
		this.stop_draw(name);		
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>resume</strong></p>
	 *
	 * Resumes all activity in the specified [group](@@group@@).
	 * 
	 * @param  {String} name Id of the [group](@@group@@) to resume activity in 
	 */
	GroupContainer.prototype.resume = function(name) { 
		this.resume_update(name);
		this.resume_draw(name);		
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>stop_draw</strong></p>
	 *
	 * Stops rendering of the specified [group](@@group@@). Effectively making everything in it invisible.
	 * 
	 * @param  {String} name Id of the [group](@@group@@) that should stop rendering
	 */
	GroupContainer.prototype.stop_draw = function(name) { this.groups[name].hide(); };
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>resume_draw</strong></p>
	 *
	 * Resumes rendering of the specified [group](@@group@@). 
	 *
	 * @param  {String} name Id of the [group](@@group@@) that should resume rendering
	 */
	GroupContainer.prototype.resume_draw = function(name) { this.groups[name].show(); };
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>stop_update</strong></p>
	 *
	 * Stops updating of the specified [group](@@group@@). Effectively pausing everything in it.
	 * 
	 * @param  {String} name Id of the [group](@@group@@) that should stop updating
	 */
	GroupContainer.prototype.stop_update = function(name) { this.groups[name].canUpdate = false; };
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>resume_update</strong></p>
	 *
	 * Resumes updating of the specified [group](@@group@@). 
	 *
	 * @param  {String} name Id of the [group](@@group@@) that should resume updating
	 */
	GroupContainer.prototype.resume_update = function(name) { this.groups[name].canUpdate = true; };
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
	 * @param  {String} action This can be either 'resume' or 'stop'
	 * @param  {String} method This can be either 'draw' or update.
	 */
	GroupContainer.prototype.all = function(action, method) { 
		if (method) action = action + '_' + method;

		for (var k in this.groups) { 
			this[action](k); 
		} 
	};
	/**
	 * --------------------------------
	 */

	return new GroupContainer();
});