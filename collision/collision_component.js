define(['component', 'collision_resolver'], function(Component, CollisionResolver) {

	var collisionList = null;
	var collisionOpponent = null;

	var CollisionComponent = Component.extend({
		init: function() {
			this._super();

			this.collisionId = '';
			this.colliderType = null;
			this.checkingCollisions = true;
		}

		start: function() {
			this.collisionId = this.args.id;
			this.checkingCollisions = true;

			CollisionResolver.addToCollisionList(this);
		},

		getColliderType: function() {},

		getCollider: function() {},

		update: function() {
			collisionList = CollisionResolver.collisionLists[this.getCollisionId()];

			if (collisionList != null) {
				for (k = 0; k < collisionList.length; k++) {
					collisionOpponent = collisionList[k];

					if (!collisionOpponent.checkingCollisions) break;

					if (CollisionResolver.areColliding(this, collisionOpponent)) {
						if (!this.checkingCollisions) break;

						if(!this.parent.onCollide)
							throw new Error("GameObject with typeId: " + this.parent.typeId + ", has collider component but does not define an onCollide method, yo.");
						
						this.parent.onCollide(collisionOpponent.parent);
						this.parent.execute('collide', collisionOpponent.parent)

						if (!this.checkingCollisions) break;

						if(!collisionOpponent.parent.onCollide)
							throw new Error("GameObject with typeId: " + collisionOpponent.parent.typeId + ", has collider component but does not define an onCollide method, yo.");

						collisionOpponent.parent.onCollide(this.parent);
						collisionOpponent.parent.execute('collide', this.parent)
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