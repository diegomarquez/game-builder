define(['component', 'collision/collision_resolver'], function(Component, CollisionResolver) {

	var collisionList = null;
	var collisionOpponent = null;

	var CollisionComponent = Component.extend({

		start: function() {
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
		
						this.parent.onCollide(collisionOpponent.parent);
						this.parent.execute('collide', collisionOpponent.parent);

						if (!this.checkingCollisions) break;

						collisionOpponent.parent.onCollide(this.parent);
						collisionOpponent.parent.execute('collide', this.parent);
					}
				}
			}
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