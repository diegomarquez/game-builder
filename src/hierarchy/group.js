/**
 * # group.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [game-object-container](@@game-object-container@@)
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module defines a special kind of [game-object-container](@@game-object-container@@).
 *
 * It's only purpose it be used by [groups](@@groups@@) as a way to organize the updating loop
 *
 * It behaives exactly like a [game-object-container](@@game-object-container@@) except
 * for the fact it redefines the **clear** method so that it only removes all children.
 */

/**
 * Visual organization
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["game-object-container", "util"], function(Container, Util) {
	var Group = Container.extend({
		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 *
		 * Constructor
		 *
		 * @param {String} name The name of the group
		 */
		init: function(name) {
			this._super();

			this.groupName = name;
			this.drawAlreadyStopped = false;
			this.updateAlreadyStopped = false;
		},
		/**
		 * --------------------------------
		 */

		start: function() {
			this._super();

			this.on(this.HIDE, this, function() {
				this.drawAlreadyStopped = true;
			});

			this.on(this.SHOW, this, function() {
				this.drawAlreadyStopped = false;
			});

			this.on(this.STOP, this, function() {
				this.updateAlreadyStopped = true;
			});

			this.on(this.RUN, this, function() {
				this.updateAlreadyStopped = false;
			});
		},

		/**
		 * <p style='color:#AD071D'><strong>addChild</strong></p>
		 *
		 * Adds the specified child [game-object](@@game-object@@) to this container.
		 * If the child already is part of another parent, it is removed from it
		 * and added to this one.
		 *
		 * @param {Object} child The child [game-object](@@game-object@@) to add
		 */
		addChild: function(child) {
			this._super(child);

			child.updateGroup = this.groupName;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>clear</strong></p>
		 *
		 * This is normally called through [groups](@@groups@@) to empty a
		 * group, but it could be called manually, assuming you can get a hold
		 * of a reference.
		 */
		clear: function() {
			if (this.childs) {
				while (this.childs.length) {
					this.childs.pop()
						.clear();
				}

				this.childs.length = 0;
				this.childs = null;
			}

			this.execute('clear', this);
		},

		/**
		 * <p style='color:#AD071D'><strong>typeName</strong></p>
		 *
		 * @return {String} Returns the type name of this object
		 */
		typeName: function() {
			return 'Group';
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>isChild</strong></p>
		 *
		 *
		 * @return {Boolean}
		 */
		isChild: function() {
			return false;
		},
		/**
		 * --------------------------------
		 */
	});

	return Group;
});
