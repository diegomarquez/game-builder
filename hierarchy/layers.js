define(["root", "layer"], function(root, Layer) {

	var LayerContainer = function() {};

	LayerContainer.prototype.add = function(name) {
		var layer = new Layer();
		this[name] = layer;
		root.add(layer).start();
		return layer;
	};

	LayerContainer.prototype.remove = function(name) {
		this[name].clear();
		root.remove(this[name]);
	};

	LayerContainer.prototype.clear = function(name) {
		this[name].clear();
	};

	LayerContainer.prototype.get = function(name) {
		return this[name];
	};

	LayerContainer.prototype.removeAll = function() {
		for (var k in this) {
			this.remove(k);
		}
	};

	LayerContainer.prototype.clearAll = function() {
		for (var k in this) {
			this.clear(k);
		}
	};

	LayerContainer.prototype.toggleDrawingOf = function(name) {
		this[name].canDraw = !this[name].canDraw;
	};

	LayerContainer.prototype.toggleUpdateOf = function(name) {
		this[name].canUpdate = !this[name].canUpdate;
	};

	return new LayerContainer();
});