/**
 * # viewports.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 * [delegate](http://diegomarquez.github.io/game-builder/game-builder-docs/src/delegate.html)
 *
 * Depends of: 
 * [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
 * [error-printer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/debug/error-printer.html)
 * [util](http://diegomarquez.github.io/game-builder/game-builder-docs/src/util.html)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 *
 * This module serves as a container for all the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) objects created.
 *
 * This module extends [delegate](http://diegomarquez.github.io/game-builder/game-builder-docs/src/delegate.html) so it provides a few events to hook into:
 *
 * ### **ADD** 
 * When a [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) is added
 * 
 * Registered callbacks get the [viewports](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewports.html) as argument 
 * ``` javascript  
 * gb.viewports.on(gb.viewports.ADD, function(viewports) {});
 * ``` 
 *
 * </br>
 *
 * ### **REMOVE** 
 * When a [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) is removed 
 * 
 * Registered callbacks get the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) as argument 
 * ``` javascript  
 * gb.viewports.on(gb.viewports.REMOVE, function(viewport) {});
 * ``` 
 *
 * </br>
 *
 * ### **CHANGE** 
 * When a [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) changes position
 *
 * Registered callbacks get the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) as argument 
 * ``` javascript  
 * gb.viewports.on(gb.viewports.CHANGE, function(viewport) {});
 * ``` 
 *
 * </br>
 *
 * ### **MOVE** 
 * When all the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) is moved
 * 
 * ``` javascript  
 * gb.viewports.on(gb.viewports.MOVE, function() {});
 * ``` 
 *
 * </br>
 *
 * <strong>Note: The snippet uses the reference to <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewports.html>viewports</a>
 * found in the <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/gb.html>gb</a> module. 
 * The way you get a hold to a reference to <a href=http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewports.html>viewports</a>
 * may vary.</strong>
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
		 * Creates a new [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) and adds it to the container.
		 * 
		 * @param {String} name    Id of the new [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
		 * @param {Number} width   Width of the new [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
		 * @param {Number} height  Height of the new [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
		 * @param {Number} [offsetX=0] X offset relative to the top corner of the screen
		 * @param {Number} [offsetY=0] Y offset relative to the top corner of the screen
		 * @param {Number} [scaleX=1] X scale of the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
		 * @param {Number} [scaleY=1] Y scale of the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
		 * @param {Array} [layers=null] Y An array of strings with the names of [layer](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/layer.html) objects to add on the created [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
		 * @param {Number} [strokeColor=null] Color of the stroke around the [viewports](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewports.html)
		 * @param {Number} [strokeWidth=null] Width of the stroke around the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)		 
		 * @param {Boolean} [worldfit=false] Whether [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) should scale to fit the [world](http://diegomarquez.github.io/game-builder/game-builder-docs/src/world.html) size
		 * @param {Boolean} [culling=true] Whether the viewport should perform culling when [game-objects](http://diegomarquez.github.io/game-builder/game-builder-docs/src/hierarchy/game-object.html) are drawn to it
		 * @param {Boolean} [clipping=true] Whether the viewport should clip drawings that fall outside of it's viewing area
		 *
		 * @return {Object} The newly created [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html). If it already exists, the existing one is returned
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
		 * <p style='color:#AD071D'><strong>addFromObject</strong></p>
		 *
		 * Creates a new [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) and adds it to the container.
		 * 
		 * @param {Object} viewport An object with all the properties needed to create a [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
		 *
		 * @return {Object} The newly created [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html). If it already exists, the existing one is returned
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
		 * Removes the specified [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
		 * 
		 * @param {String} name    Id of the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) to remove
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
		 * @param {String} [name] Name [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) to change
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
		 * Place the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) specified by the first argument after
		 * the one specified by the second argument.
		 *
		 * @param {String} [name] Name [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) to change
		 * @param {String} [other] Name [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) which should come before to the one in the first argument
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
		 * Place the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) specified by the first argument before
		 * the one specified by the second argument.
		 *
		 * @param {String} [name] Name [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) to change
		 * @param {String} [other] Name [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) which should come after to the one in the first argument
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
		 * Destroys all the [viewports](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
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
		 * Makes the specified [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) visible
		 * 
		 * @param  {String} name Id of the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) to make visible
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
		 * Makes the specified [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) invisible
		 * 
		 * @param  {String} name Id of the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) to make invisible
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
		 * Get a reference to the specified [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
		 * 
		 * @param  {String} name Id of the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) to get
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
		 * @param  {String} name Id of the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) to check
		 *
		 * @throws {Boolean} Whether the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) exists or not
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
		 * Iterate through all the viewports executing the callback function with each [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) as argument
		 * 
		 * @param  {Function} method The method to execute for each [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
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
		 * Get a reference to an object containing all the created [viewports](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
		 *
		 * @return {Object} An object with all the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) objects
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
		 * A reference to an array containing all the created [viewports](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html)
		 *
		 * @return {Array} An array with all the [viewport](http://diegomarquez.github.io/game-builder/game-builder-docs/src/view/viewport.html) objects
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