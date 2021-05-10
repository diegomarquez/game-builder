define(function() {
	var Data = function() {};

	var data = {
	"80343865.JPG": "../common_assets/images/80343865.jpg",
	"BIRD.MP3": "../common_assets/sound/bird.mp3",
	"CROW.WAV": "../common_assets/sound/crow.wav",
	"ELEVATOR.MP3": "../common_assets/sound/elevator.mp3",
	"HORSE.MP3": "../common_assets/sound/horse.mp3",
	"SHEEP.MP3": "../common_assets/sound/sheep.mp3",
	"AUDIO-SAMPLE.MP3": "../../game-builder/assets/audio-sample.mp3",
	"AUDIO-SAMPLE.OGG": "../../game-builder/assets/audio-sample.ogg"
};

	Data.prototype.get = function() {
		return data;
	}

	return new Data();
});