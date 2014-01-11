define(['component', 'collision-resolver'], function(Component, CollisionResolver) {

	var collisionList = null;
	var collisionOpponent = null;

	var CollisionComponent = Component.extend({
		start: function() {
			this.debugColor = "#FFFFFF";

			this.collisionId = this.id;
			this.checkingCollisions = true;

			CollisionResolver.addToCollisionList(this);

			if(!this.parent.onCollide)
				throw new Error("GameObject with typeId: " + this.parent.typeId + ", needs to define an onCollide method, yo.");
		},

		update: function() {
			collisionList = CollisionResolver.collisionLists[this.collisionId];

			if (collisionList != null) {
				for (k = 0; k < collisionList.length; k++) {
					collisionOpponent = collisionList[k];

					if (!collisionOpponent.checkingCollisions) break;

					if (CollisionResolver.areColliding(this, collisionOpponent)) {
						if (!this.checkingCollisions) break;
		
						this.onCollide(collisionOpponent)
						this.parent.onCollide(collisionOpponent.parent);
						this.parent.execute('collide', collisionOpponent.parent);

						if (!this.checkingCollisions) break;

						collisionOpponent.onCollide(this);
						collisionOpponent.parent.onCollide(this.parent);
						collisionOpponent.parent.execute('collide', this.parent);
					}
				}
			}
		},

		onCollide: function(other) {
			this.debugColor = "#FF0000";
		},

		debug_draw: function() {
			this.debugColor = "#FFFFFF";
		},

		destroy: function() {
			this._super();

			this.collisionId = '';
			this.checkingCollisions = false;

			CollisionResolver.removeFromCollisionList(this);
		}
	});

	return CollisionComponent;

});