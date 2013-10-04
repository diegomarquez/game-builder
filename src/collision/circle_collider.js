define(['collision_component', 'sat', 'collision_resolver', 'vector_2D', 'draw'],
	function(CollisionComponent, SAT, CollisionResolver, Vector2D, draw){

	var p = {};
	var m = null;
	
	var Component = CollisionComponent.extend({

		start: function() {
			this._super();

			this.collider 	  = new SAT.Circle(new Vector2D(0, 0), this.radius);
			this.colliderType = CollisionResolver.CIRCLE_COLLIDER;
		},
		
		update: function() {
			this.parent.getTransform(p, m);

			this.collider.pos.x = p.x;
			this.collider.pos.y = p.y;

			this._super();
		},

		draw: function(context) {
			draw.circle(context, 0, 0, this.radius, null, '#ffffff', 1);
		} 

	});

	return Component;
});