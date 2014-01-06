define(["layers", "gb", "class"], function(Layers, Gb) {
	var Extension = Class.extend({
		type: function() {
			return Gb.game.CREATE;
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

    		Gb.game.mainContainer.style.top  		= '50%';
    		Gb.game.mainContainer.style.left 		= '50%';
			Gb.game.mainContainer.style.marginLeft = '-' + Gb.game.canvas.width/2 + 'px';
			Gb.game.mainContainer.style.marginTop  = '-' + Gb.game.canvas.height/2 + 'px';
			Gb.game.mainContainer.style.position   = 'fixed';

			Gb.game.canvas.style.paddingLeft  = 0;
    		Gb.game.canvas.style.paddingRight = 0;
    		Gb.game.canvas.style.marginLeft   = 'auto';
    		Gb.game.canvas.style.marginRight  = 'auto';

			resize(Gb.game.mainContainer, Gb.game.canvas);

			window.addEventListener('resize', function() { 
				resize(Gb.game.mainContainer, Gb.game.canvas); 
			}, false);			
		}
	});

	return Extension;
});