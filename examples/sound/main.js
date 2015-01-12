/**
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Depends of:
 * [gb](@@gb@@),
 * [game](@@game@@),
 * [sound-player](@@sound-player@@),
 * [sound-control](@@sound-control@@),
 * [activity-display](@@activity-display@@),
 * [prevent-keys-default](@@prevent-keys-default@@),
 * [keyboard](@@keyboard@@)
 */

/**
 * --------------------------------
 */
define(function(require){
	var gb = require('gb');
	
	var game = gb.game;
	var assetMap = gb.assetMap();

	var sound_player = require('sound-player');
	var keyboard = require('keyboard');

	game.add_extension(require("sound-control"));
	game.add_extension(require("activity-display"));
	game.add_extension(require("prevent-keys-default"));


	// This is the main initialization function
	game.on(game.CREATE, this, function() {
		console.log("Welcome to Game-Builder!");

		// This sets the amount of different channels that can be played at the same time
		sound_player.createChannels(4);

		// Load a sound resources, as soon as they are loaded they can be played.
		sound_player.load('BIRD_SOUND', assetMap['BIRD.MP3']);
		sound_player.load('HORSE_SOUND', assetMap['HORSE.MP3']);
		sound_player.load('SHEEP_SOUND', assetMap['SHEEP.MP3']);
		sound_player.load('ELEVATOR_MUSIC', assetMap['ELEVATOR.MP3']);
		sound_player.load('CROW_SOUND', assetMap['CROW.WAV']);

		// Out of the channels created, this line sets apart 2 channels to be used by the sound with id BIRD_SOUND
		// Playing sound like this is slightly faster because the logic of loading a sound is skipped.
		sound_player.assignChannels('BIRD_SOUND', 2);		

		keyboard.onKeyDown(keyboard.A, this, function() {
			sound_player.playSingle('BIRD_SOUND', function(id) {
				console.log('Sound complete. Id: ' + id);
			});
		});

		keyboard.onKeyDown(keyboard.S, this, function() {
			sound_player.playSingle('HORSE_SOUND', function(id) {
				console.log('Sound complete. Id: ' + id);
			});
		});

		keyboard.onKeyDown(keyboard.D, this, function() {
			sound_player.playSingle('SHEEP_SOUND', function(id) {
				console.log('Sound complete. Id: ' + id);
			});
		});	

		keyboard.onKeyDown(keyboard.C, this, function() {
			sound_player.playSingle('CROW_SOUND', function(id) {
				console.log('Sound complete. Id: ' + id);
			});
		});

		keyboard.onKeyDown(keyboard.Z, this, function() {
			sound_player.playLoop('ELEVATOR_MUSIC');
		});

		keyboard.onKeyDown(keyboard.X, this, function() {
			sound_player.stopAll().now();
		});

		var soundPaused = false;
		keyboard.onKeyDown(keyboard.P, this, function() {
			soundPaused ? sound_player.resumeAll().now() : sound_player.pauseAll().now();
			soundPaused = !soundPaused;
		});
	});

	// This is called when the canvas looses focus
	game.on(game.BLUR, this, function() {
		console.log("sound has lost focus");
	});

	// This is called when the canvas regains focus
	game.on(game.FOCUS, this, function() {
		console.log("sound has regained focus");
	});

	// This is the main update loop
	game.on(game.UPDATE, this, function() {
		// Do stuff here that needs constant updating
		
		// this.delta => Time delta between updates
		// this.context => 2D Context where stuff is drawn
	});

	// This is the main setup that kicks off the whole thing
	game.create();
});
