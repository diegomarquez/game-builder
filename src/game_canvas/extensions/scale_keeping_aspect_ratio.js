define(["game", "class"], function(Game) {
	var GameLoopExtension = Class.extend({
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
				container.style.mozTransform = 'scale(' + scale + ')';
				container.style.msTransform = 'scale(' + scale + ')';
				container.style.oTransform = 'scale(' + scale + ')';
			};

			resize(Game.mainContainer, Game.canvas);

			window.addEventListener('resize', function() { 
				resize(Game.mainContainer, Game.canvas); 
			}, false);			
		}
	});

	return GameLoopExtension;
});