define(['collision/collision_component', 'collision/sat', 'collision/collision_resolver', 'vector_2D'], function(CollisionComponent, SAT, CollisionResolver, Vector2D){

	var Component = CollisionComponent.extend({
		start: function() {
			this._super();

			this.collider = new SAT.Polygon(new Vector2D(0,0), this.points);
			this.colliderType = CollisionResolver.POLYGON_COLLIDER;
		},

		update: function() {
			//TODO: Esto no va a funcionar
			this.collider.pos.x = this.parent.x + this.parent.centerX;
			this.collider.pos.y = this.parent.y + this.parent.centerY;

			this._super();
		}
	});
});