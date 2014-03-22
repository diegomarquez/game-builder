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
		var audio = this.audioTags[id];

		if (this.pooledChannels.length == 0) { return; }
		
		if (!audio) { return; }

		if (audio.readyState != 4) { return; }

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
	 * <p style='color:#AD071D'><strong>createChannels</strong></p>
	 *
	 * This will create the specified amount
	 * of channels. A channel is an instance of the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio">HTML5 Audio Object</a>.
	 * Created channels are stored in an array so they can be re-used when idle.
	 * 
	 * @param  {Number} amount The amount of channels to create 
	 */
	SoundPlayer.prototype.createChannels = function(amount) {
		for (var i = 0; i < amount; i++) {
			var channel = new Audio();

			timerFactory.get(channel, 'sound_' + i, 'timer');

			// Shorthand methods to access the state of the timer used in each channel.
			channel.Paused = function() { return channel.timer.Paused; }
			channel.Playing = function() { return channel.timer.Running; }
			channel.Stopped = function() { return channel.timer.Stopped; }			

			this.pooledChannels.push(channel);
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>add</strong></p>
	 *
	 * Use this method to files that should be loaded 
	 * when <strong>loadAll</strong> is called.
	 * 
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
	 * <p style='color:#AD071D'><strong>loadAll</strong></p>
	 *
	 * Will load all the sounds that were added previously using <strong>add</strong>
	 * when all the loading is complete a callback is executed.
	 * 
	 * @param  {Function} onComplete Function to execute once all the loading is complete
	 * @throws {Error} If it is already loading files          
	 */
	SoundPlayer.prototype.loadAll = function(onComplete) {
		if (isLoading) {
			throw new Error('Sound Player: Still loading resources. Wait till everything is complete, before loading more.');
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
	 * <p style='color:#AD071D'><strong>load</strong></p>
	 *
	 * Starts loading a sound file into an audio tag.
	 * 
	 * @param {String} id Use this identifier to later play the loaded sound  
	 * @param {String} path A path to a sound file. Can be relative or absolute
	 * @throws {Error} If the id sent is already in use.
	 */
	SoundPlayer.prototype.load = function(id, path) {
		// If an audio tag with this id already exists, do nothing.
		if (this.audioTags[id]) {
			throw new Error('Sound Player: Id is already in use.');
		}

		var audio = document.createElement("audio");

		audio.setAttribute("src", path);
		audio.setAttribute("preload", "auto");

		this.audioTags[id] = audio;

		document.body.appendChild(audio);
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>playSingle</strong></p>
	 *
	 * Plays a sound 1 time.
	 * 
	 * @param  {String} id Id of the sound to play
	 * @param  {Function} onComplete This will be executed when the sound completes playing      
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
	 * <p style='color:#AD071D'><strong>playLoop</strong></p>
	 *
	 * Plays a sound continuosly, until it is stopped manually.
	 * 
	 * @param  {String} id Id of the sound to play
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

	var setProperty = function(channel, index, args) {
		channel[args[0]] = args[1];
	}

	/**
	 * <p style='color:#AD071D'><strong>setProperty</strong></p>
	 *
	 * Use this method to add or set a property in all or a subset of the active channels
	 *
	 * @param {String} [property] Name of the property
	 * @param {Any} [value] Value of the property to add or set
	 * 
	 * @return {Object} A control object with methods to determine which sounds should be paused
	 */
	SoundPlayer.prototype.setPropertyToAll = function(property, value) {
		return bulkControl.call(this, setProperty, property, value);
	}
	/**
	 * --------------------------------
	 */

	var pauseChannel = function(channel) {
		channel.timer.pause();
		channel.pause();
	};

	/**
	 * <p style='color:#AD071D'><strong>pause</strong></p>
	 *
	 * Pauses all the channels playing a sound with the given id.
	 * 
	 * @param  {String} id Id of the sound to pause 
	 */
	SoundPlayer.prototype.pause = function(id) {
		for (var i = 0; i < this.activeChannels.length; i++) {
			var channel = this.activeChannels[i];

			if (channel.id == id) {
				pauseChannel.call(this, channel);
			}
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>pauseAll</strong></p>
	 *
	 * Pauses all playing channels registered with the player.
	 *
	 * @return {Object} A control object with methods to determine which sounds should be paused
	 */
	SoundPlayer.prototype.pauseAll = function() {
		return bulkControl.call(this, pauseChannel);
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
	 * <p style='color:#AD071D'><strong>stop</strong></p>
	 *
	 * Stops all the channels playing a sound with the given id.
	 * 
	 * @param  {String} id Id of the sound to stop 
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
	 * <p style='color:#AD071D'><strong>stopAll</strong></p>
	 *
	 * Stops all channels registered with the player.
	 *
	 * @return {Object} A control object with methods to determine which sounds should be stopped
	 */
	SoundPlayer.prototype.stopAll = function() {
		return bulkControl.call(this, stopChannel);
	};
	/**
	 * --------------------------------
	 */

	var resumeChannel = function(channel) {
		channel.play();
		channel.timer.resume();
	};

	/**
	 * <p style='color:#AD071D'><strong>resume</strong></p>
	 *
	 * Resumes all the channels paused with the given id.
	 * 
	 * @param  {String} id Id of the sound to stop   
	 */
	SoundPlayer.prototype.resume = function(id) {
		for (var i = 0; i < this.activeChannels.length; i++) {
			var channel = this.activeChannels[i];

			if (channel.id == id) {
				resumeChannel.call(this, channel);
			}
		}
	};
	/**
	 * --------------------------------
	 */

	/**
	 * <p style='color:#AD071D'><strong>resumeAll</strong></p>
	 *
	 * Resumes all paused channels.
	 *
	 * @return {Object} A control object with methods to determine which sounds should be resumed
	 */
	SoundPlayer.prototype.resumeAll = function() {
		return bulkControl.call(this, resumeChannel);
	};
	/**
	 * --------------------------------
	 */
	
	// This object is returned by the **pauseAll**, **stopAll** and **resumeAll** 
	// methods and is used to determine to which channels the specified action whould be applied.
	var bulkControl = function(method) {
		var channel = null;

		var args = Array.prototype.slice.call(arguments).splice(1)
		var self = this;

		return {
			// The callback function is executed for each active channel
			// If it return true the action is applied. The callback received a channel as argument
			which: function(func) {
				for (var i = self.activeChannels.length-1; i >=0 ; i--) {
					channel = self.activeChannels[i];

					if(func(channel)) {
						method.call(self, channel, i, args);
					}
				}
			},

			// Use this method to execute the specified action in all the active channels
			now: function() {
				for (var i = self.activeChannels.length-1; i >=0 ; i--) {
					channel = self.activeChannels[i];
					method.call(self, channel, i, args);
				}
			}
		}
	}

	return new SoundPlayer();
});