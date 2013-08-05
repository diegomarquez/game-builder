define(['collision_component', 'sat', 'vector2D'], function(CollisionComponent, SAT, Vector2D){
	var Component = CollisionComponent.extend({

		start: function() {
			this._super();
			
			this.collider 	  = new SAT.Circle(new Vector2D(0, 0), this.radius);
			this.colliderType = CollisionResolver.CIRCLE_COLLIDER;
		},
		
		update: function() {
			this.collider.pos.x = this.parent.x + this.parent.centerX;
			this.collider.pos.y = this.parent.y + this.parent.centerY;

			this._super();
		}

	});

	return Component;
});