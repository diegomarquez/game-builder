//This example is about the sound_player module. it plays sound.

define(function(require) {
	var main = function() {
		gjs.game.on("init", this, function() {
			var sound_player = require('sound_player');
			var keyboard = require('keyboard');

			//This sets the amount of different channels that can be played at the same time
			sound_player.createChannels(4);

			//Add the sound resources that will be available
			sound_player.add('Sound_1', '../resources/bird.mp3');
			sound_player.add('Sound_2', '../resources/horse.mp3');
			sound_player.add('Sound_3', '../resources/sheep.wav');
			sound_player.add('Sound_4', '../resources/elevator.mp3');

			//Call loadAll to load all the resources, the callback gets executed once everything is loaded.
			
			//Note: This method can not be called again until
			//it has completed downloading all previous resources.
			sound_player.loadAll(function() {
				console.log('Sound load complete')

				keyboard.onKeyDown(keyboard.A, this, function() {
					sound_player.playSingle('Sound_1', function(id) {
						console.log('Sound complete. Id: ' + id);
					});
				});

				keyboard.onKeyDown(keyboard.S, this, function() {
					sound_player.playSingle('Sound_2', function(id) {
						console.log('Sound complete. Id: ' + id);
					});
				});

				keyboard.onKeyDown(keyboard.D, this, function() {
					sound_player.playSingle('Sound_3', function(id) {
						console.log('Sound complete. Id: ' + id);
					});
				});	

				keyboard.onKeyDown(keyboard.Z, this, function() {
					sound_player.playLoop('Sound_4');
				});

				keyboard.onKeyDown(keyboard.X, this, function() {
					sound_player.stopAll();
				});
			});
		});
	};

	return new main()
});