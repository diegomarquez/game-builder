define(["game", "class"], function(Game) {
	var Extension = Class.extend({
		type: function() {
			return 'create';
		},

		execute: function() {
			var resize = function(container, canvas) {
				var scale = { x: 1, y: 1};

				scale.x = (window.innerWidth - 5) / canvas.width;
				scale.y = (window.innerHeight - 5) / canvas.height;

				if (scale.x < scale.y) {
					scale = scale.x + ', ' + scale.x;
				} else {
					scale = scale.y + ', ' + scale.y;
				}

				container.style.webkitTransform = 'scale(' + scale + ')';
				container.style.mozTransform    = 'scale(' + scale + ')';
				container.style.msTransform     = 'scale(' + scale + ')';
				container.style.oTransform      = 'scale(' + scale + ')';
			};

    		Game.mainContainer.style.top  		= '50%';
    		Game.mainContainer.style.left 		= '50%';
			Game.mainContainer.style.marginLeft = '-' + Game.canvas.width/2 + 'px';
			Game.mainContainer.style.marginTop  = '-' + Game.canvas.height/2 + 'px';
			Game.mainContainer.style.position   = 'fixed';

			Game.canvas.style.paddingLeft  = 0;
    		Game.canvas.style.paddingRight = 0;
    		Game.canvas.style.marginLeft   = 'auto';
    		Game.canvas.style.marginRight  = 'auto';

			resize(Game.mainContainer, Game.canvas);

			window.addEventListener('resize', function() { 
				resize(Game.mainContainer, Game.canvas); 
			}, false);			
		}
	});

	return Extension;
});