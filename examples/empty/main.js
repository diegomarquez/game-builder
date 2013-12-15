define(function() {
		var main = function(){
			//When this is called we are good to go!
			gjs.game.on("init", this, function() {
				console.log("Hi!")
			});
		}

		return new main();
	}
);