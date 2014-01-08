/**
 * # sound-player.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from:
 *
 * Depends of: [timer-factory](@@timer-factory@@)
 *
 * A [requireJS](http://requirejs.org/) module. For use with [Game-Builder](http://diegomarquez.github.io/game-builder)
 * 
 * The name is pretty self explanatory, use this module to play some sounds. You can load sound files,
 * play them, pause them, resume them and stop them. As an additional bonus this is also a manager
 * that will let you do all the actions described earlier in all the sounds in one method call. Pretty neat.
 *
 * The first thing to do when using this module is create some channels using the **createChannels** method,
 * this will dictate the amount of sounds that can be played simultaneously. Of course more sound channels means
 * a bigger memory foot print.
 *
 * After creating the channels, it is a matter of adding some sounds files, using the **add** method. After doing that, a call
 * to **loadAll** will trigger loading. **loadAll** has an callback that is triggered when all the specified sounds are loaded.
 *
 * During loading, no new files can be loaded. You should take that into account when using this module.
 *
 * The rest of the methods do what they say on the tin, it should be pretty easy for you, a master coder, 
 * to figure out how to use them.
 */

/**
 * Play it loud!
 * --------------------------------
 */

/**
 * --------------------------------
 */
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

	/**
	 * <p style='color:#AD071D'><strong>createChannels</strong> This will create the specified amount
	 * of channels. A channel is an instance of the <a href="http://www.w3schools.com/html/html5_audio.asp">HTML5 Audio Object</a>.
	 * Created channels are stored in an array so they can be re-used when idle.</p>
	 * @param  {Number} amount The amount of channels to create
	 * @return {null} 
	 */
	SoundPlayer.prototype.createChannels = function(amount) {
		for (var i = 0; i < amount; i++) {
			var channel = new Audio();

			timerFactory.get(channel, 'sound_' + i, 'timer');

			this.pooledChannels.push(channel);
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>add</strong> Use this method add files that should be loaded 
	 * when <strong>loadAll</strong> is called.</p>
	 * @param {String} id Use this identifier to later play the loaded sound  
	 * @param {String} path A path to a sound file. Can be relative or absolute
	 */
	SoundPlayer.prototype.add = function(id, path) {
		this.audioAssetPaths[id] = path;
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>loadAll</strong> Will load all the sounds that were added previously using <strong>add</strong>
	 * when all the loading is complete a callback is executed.</p>
	 * @param  {Function} onComplete Function to execute once all the loading is complete
	 * @throws {Error} If it is already loading files
	 * @return {null}          
	 */
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
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>playSingle</strong> Plays a sound 1 time.</p>
	 * @param  {String} id Id of the sound to play
	 * @param  {Function} onComplete This will be executed when the sound completes playing
	 * @return {null}      
	 */
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
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>playLoop</strong> Plays a sound continously, until it is stopped manually.</p>
	 * @param  {String} id Id of the sound to play
	 * @return {null}
	 */
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
	/**
	 * --------------------------------
	 */

	var pauseChannel = function(channel) {
		channel.timer.pause();
		channel.pause();
	};

	/**
	 * <p style='color:#AD071D'><strong>pause</strong> Pauses all the channels playing a sound with the given id.</p>
	 * @param  {String} id Id of the sound to pause
	 * @return {null} 
	 */
	SoundPlayer.prototype.pause = function(id) {
		for (var i = 0; i < this.activeChannels.length; i++) {
			var channel = this.activeChannels[i];

			if (channel.id == id) {
				pauseChannel(channel);
			}
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>pauseAll</strong> Pauses all sounds rgistered with the player.</p>
	 * @return {null}
	 */
	SoundPlayer.prototype.pauseAll = function() {
		for (var i = 0; i < this.activeChannels.length; i++) {
			pauseChannel(this.activeChannels[i]);
		}
	};
	/**
	 * --------------------------------
	 */

	var stopChannel = function(channel, index) {
		channel.currentTime = 0;
		channel.pause();
		channel.timer.stop();
		channel.id = 'none';

		channel.timer.hardCleanUp();

		this.pooledChannels.push(channel);
		this.activeChannels.splice(index, 1);
	};

	/**
	 * <p style='color:#AD071D'><strong>stop</strong> Stops all the channels playing a sound with the given id.</p>
	 * @param  {String} id Id of the sound to stop
	 * @return {null} 
	 */
	SoundPlayer.prototype.stop = function(id) {
		for (var i = this.activeChannels.length - 1; i >= 0; i--) {
			var channel = this.activeChannels[i];

			if (channel.id == id) {
				stopChannel.call(this, channel, i);
			}
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>stopAll</strong> Stops all sounds rgistered with the player.</p>
	 * @return {[type]} [description]
	 */
	SoundPlayer.prototype.stopAll = function() {
		for (var i = this.activeChannels.length - 1; i >= 0; i--) {
			stopChannel.call(this, this.activeChannels[i], i);
		}
	};
	/**
	 * --------------------------------
	 */

	var resumeChannel = function(channel) {
		channel.play();
		channel.timer.resume();
	};

	/**
	 * <p style='color:#AD071D'><strong>resume</strong> Resumes all the channels paused with the given id.</p>
	 * @param  {String} id Id of the sound to stop
	 * @return {null}   
	 */
	SoundPlayer.prototype.resume = function(id) {
		for (var i = 0; i < this.activeChannels.length; i++) {
			var channel = this.activeChannels[i];

			if (channel.id == id) {
				resumeChannel(channel);
			}
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>resumeAll</strong> Resumes all paused channels.</p>
	 * @return {null}
	 */
	SoundPlayer.prototype.resumeAll = function() {
		for (var i = 0; i < this.activeChannels.length; i++) {
			resumeChannel(this.activeChannels[i]);
		}
	};
	/**
	 * --------------------------------
	 */

	return new SoundPlayer();
});