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
 * This modules defines a container for [game-objects](@@game-object@@), which in turn
 * is a [game-object](@@game-object@@) itself. Being a parent means that all of it's child
 * [game-objects](@@game-object@@) will follow it according to it's transformation matrix.
 *
 * It's a pretty usefull behaviour to form more complex displays out of smaller, more manageable 
 * pieces. 
 *
 * A note on drawing: A container will execute it's renderer code, and then the rendering code
 * of it's children. This means that the parent drawing will show up, below it's children's.
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
		 * Adds the specified child [game-object](@@game-object@@) to this container.
		 * If the child already is part of another parent, it is removed from it
		 * and added to this one.
		 * 
		 * @param {Object} The child [game-object](@@game-object@@) to add
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
		 * Removes the specified child [game-object](@@game-object@@) from this container.
		 * 
		 * @param {Object} The child [game-object](@@game-object@@) to remove
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
		 * @param  {Number} delta Time ellapsed since the last update
		 */
		update: function(delta) {
			this.transform();

			if(!this.childs) return;

			var child = null

			for(var i=0; i<this.childs.length; i++){
				child = this.childs[i];

				if(!child.canUpdate) continue;

				child.update(delta);
				
				if(!child.components) {
					if (!child.isContainer()) {
						child.transform();	
					}
				} else {
					for(var k=0; k<child.components.length; k++) {
						if(child.components[k].update) {
							child.components[k].update(delta);
						}
					}	
					
					if (!child.isContainer()) {
						child.transform();	
					}
				}
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>draw</strong></p>
		 *
		 * Draws the game-object into the specified Context 2D, using it's [matrix-3x3](@@matrix-3x3@@)
		 *
		 * Then it draws all of it's children
		 * 
		 * @param  {Context 2D} context [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
		 * @param  {Object} viewport The [viewport](@@viewport@@) this objects is being drawn too
		 */
		draw: function(context, viewport) {			
			this._super(context, viewport);

			if(!this.childs) return;
						
			var child = null;

			for(var i=0; i<this.childs.length; i++){
				child = this.childs[i];

				if(!child.canDraw) continue;

				child.draw(context, viewport);	
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>hide</strong></p>
		 *
		 * Prevents rendering of itself and all of it's children
		 */
		hide: function() {
			this._super();

			if(!this.childs) return;
		
			for(var i=0; i<this.childs.length; i++){
				this.childs[i].hide();
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>show</strong></p>
		 *
		 * Enables rendering of itself and all of it's children
		 */
		show: function() {
			this._super();

			if(!this.childs) return;

			for(var i=0; i<this.childs.length; i++){
				this.childs[i].show();
			}
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
		 * Calls the clear method on each child, and then on it self.
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
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>isContainer</strong></p>
		 *
		 * @return {Boolean} Wheter it is a container object or not
		 */
		isContainer: function() {
			return true;
		}
	});

	return GameObjectContainer;
});