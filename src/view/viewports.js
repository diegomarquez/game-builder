/**
 * # viewports.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [delegate](@@delegate@@)
 *
 * Depends of: 
 * [viewport](@@viewport@@)
 * [error-printer](@@error-printer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module serves as a container for all the [viewport](@@viewport@@) objects created.
 */

/**
 * Viewport management
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["delegate", "viewport", "error-printer"], function(Delegate, Viewport, ErrorPrinter) {

	var viewports = {};
	var viewportsArray = [];
	
	var ViewportContainer = Delegate.extend({
		init: function () {
			this._super();
		},

		/**
		 * <p style='color:#AD071D'><strong>add</strong></p>
		 *
		 * Creates a new [viewport](@@viewport@@) and adds it to the container.
		 * 
		 * @param {String} name    Id of the new [viewport](@@viewport@@)
		 * @param {Number} width   Width of the new [viewport](@@viewport@@)
		 * @param {Number} height  Height of the new [viewport](@@viewport@@)
		 * @param {Number} offsetX X offset relative to the top corner of the screen
		 * @param {Number} offsetY Y offset relative to the top corner of the screen
		 *
		 * @return {Object} The newly created [viewport](@@viewport@@). If it already exists, the existing one is returned
		 */
		add: function (name, width, height, offsetX, offsetY, scaleX, scaleY) {		
			if (!viewports[name]) {
				var v = new Viewport(name, width, height, offsetX, offsetY, scaleX, scaleY);

				viewports[name] = v;
				viewportsArray.push(v);
				
				this.execute(this.ADD, v);

				return v;
			} 

			return viewports[name];
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>add</strong></p>
		 *
		 * Creates a new [viewport](@@viewport@@) and adds it to the container.
		 * 
		 * @param {Object} viewport An object with all the properties needed to create a [viewport](@@viewport@@)
		 *
		 * @return {Object} The newly created [viewport](@@viewport@@). If it already exists, the existing one is returned
		 */
		addFromObject: function (viewport) {
			var name = viewport.name;

			if (!viewports[name]) {
				var v = new Viewport(name, viewport.width, viewport.height, viewport.offsetX, viewport.offsetY, viewport.scaleX, viewport.scaleY);

				v.setStroke(viewport.stroke.width, viewport.stroke.color);
				v.WorldFit = viewport.worldFit;

				viewports[name] = v;
				viewportsArray.push(v);

				this.execute(this.ADD, v);
				
				return v;
			}

			return viewports[name];
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>remove</strong></p>
		 *
		 * Removes the specified [viewport](@@viewport@@)
		 * 
		 * @param {String} name    Id of the [viewport](@@viewport@@) to remove
		 */
		remove: function (name) {
			if (!viewports[name]) {
				ErrorPrinter.printError('Viewports', 'Viewport with id:' + name + ' does not exist.');
			}

			this.execute(this.REMOVE, viewports[name]);

			viewportsArray.splice(viewportsArray.indexOf(viewports[name]), 1);
			viewports[name].destroy();
			viewports[name] = null;
			delete viewports[name];
		},
		/**
		 * --------------------------------
		 */
		
		 /**
		 * <p style='color:#AD071D'><strong>swap</strong></p>
		 *
		 * Swaps the specified [viewports](@@viewport@@) order
		 *
		 * @param {String|Number} [first] Name of one of the [viewports](@@viewport@@) to swap
		 * @param {String|Number} [second] Name of one of the [viewports](@@viewport@@) to swap
		 */
		swap: function (first, second) {
			var firstIndex, secondIndex;

			if (typeof first == 'number' && typeof second == 'number') {
				firstIndex = first;
				secondIndex = second;
			} else {
				firstIndex = viewportsArray.indexOf(viewports[first]);
				secondIndex = viewportsArray.indexOf(viewports[second]);
			}

			var firstViewport = viewportsArray[firstIndex];
			var secondViewport = viewportsArray[secondIndex];

			viewportsArray[firstIndex] = null;
			viewportsArray[secondIndex] = null;

			viewportsArray[firstIndex] = secondViewport;
			viewportsArray[secondIndex] = firstViewport;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>removeAll</strong></p>
		 *
		 * Destroys all the [viewports](@@viewport@@)
		 */
		removeAll: function () {
			for (var i = viewportsArray.length - 1; i >= 0; i--) {
				this.remove(viewportsArray[i].name);
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>show</strong></p>
		 *
		 * Makes the specified [viewport](@@viewport@@) visible
		 * 
		 * @param  {String} name Id of the [viewport](@@viewport@@) to make visible
		 *
		 * @throws {Error} If the id specified does not exist
		 */
		show: function (name) {
			if (!viewports[name]) {
				ErrorPrinter.printError('Viewports', 'Viewport with id:' + name + ' does not exist.');
			}

			viewports[name].show();
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>hide</strong></p>
		 *
		 * Makes the specified [viewport](@@viewport@@) invisible
		 * 
		 * @param  {String} name Id of the [viewport](@@viewport@@) to make invisible
		 *
		 * @throws {Error} If the id specified does not exist
		 */
		hide: function (name) { 
			if (!viewports[name]) {
				ErrorPrinter.printError('Viewports', 'Viewport with id:' + name + ' does not exist.');
			}

			viewports[name].hide();
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>get</strong></p>
		 * 
		 * Get a reference to the specified [viewport](@@viewport@@)
		 * 
		 * @param  {String} name Id of the [viewport](@@viewport@@) to get
		 *
		 * @throws {Error} If the id specified does not exist
		 */
		get: function (name) { 
			if (!viewports[name]) {
				ErrorPrinter.printError('Viewports', 'Viewport with id:' + name + ' does not exist.');
			}

			return viewports[name]; 
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>exists</strong></p>
		 * 
		 * @param  {String} name Id of the [viewport](@@viewport@@) to check
		 *
		 * @throws {Boolean} Whether the [viewport](@@viewport@@) exists or not
		 */
		exists: function (name) { 
			return viewports[name]; 
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>iterate</strong></p>
		 *
		 * Iterate through all the viewports executing the callback function with each [viewport](@@viewport@@) as argument
		 * 
		 * @param  {Function} method The method to execute for each [viewport](@@viewport@@)
		 */
		iterate: function(scope, method) {
			for (var i = 0; i < viewportsArray.length; i++) {
				method.call(scope, viewportsArray[i]); 
			}
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>all</strong></p>
		 *
		 * Get a reference to an object containing all the created [viewports](@@viewport@@)
		 *
		 * @return {Object} An object with all the [viewport](@@viewport@@) objects
		 */
		all: function () { 
			return viewports; 
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>allAsArray</strong></p>
		 *
		 * A reference to an array containing all the created [viewports](@@viewport@@)
		 *
		 * @return {Array} An array with all the [viewport](@@viewport@@) objects
		 */
		allAsArray: function () { 
			return viewportsArray; 
		}
		/**
		 * --------------------------------
		 */
	});

	Object.defineProperty(ViewportContainer.prototype, "ADD", { get: function() { return 'add'; } });
	Object.defineProperty(ViewportContainer.prototype, "REMOVE", { get: function() { return 'remove'; } });

	return new ViewportContainer();
});