define(["delegate"], function(Delegate) {

	var GameObject = Delegate.extend({
		init: function() {
			this._super();

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
			//this.typeId;
			//this.collisionId;
			//this.poolId;
			//this.checkingCollisions;
			this.activeOnSoftPause;

			this.destroyMode = 0;

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

		// destroyWithCallbacks: function() {
		// 	this.alive = false;
		// 	this.destroyMode = 0;
		// },

		// destroyWithOutCallBacks: function() {
		// 	this.alive = false;
		// 	this.destroyMode = 1;
		// },

		// removeAllCallbacks: function() {
		// 	this.cleanUp();
		// },

		transformAndDraw: function(context) {
			//Esto es para guardar la transformacion actual
			context.save();

			//Traslado lo que voy a dibujar
			if (this.doTranslation) {
				if(this.parent){
					context.translate(this.x + this.parent.x, this.y + this.parent.y);
				}else{
					context.translate(this.x, this.y);
				}
			}

			//Esto es para aplicar las tranformaciones desde el centro definido
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

			if (this.alpha >= 1) {
				this.draw(context);
			} else if (this.alpha > 0 && this.alpha < 1) {
				context.globalAlpha = this.alpha;
				this.draw(context);
			}

			//Restauro la matriz de transformacion del canvas para que se vea todo bien
			context.restore();
		},

		// clearGameObject: function() {
		// 	if (this.destroyMode == 0) {
		// 		this.execute("onDestroy", this);
		// 	}

		// 	this.execute("onRecicle", this);

		// 	this.destroy();
		// }

	});

	//GameObject.CIRCLE_COLLIDER = 1;
	//GameObject.POLYGON_COLLIDER = 2;

	return GameObject;
});