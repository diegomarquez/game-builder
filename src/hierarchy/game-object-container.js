/**
 * # game-object-container.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [game-object](@@game-object@@)
 *
 * Depends of:
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This modules defines a container for [game-object](@@game-object@@) objects, which in turn
 * is a [game-object](@@game-object@@) itself. Being a parent means that all of it's child
 * [game-objects](@@game-object@@) will follow it according to it's transformation matrix.
 *
 * It's a pretty usefull behaviour to form more complex displays out of smaller, more manageable 
 * pieces. 
 *
 * A note on drawing, a container will execute it's renderer code, and then the rendering code
 * of it's children. Than means that the parent drawing will show up, below it's children's.
 *
 * Asides from that, a container is no different to a regular [game-object](@@game-object@@),
 * so go look at that part of the documentation for more details on every method here.
 */

/**
 * Nesting FTW!
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["game-object"], function(GameObject){

	var GameObjectContainer = GameObject.extend({
		init: function() {
			this._super();
		},

		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * Starts itself and all of it's children.
		 */
		start: function() {
			this._super();

			if(!this.childs) return;

			for(var i=0; i<this.childs.length; i++){
				this.childs[i].start();
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>add</strong></p>
		 *
		 * Adds a child [game-object](@@game-object@@) to this container.
		 * If the child already is part of another parent, it is removed from it
		 * and added to this one.
		 * 
		 * @param {[game-object](@@game-object@@)} The child to add
		 */
		add: function(child) {
			if(!child) return;

			if(!this.childs) this.childs = [];

			if(child.parent) {
				child.parent.remove(child);
			}

			child.parent = this;

			this.childs.push(child);

			return child;	
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>remove</strong></p>
		 *
		 * Removed a child from this container.
		 * 
		 * @param {[game-object](@@game-object@@)} The child to remove
		 */
		remove: function(child) {
			if(!child) return;

			child.parent = null;

			if(!this.childs) return;

			this.childs.splice(this.childs.indexOf(child), 1); 
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>update</strong></p>
		 *
		 * Updates all of it's children.
		 * 
		 * @param  {[type]} delta Time ellapsed since the last update
		 */
		update: function(delta) {
			if(!this.childs) return;

			var child = null

			for(var i=0; i<this.childs.length; i++){
				child = this.childs[i];

				if(!child.canUpdate) continue;

				child.update(delta);

				if(!child.components)  continue;

				for(var k=0; k<child.components.length; k++) {
					if(child.components[k].update) {
						child.components[k].update(delta);
					}
				}	
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>transformAndDraw</strong></p>
		 *
		 * Same as the **transformAndDraw** in [game-object](@@game-object@@)
		 * but it also calls the method for all of it's children.
		 *
		 * It does so after drawing itself.
		 * 
		 * @param  {Context 2D} context Context 2D property of the canvas
		 */
		transformAndDraw: function(context) {
			context.save();
			
			this._super(context);

			if(!this.childs) {
				context.restore();
				return;
			} 
				
			var child = null;

			for(var i=0; i<this.childs.length; i++){
				child = this.childs[i];

				if(!child.canDraw) continue;

				context.save();
				child.transformAndDraw(context);
				context.restore();
			}

			context.restore();
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>recycle</strong></p>
		 *
		 * Calls the recycle method on every child, and then on itself,
		 * nulling every reference on it's way.
		 */
		recycle: function() {
			if(!this.childs) return;

			for(var i=0; i<this.childs.length; i++){
				this.childs[i].recycle();
			}

			this.childs.length = 0;
			this.childs = null;

			this._super();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>clear</strong></p>
		 *
		 * Calls the clear method on on each child, and then on it self.
		 * It also removes all the childs.
		 */
		clear: function() {
			if(this.childs) {				
				while(this.childs.length) {
					this.childs.pop().clear();
				}

				this.childs.length = 0;
				this.childs = null;
			}

			this._super();
		}
		/**
		 * --------------------------------
		 */
	});

	return GameObjectContainer;
});