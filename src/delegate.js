define(["require", "class"], function(require) {

	Utils = require("util");

	var Delegate = Class.extend({
		init: function(bubbling) {
			this.callbackList = {};
			this.list = null;

			this.bubbling = bubbling || false;
		},

		on: function(name, scope, callback, removeOnExecute, inmediate, keepOnCleanUp) {
			if (!this.callbackList[name]) {
				this.callbackList[name] = [];
			}

			if (inmediate) {
				callback();
			}

			this.callbackList[name].push({
				scope: scope,
				callback: callback,
				removeOnExecute: removeOnExecute,
				keep: keepOnCleanUp
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

		softCleanUp: function() {
			for (var k in this.callbackList) {
				this.list = this.callbackList[k];

				if (!this.list) return;

				for (var i = this.list.length - 1; i >= 0; i--) {
					var callbackObject = this.list[i];

					if (!callbackObject.keep) {
						this.list[i] = null;
					}
				}
			}
		},

		hardCleanUp: function() {
			for (var k in this.callbackList) {
				this.removeAll(k);
			}
		},

		destroy: function() {
			Utils.destroyObject(this);
		},

		execute: function(name, args) {
			this.list = this.callbackList[name];

			if (!this.list) return;

			for (var i = 0; i < this.list.length; i++) {
				var callbackObject = this.list[i];

				if (!callbackObject) continue;

				callbackObject.callback.call(callbackObject.scope, args);

				if(this.bubbling && callbackObject.scope.parent) {
					callbackObject.scope.parent.execute(name, args)
				}

				if (callbackObject.removeOnExecute) {
					this.list[i] = null;
				}
			}
		}
	});

	return Delegate;
});