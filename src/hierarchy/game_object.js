define(["delegate", "matrix_3x3", "game_object_debug_draw"], function(Delegate, Matrix, DebugDraw) {

	//This is used as a helper in getTransform
	//Declared here in an act of ultimate evil, AKA, premature optimization.
	var go;

	var GameObject = Delegate.extend({
		init: function() {
			this._super();

			this.parent = null;
			this.matrix = new Matrix();

			this.components = null;
			this.renderer = null;

			this.x = 0;
			this.y = 0;
			this.centerX = 0;
			this.centerY = 0;
			this.rotation = 0;
			this.scaleX = 1;
			this.scaleY = 1;

			this.alpha = 1;

			this.canUpdate = false;
			this.canDraw = false;

			this.typeId = null;
			this.poolId = null;
		},

		reset: function() {
			this.rotation = 0;
			this.scaleX = 1;
			this.scaleY = 1;
			this.alpha = 1;
		},

		start: function() {
			this.canUpdate = true;
			this.canDraw = true;

			if(this.renderer) {
				this.renderer.start();
			}

			if (this.components) {
				for (var i = 0; i < this.components.length; i++) {
					this.components[i].start();
				}
			}

			this.execute('start', this);
		},

		update: function(delta) {},
		destroy: function() {},

		configure: function(args) {
			if (!args) return;

			for (var ha in args) {
				this[ha] = args[ha];
			}

			this.args = args;
		},

		setRenderer: function(renderer) {
			if(!renderer) return;

			this.renderer = renderer;
			renderer.onAdded(this);
		},

		removeRenderer: function() {
			if(!renderer) return;

			renderer.onRemoved(this);
			renderer.destroy();
			this.renderer = null;
		},

		addComponent: function(component) {
			if (!this.components) {
				this.components = [];
			}

			if (component.parent) {
				component.parent.removeComponent(component);
			}

			this.components.push(component);
			component.onAdded(this);
		},

		removeComponent: function(component) {
			if (!this.components) return;

			var index = this.components.indexOf(component);

			if (index != -1) {
				this.components.splice(index, 1);
				component.onRemoved();
				component.destroy();
			}
		},

		removeComponents: function() {
			if (!this.components) return;

			while (this.components.length) {
				removeComponent(this.components.pop());
			}
		},

		transformAndDraw: function(context) {
			this.matrix.identity().appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.centerX, this.centerY);
			context.transform(this.matrix.a, this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.tx, this.matrix.ty);
			context.globalAlpha *= this.alpha;

			if(this.renderer) {
				this.renderer.draw(context);
			}

			DebugDraw.call(this, context);
		},

		clear: function() {
			this.execute('recycle', this);

			this.destroy();

			this.removeRenderer();
			this.removeComponents();

			this.canUpdate = false;
			this.canDraw = false;
			this.parent = null;
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

		getMatrix: function(m) {
			if (m) {
				m.identity();
			} else {
				m = new Matrix().identity();
			}

			go = this;

			while (go != null) {
				m.prependTransform(go.x, go.y, go.scaleX, go.scaleY, go.rotation, go.centerX, go.centerY);
				go = go.parent;
			}

			return m;
		},

		getTransform: function(r, m) {
			if (m) {
				m.identity();
			} else {
				m = new Matrix().identity();
			}

			go = this;

			while (go != null) {
				m.prependTransform(go.x, go.y, go.scaleX, go.scaleY, go.rotation, go.centerX, go.centerY);
				go = go.parent;
			}

			m.decompose(r);

			return r;
		}
	});

	return GameObject;
});