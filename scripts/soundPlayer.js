define(['timerFactory'], function(timerFactory) {
	var SoundPlayer = function() {
		this.audioTags = {};

		this.audioAssetPaths = {};

		this.pooledChannels = [];
		this.activeChannels = [];

		this.currentTime = new Date();
	};

	var setUpChannel = function(id, onMetadata) {
		if (this.pooledChannels.length == 0) {
			return;
		}

		var audio = this.audioTags[id];

		if (!audio) {
			return;
		}

		var channel = this.pooledChannels.pop();

		var onMD = function() {
			this.removeEventListener('loadedmetadata', onMD);
			onMetadata(this);
		}

		channel.addEventListener('loadedmetadata', onMD);

		channel.id = id;
		channel.src = audio.src;
		channel.time = audio.duration;

		channel.load();

		this.activeChannels.push(channel);
	}

	SoundPlayer.prototype.createChannels = function(amount) {
		for (var i = 0; i < amount; i++) {
			var channel = new Audio();

			channel.timer = timerFactory.getTimeOut();

			this.pooledChannels.push(channel);
		}
	};

	SoundPlayer.prototype.add = function(id, path) {
		this.audioAssetPaths[id] = path;
	};

	SoundPlayer.prototype.loadAll = function(onComplete) {
		var soundAssetCount = Object.keys(this.audioAssetPaths).length;

		for (var id in this.audioAssetPaths) {
			var audio = document.createElement("audio");

			audio.setAttribute("src", this.audioAssetPaths[id]);
			audio.setAttribute("preload", "auto");

			audio.addEventListener("canplaythrough", function() {
				soundAssetCount--;
				if (soundAssetCount <= 0) {
					onComplete();
				}
			});

			this.audioTags[id] = audio;

			document.body.appendChild(audio);
		}
	};

	SoundPlayer.prototype.playSingle = function(id) {
		setUpChannel.call(this, id, function(channel) {
			var callback = function() {
				channel.currentTime = 0;
				channel.pause();
				this.pooledChannels.push(channel);
				this.activeChannels.splice(this.activeChannels.indexOf(channel), 1);
			}

			channel.timer.Delay(channel.time * 1000).RepeateCount(1).Scope(this).Callback(callback).reset();

			channel.play();
		});
	};

	SoundPlayer.prototype.playLoop = function(id) {
		var channel = setUpChannel.call(this, id, function() {
			var callback = function() {
				channel.currentTime = 0;
				channel.play();
			};

			channel.timer.Delay(channel.time * 1000).RepeateCount(-1).Scope(this).Callback(callback).reset();

			channel.play();
		});

	};

	var pauseChannel = function(channel) {
		channel.timer.pause();
		channel.pause();
	}

	SoundPlayer.prototype.pause = function(id) {
		for (var i = 0; i < this.activeChannels.length; i++) {
			var channel = this.activeChannels[i];

			if (channel.id == id) {
				pauseChannel(channel);
			}
		}
	};

	SoundPlayer.prototype.pauseAll = function() {
		for (var i = 0; i < this.activeChannels.length; i++) {
			pauseChannel(this.activeChannels[i]);
		}
	};

	var stopChannel = function(channel, index) {
		channel.currentTime = 0;
		channel.pause();
		channel.timer.stop();
		channel.id = 'none';

		this.pooledChannels.push(channel);
		this.activeChannels.splice(index, 1);
	}

	SoundPlayer.prototype.stop = function(id) {
		for (var i = this.activeChannels.length - 1; i >= 0; i--) {
			var channel = this.activeChannels[i];

			if (channel.id == id) {
				stopChannel.call(this, channel, i);
			}
		}
	};

	SoundPlayer.prototype.stopAll = function() {
		for (var i = this.activeChannels.length - 1; i >= 0; i--) {
			stopChannel.call(this, this.activeChannels[i], i);
		}
	};

	var resumeChannel = function(channel) {
		channel.play();
		channel.timer.resume();
	}

	SoundPlayer.prototype.resume = function(id) {
		for (var i = 0; i < this.activeChannels.length; i++) {
			var channel = this.activeChannels[i];

			if (channel.id == id) {
				resumeChannel(channel);
			}
		}
	};

	SoundPlayer.prototype.resumeAll = function() {
		for (var i = 0; i < this.activeChannels.length; i++) {
			resumeChannel(this.activeChannels[i]);
		}
	};

	return new SoundPlayer();
});