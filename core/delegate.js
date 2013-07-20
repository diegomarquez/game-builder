define(["class"], function() {
	
	var Delegate = Class.extend({
		init: function() {
			this.callbackList = {};
			this.list = null;
		},

		on: function(name, scope, callback, removeOnExecute, inmediate) {
			if (!this.callbackList[name]) {
				this.callbackList[name] = [];
			}

			if(inmediate){
				callback();
			}

			this.callbackList[name].push({
				scope: scope,
				callback: callback,
				removeOnExecute: removeOnExecute
			});
		},

		remove: function(name, scope, callback) {
			this.list = this.callbackList[name];

			if (!this.list) return;

			for (var i = this.list.length - 1; i >= 0; i--) {
				var callbackObject = this.list[i];

				if (scope === callbackObject.scope && callback === callbackObject.callback) {
					this.list[i] = null;
				}
			}
		},

		removeAll: function(name) {
			if (this.callbackList[name]) {
				this.callbackList[name].lenght = 0;
				this.callbackList[name] = null;
			}
		},

		cleanUp: function() {
			for (var k in this.callbackList) {
				this.removeAll(k);
			}
		},

		execute: function(name, args) {
			this.list = this.callbackList[name];

			if (!this.list) return;

			for (var i = 0; i < this.list.length; i++) {
				var callbackObject = this.list[i];

				if (!callbackObject) continue;

				callbackObject.callback.call(callbackObject.scope, args);

				if (callbackObject.removeOnExecute) {
					this.list[i] = null;
				}
			}
		}
	});

	return Delegate;
});