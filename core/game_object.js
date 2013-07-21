define(["delegate"], function(Delegate) {

	var GameObject = Delegate.extend({
		init: function() {
			this._super();

			this.transformed_pos;

			this.parent = null;

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

		transformAndDraw: function(context) {
			if(!this.parent) {
				context.save();
			}

			if (this.doTranslation) {
				context.translate(this.x, this.y);
				this.transformed_pos = context.getCoords(0, 0);
			}

			if ((this.rotation != 0 && this.doRotation) || ((this.scaleX != 1 || this.scaleY != 1) && this.doScaling)) {
				context.translate(this.centerX, this.centerY);

				if (this.rotation != 0 && this.doRotation) {
					context.rotate(this.rotation * Math.PI / 180);
				}

				if ((this.scaleX != 1 || this.scaleY != 1) && this.doScaling) {
					context.scale(this.scaleX, this.scaleY);
				}

				context.translate(-this.centerX, -this.centerY);
			}

			context.globalAlpha *= this.alpha;
			
			this.draw(context);

			if(!this.parent) {
				context.restore();
			}
		},

		clear: function() {
			this.execute('recycle', this);
			this.destroy();
		}
	});

	GameObject.CIRCLE_COLLIDER = 0;
	GameObject.POLYGON_COLLIDER = 1;

	return GameObject;
});