define(["root", "layer"], function(root, Layer) {

	var LayerContainer = function() {
		this.layers = {};
	};

	LayerContainer.prototype.add = function(name) {
		var layer = new Layer();

		root.add(layer).start();
		this.layers[name] = layer;

		return layer;
	};

	LayerContainer.prototype.remove = function(name) {
		this.layers[name].clear();
		delete this.layers[name];
		root.remove(this.layers[name]);
	};

	LayerContainer.prototype.clear = function(name) { 
		this.layers[name].clear(); 
	};
	
	LayerContainer.prototype.get = function(name) { 
		if (!this.layers[name]) {
			throw new Error('Layer ' + '"' + name + '"' + ' does not exist.');
		}

		return this.layers[name]; 
	};

	LayerContainer.prototype.stop = function(name) { 
		this.layers[name].canUpdate = this.layers[name].canDraw = false; 
	};

	LayerContainer.prototype.resume = function(name) { 
		this.layers[name].canUpdate = this.layers[name].canDraw = true; 
	};

	LayerContainer.prototype.stop_draw = function(name) { this.layers[name].canDraw = false; };

	LayerContainer.prototype.resume_draw = function(name) { this.layers[name].canDraw = true; };

	LayerContainer.prototype.stop_update = function(name) { this.layers[name].canUpdate = false; };

	LayerContainer.prototype.resume_update = function(name) { this.layers[name].canUpdate = true; };

	LayerContainer.prototype.all = function(action, method) { 
		if (method) action = action + '_' + method;

		for (var k in this.layers) { 
			this[action](k); 
		} 
	};

	return new LayerContainer();
});