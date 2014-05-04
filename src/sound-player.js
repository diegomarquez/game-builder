/**
 * # sound-player.js
 * ### By [Diego Enrique Marquez](http://www.treintipollo.com)
 * ### [Find me on Github](https://github.com/diegomarquez)
 *
 * Inherits from: 
 * [delegate](@@delegate@@)
 *
 * Depends of: 
 * [timer-factory](@@timer-factory@@)
 * [error-printer](@@error-printer@@)
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
 * After creating the channels, it is a matter of adding some sounds files, using the **load** method. After doing that. After
 * doing that the **playSingle** and **playLoop** methods will play sound given an id, provided the sound file has already been loaded,
 * otherwise nothing will happen.
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
define(['delegate', 'timer-factory', 'error-printer'], function(Delegate, TimerFactory, ErrorPrinter) {
	var SoundPlayer = Delegate.extend({
		/**
		 * <p style='color:#AD071D'><strong>init</strong></p>
		 *
		 * Constructor
		 */
		init: function() {
			this._super();

			this.audioTags = {};

			this.audioAssetPaths = {};
			this.pooledChannels = [];
			this.activeChannels = [];
			this.preAssignedChannels = {};

			this.currentTime = new Date();
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>createChannels</strong></p>
		 *
		 * This will create the specified amount
		 * of channels. A channel is an instance of the <a href="https://developer.mozilla.org/en-US/docs/Web/HTML/Element/audio">HTML5 Audio Object</a>.
		 * Created channels are stored in an array so they can be re-used when idle.
		 * 
		 * @param  {Number} amount The amount of channels to create 
		 */
		createChannels: function(amount) {
			for (var i = 0; i < amount; i++) {
				var channel = new Audio();

				TimerFactory.get(channel, 'sound_' + i, 'timer');

				// Shorthand methods to access the state of the timer used in each channel.
				channel.Paused = function() { return channel.timer.Paused; }
				channel.Playing = function() { return channel.timer.Running; }
				channel.Stopped = function() { return channel.timer.Stopped; }			

				this.pooledChannels.push(channel);
			}
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>getPooledCount</strong></p>
		 *
		 * @return {Number} Amount of pooled channels
		 */
		getPooledCount: function() {
			return this.pooledChannels.length;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getActiveCount</strong></p>
		 *
		 * @return {Number} Amount of active channels
		 */
		getActiveCount: function() {
			return this.activeChannels.length;
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>getAssignedCount</strong></p>
		 *
		 * @return {Number} Amount of pre assigned channels
		 */
		getAssignedCount: function() {
			var result = 0;

			for(var k in this.preAssignedChannels) {
				result += this.preAssignedChannels[k].length;
			}

			return result;
		},
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
		add: function(id, path) {
			this.audioAssetPaths[id] = path;
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>assignChannels</strong></p>
		 *
		 * Assign a number of channels that will be set apart to be used for a specific sound.
		 * Doing this avoids the need of going through the logic of changing the source attribute of an audio tag
		 * each time a sound is played.
		 * 
		 * @param  {String} id     Id of the sound that will get channels assigned
		 * @param  {Number} amount Amount of channels to set appart for the given sound
		 */
		assignChannels: function(id, amount) {
		 	var channels = this.pooledChannels.splice(0, amount);

		 	for(var i=0; i<channels.length; i++) {
				loadChannel.call(this, id, channels[i]);
		 	}

		 	if (!this.preAssignedChannels[id]) {
		 		this.preAssignedChannels[id] = [];
		 	}

		 	this.preAssignedChannels[id] = this.preAssignedChannels[id].concat(channels);

		 	this.execute(this.CHANNELS_ASSIGN, {id:id, amount:amount});
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>clearAssignedChannels</strong></p>
		 *
		 * Clear the channels asigned to a sound id. Those channels become part of the main pool again and can be used
		 * to dynamically load any other registered sound.
		 * 
		 * @param  {String} id     Id of the sound that has channels assigned
		 */
		clearAssignedChannels: function(id) {
		 	if (!this.preAssignedChannels[id]) 
		 		return;	
		 	
		 	this.pooledChannels = this.pooledChannels.concat(this.preAssignedChannels[id]);
		 	this.preAssignedChannels[id] = null;

		 	this.execute(this.CHANNELS_REVOKE, id);
		},
		/**
		 * --------------------------------
		 */

		/**
		 * <p style='color:#AD071D'><strong>loadAll</strong></p>
		 *
		 * Will load all the sounds that were added previously using <strong>add</strong>
		 * when all the loading is complete a callback is executed.
		 * 
		 * @throws {Error} If it is already loading files          
		 */
		loadAll: function() {
			if (isLoading) {
				ErrorPrinter.printError('Sound Player', 'Still loading resources. Wait till everything is complete, before loading more');
			}

			isLoading = true;

			var soundAssetCount = Object.keys(this.audioAssetPaths).length;
			var self = this;

			for (var id in this.audioAssetPaths) {
				if (this.audioTags[id]) {
					ErrorPrinter.printError('Sound Player', 'Id: ' + id + ' is already in use');
					soundAssetCount--;
					continue;
				}

				loadAudioTag.call(this, id, path, function() {
					soundAssetCount--;
					
					if (soundAssetCount <= 0) {
						self.execute(self.ON_LOAD_ALL_COMPLETE);
						isLoading = false;
					}
				});
			}
		},
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
		load: function(id, path) {
			// If an audio tag with this id already exists, do nothing.
			if (this.audioTags[id]) {
				ErrorPrinter.printError('Sound Player', 'Id: ' + id + ' is already in use');
			}

			var self = this;

			loadAudioTag.call(this, id, path, function() {
				self.execute(this.ON_LOAD_COMPLETE, id);
			});
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>playSingle</strong></p>
		 *
		 * Plays a sound 1 time.
		 * 
		 * @param  {String} id Id of the sound to play
		 */
		playSingle: function(id) {
			var self = this;

			var soundList = this.preAssignedChannels[id] ? this.preAssignedChannels[id] : this.pooledChannels;
			
			if (soundList.length == 0) return;

			var channel = getPooledChannel(soundList);

			if(this.preAssignedChannels[id]) {
				playChannelSingle.call(self, channel, soundList);
			} else {
				loadChannel.call(self, id, channel, function (channel) {
					playChannelSingle.call(self, channel, soundList);
				});
			}
		},
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
		playLoop: function(id) {
			var self = this;

			var soundList = this.preAssignedChannels[id] ? this.preAssignedChannels[id] : this.pooledChannels;
			
			if (soundList.length == 0) return;

			var channel = getPooledChannel(soundList);

			if(this.preAssignedChannels[id]) {
				playChannelLoop.call(self, channel);
			} else {
				loadChannel.call(self, id, channel, function (channel) {
					playChannelLoop.call(self, channel);
				});
			}
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>pause</strong></p>
		 *
		 * Pauses all the channels playing a sound with the given id.
		 * 
		 * @param  {String} id Id of the sound to pause 
		 */
		 pause: function(id) {
			for (var i = 0; i < this.activeChannels.length; i++) {
				var channel = this.activeChannels[i];

				if (channel.id == id) {
					pauseChannel.call(this, channel);
				}
			}
		 },
		 /**
		  * --------------------------------
		  */
		 
		 /**
		 * <p style='color:#AD071D'><strong>stop</strong></p>
		 *
		 * Stops all the channels playing a sound with the given id.
		 * 
		 * @param  {String} id Id of the sound to stop 
		 */
		stop: function(id) {
			for (var i = this.activeChannels.length - 1; i >= 0; i--) {
				var channel = this.activeChannels[i];

				if (channel.id == id) {
					stopChannel.call(this, channel, i);
				}
			}
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>resume</strong></p>
		 *
		 * Resumes all the channels paused with the given id.
		 * 
		 * @param  {String} id Id of the sound to stop   
		 */
		resume: function(id) {
			for (var i = 0; i < this.activeChannels.length; i++) {
				var channel = this.activeChannels[i];

				if (channel.id == id) {
					resumeChannel.call(this, channel);
				}
			}
		},
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
		pauseAll: function() {
			return bulkControl.call(this, pauseChannel);
		},
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
		stopAll: function() {
			return bulkControl.call(this, stopChannel);
		},
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
		resumeAll: function() {
			return bulkControl.call(this, resumeChannel);
		},
		/**
		 * --------------------------------
		 */

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
		setPropertyToAll: function(property, value) {
			return bulkControl.call(this, setProperty, property, value);
		},
		/**
		 * --------------------------------
		 */
	});

	// ### Getters for all the types of events the sound player can hook into
	Object.defineProperty(SoundPlayer.prototype, "ON_LOAD_ALL_COMPLETE", { get: function() { return 'load_all_complete'; } });
	Object.defineProperty(SoundPlayer.prototype, "ON_LOAD_COMPLETE", { get: function() { return 'load_complete'; } });
	Object.defineProperty(SoundPlayer.prototype, "CHANNELS_ASSIGN", { get: function() { return 'channel_assign'; } }); 
	Object.defineProperty(SoundPlayer.prototype, "CHANNELS_REVOKE", { get: function() { return 'channel_revoke'; } }); 
	Object.defineProperty(SoundPlayer.prototype, "SINGLE_COMPLETE", { get: function() { return 'single_complete'; } });
	Object.defineProperty(SoundPlayer.prototype, "PLAY_SINGLE", { get: function() { return 'play_single'; } });
	Object.defineProperty(SoundPlayer.prototype, "PLAY_LOOP", { get: function() { return 'play_loop'; } });
	Object.defineProperty(SoundPlayer.prototype, "PAUSE", { get: function() { return 'pause'; } });
	Object.defineProperty(SoundPlayer.prototype, "RESUME", { get: function() { return 'resume'; } });
	Object.defineProperty(SoundPlayer.prototype, "STOP", { get: function() { return 'stop'; } });
	/**
	 * --------------------------------
	 */

	var isLoading = false;

	var getPooledChannel = function(fromList) {
		if (fromList.length == 0) return;
		return fromList.pop();
	};

	var loadAudioTag = function(path, id, onComplete) {
		var audio = document.createElement("audio");

		audio.setAttribute("src", path);
		audio.setAttribute("preload", "auto");

		audio.addEventListener("canplaythrough", onComplete);

		this.audioTags[id] = audio;

		document.body.appendChild(audio);
	};

	var loadChannel = function(id, channel, onReady) {
		var audio = this.audioTags[id];

		if (!audio) return;

		var load = function() {
			var onMD = function() {
				this.removeEventListener('loadedmetadata', onMD);

				if (onReady) {
					onReady(this);
				}
			}

			channel.addEventListener('loadedmetadata', onMD);

			channel.id = id;
			channel.src = audio.src;
			channel.time = audio.duration;

			channel.load();
		}

		if (audio.readyState != 4) {
			audio.addEventListener('canplaythrough', load);
		} else {
			load();
		}
	};

	var playChannelSingle = function(channel, originList) {
		var self = this;

		self.activeChannels.push(channel);

		channel.timer.on('complete', function() {
			channel.currentTime = 0;
			channel.pause();

			originList.push(channel);
			self.activeChannels.splice(self.activeChannels.indexOf(channel), 1);

			self.execute(self.SINGLE_COMPLETE, channel.id);
		}, true);

		channel.timer
			.Delay(channel.time * 1000)
			.RepeateCount(1)
			.RemoveOnComplete(false)
			.reset();

		self.execute(self.PLAY_SINGLE, channel.id);

		channel.play();
	};

	var playChannelLoop = function(channel) {
		var self = this;

		self.activeChannels.push(channel);

		channel.timer.on('repeate', function() {
			channel.currentTime = 0;
			channel.play();

			self.execute(self.PLAY_LOOP, channel.id);
		});

		channel.timer
			.Delay(channel.time * 1000)
			.RepeateCount(-1)
			.RemoveOnComplete(false)
			.reset();

		self.execute(self.PLAY_LOOP, channel.id);

		channel.play();
	};

	// This object is returned by the **pauseAll**, **stopAll** and **resumeAll** 
	// methods and is used to determine to which channels the specified action whould be applied.
	var bulkControl = function(method) {
		var channel = null;

		var args = Array.prototype.slice.call(arguments).splice(1)
		var self = this;

		return {
			// The callback function is executed for each active channel
			// If it returns true the action is applied. The callback receives a channel as argument
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
	};

	var setProperty = function(channel, index, args) {
		channel[args[0]] = args[1];
	}

	var pauseChannel = function(channel) {
		channel.timer.pause();
		channel.pause();

		this.execute(this.PAUSE);
	};
	
	var stopChannel = function(channel, index) {
		if(this.preAssignedChannels[channel.id]) {
			this.preAssignedChannels[channel.id].push(channel);
		} else {
			this.pooledChannels.push(channel);
		}

		this.activeChannels.splice(index, 1);

		channel.currentTime = 0;
		channel.pause();
		channel.timer.stop();
		channel.id = 'none';

		channel.timer.hardCleanUp();

		this.execute(this.STOP);
	};

	var resumeChannel = function(channel) {
		channel.play();
		channel.timer.resume();

		this.execute(this.RESUME);
	};	

	return new SoundPlayer();
});