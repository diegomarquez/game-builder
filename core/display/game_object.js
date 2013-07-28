define(["delegate", "matrix_3x3"], function(Delegate, Matrix) {

	var GameObject = Delegate.extend({
		init: function() {
			this._super();

			this.parent = null;
			this.matrix = new Matrix();

			this.x = 0;
			this.y = 0;
			this.centerX = 0;
			this.centerY = 0;
			this.rotation = 0;
			this.scaleX = 1;
			this.scaleY = 1;

			this.alpha = 1;

			this.alive = true;
			this.typeId;
			this.poolId;
			this.activeOnSoftPause;

			// this.collisionId;
			// this.checkingCollisions;

			this.doTranslation = true;
			this.doRotation = true;
			this.doScaling = true;
		},

		reset: function() {},
		update: function(delta) {},
		draw: function(context) {},
		destroy: function() {},

		// onCollide: function(other) {},
		// getColliderType: function() {},
		// getCollider: function() {},

		transformAndDraw: function(context, saveContext) {
			if(saveContext){
				context.save();
			}

			this.matrix.identity().appendTransform(this.x, this.y, this.scaleX, this.scaleY, this.rotation, this.centerX, this.centerY);
		
			context.transform(this.matrix.a,  this.matrix.b, this.matrix.c, this.matrix.d, this.matrix.tx, this.matrix.ty);

			context.globalAlpha *= this.alpha;

			this.draw(context);

			if(saveContext){
				context.restore();
			}
		},

		clear: function() {
			this.execute('recycle', this);
			this.destroy();
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
			if(x) this.x = x;
			if(y) this.y = y;

			if(scaleX) this.scaleX = scaleX;
			if(scaleY) this.scaleY = scaleY;

			if(rotation) this.rotation = rotation;
			
			if(centerX) this.centerX = centerX;
			if(centerY) this.centerY = centerY;
		},

		getTransform: function(m, r) {
			if(m) {
				m.identity();
			}
			else {
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

	GameObject.CIRCLE_COLLIDER = 0;
	GameObject.POLYGON_COLLIDER = 1;

	return GameObject;
});