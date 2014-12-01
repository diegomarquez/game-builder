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
 * [util](@@util@@)
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
define(["delegate", "viewport", "error-printer", "util"], function(Delegate, Viewport, ErrorPrinter, Util) {

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
		 * @param {Number} [offsetX=0] X offset relative to the top corner of the screen
		 * @param {Number} [offsetY=0] Y offset relative to the top corner of the screen
		 * @param {Number} [scaleX=1] X scale of the [viewport](@@viewport@@)
		 * @param {Number} [scaleY=1] Y scale of the [viewport](@@viewport@@)
		 * @param {Array} [layers=null] Y An array of strings with the names of [layer](@@layer@@) objects to add on the created [viewport](@@viewport@@)
		 * @param {Number} [strokeColor=null] Color of the stroke around the [viewports](@@viewports@@)
		 * @param {Number} [strokeWidth=null] Width of the stroke around the [viewport](@@viewport@@)		 
		 * @param {Boolean} [worldfit=false] Whether [viewport](@@viewport@@) should scale to fit the [world](@@world@@) size
		 * @param {Boolean} [culling=true] Whether the viewport should perform culling when [game-objects](@@game-object@@) are drawn to it
		 * @param {Boolean} [clipping=true] Whether the viewport should clip drawings that fall outside of it's viewing area
		 *
		 * @return {Object} The newly created [viewport](@@viewport@@). If it already exists, the existing one is returned
		 */
		add: function (name, width, height, offsetX, offsetY, scaleX, scaleY, layers, strokeColor, strokeWidth, worldFit, culling, clipping) {		
			if (!viewports[name]) {
				var v = create.apply(this, arguments);

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
				var v = create(
					name, 
					viewport.width, 
					viewport.height, 
					viewport.offsetX, 
					viewport.offsetY, 
					viewport.scaleX, 
					viewport.scaleY, 
					viewport.layers,
					viewport.stroke.color, 
					viewport.stroke.width, 
					viewport.worldFit,
					viewport.culling,
					viewport.clipping
				);

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

			var v = viewports[name];

			viewportsArray.splice(viewportsArray.indexOf(v), 1);
			
			viewports[name] = null;
			delete viewports[name];
		
			this.execute(this.REMOVE, v);
			
			v.destroy();
		},
		/**
		 * --------------------------------
		 */
		
		 /**
		 * <p style='color:#AD071D'><strong>change</strong></p>
		 *
		 * Change the position of the specified viewport
		 *
		 * @param {String} [name] Name [viewport](@@viewport@@) to change
		 * @param {Number} [index] New index
		 */
		change: function (name, index) {
	      var viewport = viewports[name];
	      var viewportIndex = viewportsArray.indexOf(viewport);

	      viewportsArray.splice(viewportIndex, 1);
	      viewportsArray.splice(index, 0, viewport);

	      this.execute(this.CHANGE, viewport);
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>after</strong></p>
		 *
		 * Place the [viewport](@@viewport@@) specified by the first argument after
		 * the one specified by the second argument.
		 *
		 * @param {String} [name] Name [viewport](@@viewport@@) to change
		 * @param {String} [other] Name [viewport](@@viewport@@) which should come before to the one in the first argument
		 */
		after: function (name, other) {
			move.call(this, 'after', name, other);
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>before</strong></p>
		 *
		 * Place the [viewport](@@viewport@@) specified by the first argument before
		 * the one specified by the second argument.
		 *
		 * @param {String} [name] Name [viewport](@@viewport@@) to change
		 * @param {String} [other] Name [viewport](@@viewport@@) which should come after to the one in the first argument
		 */
		before: function (name, other) {
	    move.call(this, 'before', name, other);
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

	var create = function (name, width, height, offsetX, offsetY, scaleX, scaleY, layers, strokeColor, strokeWidth, worldFit, culling, clipping) {
		var v = new Viewport(name, width, height, offsetX, offsetY, scaleX, scaleY);

		v.setStroke(strokeWidth, strokeColor);

		if (Util.isBoolean(worldFit)) { v.WorldFit = worldFit; }
		if (Util.isBoolean(culling)) { v.Culling = culling; }
		if (Util.isBoolean(clipping)) { v.Clipping = clipping; }

		if (layers) {
			for (var i = 0; i < layers.length; i++) {
				v.addLayer(layers[i]);
			}
		}

		return v;
	}

	var move = function(type, current, pivot) {
		if (!viewports[current]) {
			ErrorPrinter.printError('Viewports', 'Viewport with id:' + current + ' does not exist.');
		}

		if (!viewports[pivot]) {
			ErrorPrinter.printError('Viewports', 'Viewport with id:' + pivot + ' does not exist.');
		}
       
		var current = viewports[current];
		var pivot = viewports[pivot];

		var currentIndex = viewportsArray.indexOf(current);
		var pivotIndex;

		if (type == 'before') {
			pivotIndex = viewportsArray.indexOf(pivot);
		}

		if (type == 'after') {
			pivotIndex = viewportsArray.indexOf(pivot) + 1;
		}

		viewportsArray.splice(pivotIndex, 0, viewportsArray.splice(currentIndex, 1)[0]);

		this.execute(this.MOVE, current);
	}

	Object.defineProperty(ViewportContainer.prototype, "ADD", { get: function() { return 'add'; } });
	Object.defineProperty(ViewportContainer.prototype, "REMOVE", { get: function() { return 'remove'; } });
	Object.defineProperty(ViewportContainer.prototype, "CHANGE", { get: function() { return 'change'; } });
	Object.defineProperty(ViewportContainer.prototype, "MOVE", { get: function() { return 'move'; } });

	return new ViewportContainer();
});