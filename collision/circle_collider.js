define(
	[
	 'collision/collision_component', 
	 'collision/sat', 
	 'collision/collision_resolver', 
	 'vector_2D', 
	 'draw'],

	function(CollisionComponent, SAT, CollisionResolver, Vector2D, draw){
	
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
		},

		draw: function(context) {
			draw.circle(context, 0, 0, this.radius, null, '#ffffff', 1);
		} 

	});

	return Component;
});