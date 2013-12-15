define(['collision_component', 'sat', 'collision_resolver', 'vector_2D', 'draw'],
	function(CollisionComponent, SAT, CollisionResolver, Vector2D, draw) {

		var p = {};
		var m = null;

		var Component = CollisionComponent.extend({
			start: function() {
				this._super();

				this.pointCount = this.points.length;
				this.pointsCopy = JSON.parse(JSON.stringify(this.points));

				this.collider = new SAT.FixedSizePolygon(new Vector2D(0, 0), this.points);
				this.colliderType = CollisionResolver.POLYGON_COLLIDER;
			},

			update: function() {
				m = this.parent.getMatrix(m);

				for(var i=0; i<this.pointCount; i++) {
					p = m.transformPoint(this.pointsCopy[i].x, this.pointsCopy[i].y, p);

					this.collider.points[i].x = p.x;
					this.collider.points[i].y = p.y;	
				}

				this.collider.recalc();

				this._super();
			},

			draw: function(context) {
				draw.polygon(context, 0, 0, this.pointsCopy, null, this.debugColor, 2);

				this._super();
			}
		});

		return Component;
	}
);