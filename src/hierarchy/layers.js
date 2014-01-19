/**
 * # layers.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of: 
 * [root](@@root@@)
 * [layer](@@layer@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * This module defines an object to contain and work with [layer](@@layer@@) objects.
 *
 * It also acts as a wrapper for interacting with [root](@@root@@).
 * 
 * Not much else needs to be said about this module, it's not very complex.
 */

/**
 * Layer management
 * --------------------------------
 */

/**
 * --------------------------------
 */
define(["root", "layer"], function(root, Layer) {

	var LayerContainer = function() {
		this.layers = {};
	};

	/**
	 * <p style='color:#AD071D'><strong>add</strong></p>
	 *
	 * Adds a new layer. The layer is managed in this object, but
	 * it also is added to [root](@@root@@), which is what will actually make it
	 * display.
	 *
	 * On that subject, it is important to not that if you re-arrange the elements
	 * of the array that the layer is added to, nothing will happen to the order of
	 * updating or rendering, as that is controlled by the [root](@@root@@), which has
	 * a list of childs of it's own.
	 * 
	 * @param {String} name Id of the layer, used later to refer to the layer.
	 */
	LayerContainer.prototype.add = function(name) {
		var layer = new Layer();

		root.add(layer).start();
		this.layers[name] = layer;

		return layer;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>remove</strong></p>
	 *
	 * Removes a layer from the array in this object, and also from the [root](@@root@@).
	 * Prior to removing the layer it also clears it from any [game-objects](@@game-object@@)
	 *
	 * A removed layer can not be used again, if you wish to just remove all [game-objects](@@game-object@@)
	 * from a layer you might want to use the **clear** method.
	 * 
	 * @param  {String} name Id of the layer to remove
	 */
	LayerContainer.prototype.remove = function(name) {
		this.layers[name].clear();
		delete this.layers[name];
		root.remove(this.layers[name]);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>clear</strong></p>
	 *
	 * Clears a layer from all [game-objects](@@game-object@@)
	 *
	 * A cleared layer can still be used to add more things to it.
	 */
	LayerContainer.prototype.clear = function(name) { 
		this.layers[name].clear(); 
	};
	/**
	 * --------------------------------
	 */
	
	/**
	 * <p style='color:#AD071D'><strong>get</strong></p>
	 *
	 * Get a reference to a layer
	 * 
	 * @param  {String} name Id of the layer to get a reference to.
	 *
	 * @return {Layer} The specified layer.    
	 */
	LayerContainer.prototype.get = function(name) { 
		if (!this.layers[name]) {
			throw new Error('Layer ' + '"' + name + '"' + ' does not exist.');
		}

		return this.layers[name]; 
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>stop</strong></p>
	 *
	 * Stops updating and rendering everythin in the requested layer.
	 * For practical purposes this method pauses and makes invisible all the contents
	 * of a layer.
	 * 
	 * @param  {String} name Id of the layer in which to stop all activity
	 */
	LayerContainer.prototype.stop = function(name) { 
		this.stop_update(name);
		this.stop_draw(name);		
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>resume</strong></p>
	 *
	 * Resumes all activity in the specified layer.
	 * 
	 * @param  {String} name Id of the layer to resume activity in 
	 */
	LayerContainer.prototype.resume = function(name) { 
		this.resume_update(name);
		this.resume_draw(name);		
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>stop_draw</strong></p>
	 *
	 * Stops rendering of the specified layer. Effectively making everything in it invisible.
	 * 
	 * @param  {String} name Id of the layer that should stop rendering
	 */
	LayerContainer.prototype.stop_draw = function(name) { this.layers[name].canDraw = false; };
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>resume_draw</strong></p>
	 *
	 * Resumes rendering of the specified layer. 
	 *
	 * @param  {String} name Id of the layer that should resume rendering
	 */
	LayerContainer.prototype.resume_draw = function(name) { this.layers[name].canDraw = true; };
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>stop_update</strong></p>
	 *
	 * Stops updating of the specified layer. Effectively pausing everything in it.
	 * 
	 * @param  {String} name Id of the layer that should stop updating
	 */
	LayerContainer.prototype.stop_update = function(name) { this.layers[name].canUpdate = false; };
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>resume_update</strong></p>
	 *
	 * Resumes updating of the specified layer. 
	 *
	 * @param  {String} name Id of the layer that should resume updating
	 */
	LayerContainer.prototype.resume_update = function(name) { this.layers[name].canUpdate = true; };
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>all</strong></p>
	 *
	 * Performs a given action on all the layers. The two arguments
	 * are concatenated to form the name of one of the methods described 
	 * earlier to control layers. ej.:
	 *
	 * * ``` javascript
	 * layers.all('stop', 'update');
	 * ```
	 *
	 * Would stop the updating of all the layers.
	 * 
	 * @param  {String} action This can be either 'resume' or 'stop'
	 * @param  {String} method This can be either 'draw' or update.
	 */
	LayerContainer.prototype.all = function(action, method) { 
		if (method) action = action + '_' + method;

		for (var k in this.layers) { 
			this[action](k); 
		} 
	};
	/**
	 * --------------------------------
	 */

	return new LayerContainer();
});