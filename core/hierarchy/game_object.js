define(["delegate", "matrix_3x3", "factory"], function(Delegate, Matrix, Factory) {

	var GameObject = Delegate.extend({
		init: function() {
			this._super();

			this.parent = null;
			this.matrix = new Matrix();

			this.components;

			this.x = 0;
			this.y = 0;
			this.centerX = 0;
			this.centerY = 0;
			this.rotation = 0;
			this.scaleX = 1;
			this.scaleY = 1;

			this.alpha = 1;

			this.alive;
			this.typeId;
			this.poolId;

			this.returnToPool = false;
		},

		reset: function() {
			this.rotation = 0;
			this.scaleX = 1;
			this.scaleY = 1;
			this.alpha = 1;
		},

		start: function() {
			this.alive = true;

			if (!this.components) return;

			for (var i = 0; i < this.components.length; i++) {
				this.components[i].start();
			}
		},

		update: function(delta) {},
		draw: function(context) {},
		destroy: function() {},

		configure: function(args) {
			if (args) {
				for (var ha in args) {
					this[ha] = args[ha];
				}
			}
		},

		addComponent: function(component, returnToFactoryOnRemove) {
			if (!this.components) {
				this.components = [];
			}

			if (component.parent) {
				component.parent.removeComponent(component);
			}

			this.components.push(component);
			component.onAdded(this, returnToFactoryOnRemove);
		},

		removeComponent: function(component) {
			if (!this.components) return;

			var index = this.components.indexOf(component);

			if (index != -1) {
				if(component.returnToFactory) {
					Factory.returnComponentToPool(component);
				}

				this.components.splice(index, 1);
				component.onRemoved();

				component = null;
			}
		},

		removeAllComponents: function() {
			if (!this.components) return;

			while (this.components.length) {
				var c = this.components.pop();
				removeComponent(c);
				c.destroy();
				c = null;
			}
		},

		transformAndDraw: function(context, saveContext) {
			if (saveContext) {
				context.save();
			}

			this.matrix.identity().appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.centerX, this.centerY);

			context.transform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.tx, this.matrix.ty);

			context.globalAlpha *= this.alpha;

			this.draw(context);

			if (saveContext) {
				context.restore();
			}
		},

		clear: function() {
			this.execute('recycle', this);

			this.destroy();

			if (!this.components) return;

			for (var i = 0; i < this.components.length; i++) {
				this.components[i].destroy();
			}

			if(this.returnToPool) {
				Factory.returnGameObjectToPool(this);
			}

			this.alive = false;
		},

		resetTransform: function(x, y, scaleX, scaleY, rotation, centerX, centerY) {
			this.x = x || 0;
			this.y = y || 0;
			this.scaleX = scaleX == null ? 1 : scaleX;
			this.scaleY = scaleY == null ? 1 : scaleY;
			this.rotation = rotation || 0;
			this.centerX = centerX || 0;
			this.centerY = centerY || 0;
		},

		setTransform: function(x, y, scaleX, scaleY, rotation, centerX, centerY) {
			if (x) this.x = x;
			if (y) this.y = y;

			if (scaleX) this.scaleX = scaleX;
			if (scaleY) this.scaleY = scaleY;

			if (rotation) this.rotation = rotation;

			if (centerX) this.centerX = centerX;
			if (centerY) this.centerY = centerY;
		},

		getTransform: function(m, r) {
			if (m) {
				m.identity();
			} else {
				m = new Matrix().identity();
			}

			var go = this;

			while (go != null) {
				m.prependTransform(go.x, go.y, go.scaleX, go.scaleY, go.rotation, go.centerX, go.centerY);
				go = go.parent;
			}

			return m.decompose(r);
		}
	});

	return GameObject;
});