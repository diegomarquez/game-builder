/**
 * # state.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 *
 * Depends of: 
 * [delegate](@@delegate@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module defines an object which can have functions attached to three different phases.
 * 
 * **Initialization**, **Completion** and **Update**.
 * The first two are functions executed when entering and exiting a state. **Update** must be called in a loop.
 * All phases are optional. Ofcourse, having a state with no phases is a bit on the dumb side.
 *
 * <p style='color:#AD071D'>Note: State machines may throw a custom error when trying to 
 * execute <strong>Initialization</strong> and <strong>Completion</strong> actions. 
 * This is because those methods are enclosed in a **'try catch'** block. 
 * This means if you see this illusive error, there is something wrong in the callbacks registered with the
 * state machine rather than the state machine itself.</p> 
 */

/**
 * Encapsulation is good
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate"], function(Delegate) {
	var State = Delegate.extend({
		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 *
		 * Constructor method
		 * 
		 * @param  {Object} scope Scope to be used by all the callbacks registered with this state
		 * @param  {String} name  Name to later be able to retrieve a reference to the state if needed
		 */
		init: function(scope, name) { 
			this._super(); 
			this.scope = scope;
			this.name = name;
		},

		// Use these methods to add callbacks to each of the three phases of a state.
		// These method are really just wrappers to the [delegate](@@delegate@@) this object is extending.
		// Just a way to type less stuff when adding callbacks.
		addStartAction: function(callback) { this.on('start', this.scope, callback); },
		addUpdateAction: function(callback) { this.on('update', this.scope, callback); },
		addCompleteAction: function(callback) { this.on('complete', this.scope, callback); },
		/**
		 * --------------------------------
		 */

		// Use these methods to remove callbacks from each of the three phases of a state.
		// These method are really just wrappers to the [delegate](@@delegate@@) this object is extending.
		// Just a way to type less stuff when adding callbacks.
		removeStartAction: function(callback) { this.remove('start', this.scope, callback); },
		removeUpdateAction: function(callback) { this.remove('update', this.scope, callback); },
		removeCompleteAction: function(callback) { this.remove('complete', this.scope, callback); },
		/**
		 * --------------------------------
		 */

		// You can use these methods to execute the actions associated with a state's phase,
		// usually you leave that to the state machine.
		// These method are really just wrappers to the [delegate](@@delegate@@) this object is extending.
		// Just a way to type less stuff when adding callbacks.
		start: function(args) { this.execute('start', args); },
		update: function(args) { this.execute('update', args); },
		complete: function(args) { this.execute('complete', args); }
		/**
		 * --------------------------------
		 */
	});
	/**
	 * --------------------------------
	 */
	
	// ### Getters for the types of events a state can fire to change control flow 
	// If a state fires an event that does not correspond to the type of state machine it is part off,
	// nothing will happen.
	
	// **next** must be used when a state is part of a **"fixed"** state machine 
	Object.defineProperty(State.prototype, "NEXT", { get: function() { return 'next'; } });
	// **previous** must be used when a state is part of a **"fixed"** state machine
	Object.defineProperty(State.prototype, "PREVIOUS", { get: function() { return 'previous'; } });
	// **change** must be used when a state is part of a **"loose"** state machine 
	Object.defineProperty(State.prototype, "CHANGE", { get: function() { return 'change'; } });
	/**
	 * --------------------------------
	 */


	return State;
});