function Delegate() {}

Delegate.prototype.add = function(name, scope, callback) {
	if (!this[name+"Delegate"]) {
		this[name+"Delegate"] = [];
	}
	this[name+"Delegate"].push({
		scope: scope,
		callback: callback
	});
}

Delegate.prototype.remove = function(name, scope, callback) {
	if (!this[name+"Delegate"]) {
		return;
	}

	for (var i = this[name+"Delegate"].length - 1; i >= 0; i--) {
		var callbackObject = this[name+"Delegate"][i];

		if (scope === callbackObject.scope && callback === callbackObject.callback) {
			this[name+"Delegate"].splice(i, 1);
		}
	}
}

Delegate.prototype.removeAll = function(name) {
	if (this[name+"Delegate"]) {
		this[name+"Delegate"].lenght = 0;
		this[name+"Delegate"] = null;
	}
}

Delegate.prototype.execute = function(name, args) {
	if (!this[name+"Delegate"]) {
		return;
	}

	for (var i = 0; i < this[name+"Delegate"].length; i++) {
		var callbackObject = this[name+"Delegate"][i];
		callbackObject.callback.call(callbackObject.scope, args);
	}
}

