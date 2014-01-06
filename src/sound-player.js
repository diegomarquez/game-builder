define(['timer-factory'], function(timerFactory) {
	var isLoading = false;

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

		this.activeChannels.push(channel);

		var onMD = function() {
			this.removeEventListener('loadedmetadata', onMD);
			onMetadata(this);
		}

		channel.addEventListener('loadedmetadata', onMD);

		channel.id = id;
		channel.src = audio.src;
		channel.time = audio.duration;

		channel.load();
	}

	SoundPlayer.prototype.createChannels = function(amount) {
		for (var i = 0; i < amount; i++) {
			var channel = new Audio();

			timerFactory.get(channel, 'sound_' + i, 'timer');

			this.pooledChannels.push(channel);
		}
	};

	SoundPlayer.prototype.add = function(id, path) {
		this.audioAssetPaths[id] = path;
	};

	SoundPlayer.prototype.loadAll = function(onComplete) {
		if (isLoading) {
			throw new Error('Sound Player: Still loading resources. Wait till everything is complete, before loading more.')
			return;
		}

		isLoading = true;

		var soundAssetCount = Object.keys(this.audioAssetPaths).length;

		for (var id in this.audioAssetPaths) {
			if (this.audioTags[id]) {
				soundAssetCount--;
				continue;
			}

			var audio = document.createElement("audio");

			audio.setAttribute("src", this.audioAssetPaths[id]);
			audio.setAttribute("preload", "auto");

			audio.addEventListener("canplaythrough", function() {
				soundAssetCount--;
				if (soundAssetCount <= 0) {
					onComplete();

					isLoading = false;
				}
			});

			this.audioTags[id] = audio;

			document.body.appendChild(audio);
		}
	};

	SoundPlayer.prototype.playSingle = function(id, onComplete) {
		var self = this;

		setUpChannel.call(this, id, function(channel) {
			channel.timer.on('complete', function() {
				channel.currentTime = 0;
				channel.pause();
				
				self.pooledChannels.push(channel);
				self.activeChannels.splice(self.activeChannels.indexOf(channel), 1);

				if(onComplete) {
					onComplete(id);
				}
			}, true);

			channel.timer
				.Delay(channel.time * 1000)
				.RepeateCount(1)
				.RemoveOnComplete(false)
				.reset();

			channel.play();
		});
	};

	SoundPlayer.prototype.playLoop = function(id) {
		setUpChannel.call(this, id, function(channel) {
			channel.timer.on('repeate', function() {
				channel.currentTime = 0;
				channel.play();
			});

			channel.timer
				.Delay(channel.time * 1000)
				.RepeateCount(-1)
				.RemoveOnComplete(false)
				.reset();

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

		channel.timer.hardCleanUp();

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