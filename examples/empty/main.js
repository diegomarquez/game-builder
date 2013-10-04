define(function() {
		var main = function(){};

		main.prototype.start = function(game, assembler, game_object_pool, component_pool, layers) {
			//When this is called we are good to go!
			game.on("init", this, function() {
				console.log("Hi!")
			});
		}

		return new main()
	}
);