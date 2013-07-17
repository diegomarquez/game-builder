define(function() {

	var Delegate = function() {
		this.callbackList = null;
		this.list = null;
	}

	Delegate.prototype.add = function(name, scope, callback, removeOnExecute) {
		if (!this.callbackList[name]) {
			this.callbackList[name] = [];
		}

		this.callbackList[name].push({ scope: scope, callback: callback, removeOnExecute: removeOnExecute });
	}

	Delegate.prototype.remove = function(name, scope, callback) {
		this.list = this.callbackList[name];

		if (!this.list) return;

		for (var i = this.list.length - 1; i >= 0; i--) {
			var callbackObject = this.list[i];

			if (scope === callbackObject.scope && callback === callbackObject.callback) {
				this.list[i] = null;
			}
		}
	}

	Delegate.prototype.removeAll = function(name) {
		if (this.callbackList[name]) {
			this.callbackList[name].lenght = 0;
			this.callbackList[name] = null;
		}
	}

	Delegate.prototype.cleanUp = function(name) {
		for (var k in this.callbackList) {
			this.removeAll(k);
		}
	}

	Delegate.prototype.execute = function(args) {
		this.list = this.callbackList[name];

		if (!this.list) return;

		for (var i = 0; i < this.list.length; i++) {
			var callbackObject = this.list[i];

			if(!callbackObject) continue;

			callbackObject.callback.call(callbackObject.scope, args);

			if(callbackObject.removeOnExecute) {
				this.list[i] = null;
			}
		}
	}

	return new Delegate();
});