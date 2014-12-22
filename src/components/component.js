/**
 * # component.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: [delegate](@@delegate@@)
 *
 * Depends of:
 * [util](@@util@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * Every components extends from the object defined in this module. If you add this
 * to a [game-object](@@game-object@@) it will do nothing, so it needs to be extended.
 *
 * The idea behind components is being able to add logic to a [game-object](@@game-object@@)
 * with out hardcoding it in the [game-object](@@game-object@@) itself.
 *
 * If you are crafty enough when writting components you may even be able to share their
 * functionality between completely different [game-objects](@@game-object@@)
 *
 * ### The Component object extends [delegate](@@delegate@@) so it provides a few events to hook into:
 *
 * ### **added** 
 * When it is added to a [game-object](@@game-object@@) 
 * 
 * Registered callbacks get the component as argument. 
 * ``` javascript  
 * component.on(component.ADD, function(component) {});
 * ``` 
 *
 * ### **removed**
 * When it is removed from a [game-object](@@game-object@@). 
 *
 * Registered callbacks get the component as argument.
 * ``` javascript  
 * component.on(component.REMOVE, function(component) {});
 * ```
 *
 * ### **recycle**
 * When the parent [game-object](@@game-object@@) is sent
 * back to the [game-object-pool](@@game-object-pool@@) it triggers
 * this event which sends the component back to the [component-pool](@@component-pool@@)
 *
 * Registered callbacks get the component as argument.
 * ``` javascript  
 * component.on(component.RECYCLE, function(component) {});
 * ```
 * 
 */

/**
 * Extend logic
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate", "util"], function(Delegate, Util) {

	var Component = Delegate.extend({
		init: function() {
			this._super();

			this.uid 		= null;
			this.poolId = null;
			this.typeId = null;
			this.parent = null;
		},

		/**
		 * <p style='color:#AD071D'><strong>configure</strong></p>
		 *
		 * Configures properties
		 * set via the <a href=@@component-pool@@>component-pool</a>
		 * 
		 * This method is important as it applies all the configuration needed for 
		 * the component to work as expected.
		 * 
		 * @param  {Object} args An object with all the properties to write into the component
		 */
		configure: function(args) {
			if (!args) return;

			for (var ha in args) {
				if (Util.isObject(args[ha])) {
					var getter = args[ha]['_get'];
					var setter = args[ha]['_set'];

					if (getter || setter) {
						if (Util.isFunction(getter)) {
							Util.defineGetter(this, ha, getter);
						}
						
						if (Util.isFunction(setter)) {
							Util.defineSetter(this, ha, setter);
						}
					} else {
						this[ha] = args[ha];
					}
				} else {
					this[ha] = args[ha];
				}
			}

			this.args = args;
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>reset</strong></p>
		 *
		 * Not so interesting mehtod, it just resets some properties right
		 * before the [assembler](@@assembler@@) module starts putting together
		 * a component.
		 */
		reset: function() {
			this.uid = null;
			this.parent = null;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>onStarted</strong></p>
		 *
		 * This is called once when the parent [game-object](@@game-object@@) is started or when the component is added
		 * dynamically to a [game-object](@@game-object@@)
		 */
		onStarted: function() {
			this.start();	
			this.execute(this.START, this);
		},

		/**
		 * <p style='color:#AD071D'><strong>onAdded</strong></p>
		 *
		 * This is called by the parent [game-object](@@game-object@@) when it
		 * adds this component to it's list.
		 * 
		 * @param  {Object} parent [game-object](@@game-object@@) using this component
		 */
		onAdded: function(parent) {
			this.parent = parent;
			this.added(parent);
			this.execute(this.ADD, this);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>onRemoved</strong></p>
		 *
		 * This is called by the parent [game-object](@@game-object@@) when it
		 * removes this component to it's list.
		 */
		onRemoved: function() {
			this.removed(parent);
			this.execute(this.REMOVE, this);
			this.parent = null;
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>onRecycled</strong></p>
		 *
		 * This is called by the parent [game-object](@@game-object@@) when it
		 * is destroying itself.
		 */
		onRecycled: function() {			
			this.recycle();
			this.execute(this.RECYCLE, this);

			this.hardCleanUp();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>added</strong></p>
		 *
		 * Much like **onAdded**, but this method is only meant to be overriden
		 * with out having to remember calling **_super**
		 * 
		 * @param  {Object} parent [game-object](@@game-object@@) using this component
		 */
		added: function(parent) {},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removed</strong></p>
		 *
		 * Much like **onRemoved**, but this method is only meant to be overriden
		 * with out having to remember calling **_super**
		 * 
		 * @param  {Object} parent [game-object](@@game-object@@) using this component
		 */
		removed: function(parent) {},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>start</strong></p>
		 *
		 * Called by the parent [game-object](@@game-object@@) when
		 * it is started
		 *
		 * @param  {Object} parent [game-object](@@game-object@@) using this component 
		 */
		start: function(parent) {},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>update</strong></p>
		 *
		 * Called by the parent [game-object](@@game-object@@) 
		 * after updating itself.
		 * 
		 * @param  {Number} delta Time elapsed since last update cycle
		 */
		update: function(delta) {},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>recycle</strong></p>
		 *
		 * Called by the parent [game-object](@@game-object@@) 
		 * when it is sent back to it's pool for reuse.
		 * 
		 */
		recycle: function() {},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>debug_draw</strong></p>
		 *
		 * This method is only executed if the **debug** property of the parent [gb](@@gb@@)
		 * is set to true. It is better to leave the drawing to the [renderer](@@renderer@@) components.
		 * 
		 * @param  {Context 2D} context     [Canvas 2D context](http://www.w3.org/html/wg/drafts/2dcontext/html5_canvas/)
		 * @param  {Object} viewport A reference to the current [viewport](@@viewport@@)
		 * @param  {Object} draw     A reference to the [draw](@@draw@@) module
		 */
		debug_draw: function(context, viewport, draw) {}
		/**
		 * --------------------------------
		 */
	});

	// ### Getters for all the types of events a Component can hook into
	Object.defineProperty(Component.prototype, "START", { get: function() { return 'started'; } });
	Object.defineProperty(Component.prototype, "ADD", { get: function() { return 'added'; } });
	Object.defineProperty(Component.prototype, "REMOVE", { get: function() { return 'removed'; } });
	Object.defineProperty(Component.prototype, "RECYCLE", { get: function() { return 'recycled'; } });
	/**
	 * --------------------------------
	 */

	return Component;
});