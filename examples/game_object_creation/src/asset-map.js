define(function() {
	var Data = function() {};

	var data = {
	"80343865.JPG": "../common_assets/images/80343865.jpg",
	"BIRD.MP3": "../common_assets/sound/bird.mp3",
	"CROW.WAV": "../common_assets/sound/crow.wav",
	"ELEVATOR.MP3": "../common_assets/sound/elevator.mp3",
	"HORSE.MP3": "../common_assets/sound/horse.mp3",
	"SHEEP.MP3": "../common_assets/sound/sheep.mp3",
	"TEST.JPG": "assets/images/test.jpg",
	"TEST.MP3": "assets/sound/test.mp3",
	"TEST.WAV": "assets/sound/test.wav",
	"TEST2.MP3": "assets/sound/test2.mp3",
	"TEST3.MP3": "assets/sound/test3.mp3",
	"TEST4.MP3": "assets/sound/test4.mp3"
};

	Data.prototype.get = function() {
		return data;
	}

	return new Data();
});