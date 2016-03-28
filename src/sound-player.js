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
 * After creating the channels, it is a matter of adding some sounds files, using the **load** method. After
 * doing that the **playSingle** and **playLoop** methods will play sound given an id, provided the sound file has already been loaded,
 * otherwise nothing will happen.
 * 
 * The rest of the methods do what they say on the tin
 *
 * The Sound Player object extends [delegate](@@delegate@@) so it provides a few events to hook into:
 *
 * ### **ON_LOAD_ALL_COMPLETE**
 * When loading of resources through the **loadAll** method is complete. 
 *
 * ``` javascript  
 * soundPlayer.on(soundPlayer.ON_LOAD_ALL_COMPLETE, function() {});
 * ```
 * </br>
 * 
 * ### **ON_LOAD_COMPLETE** 
 * When the loading of a single resource is complete. 
 *
 * ``` javascript  
 * soundPlayer.on(soundPlayer.ON_LOAD_COMPLETE, function(soundId) {});
 * ```
 * </br>
 *
 * ### **CHANNELS_ASSIGN** 
 * When channels are assigned to a specific sound 
 *
 * ``` javascript  
 * soundPlayer.on(soundPlayer.CHANNELS_ASSIGN, function(data) {
 * 	// Sound Id
 * 		data.id
 * 	// Amount of assigned channels
 * 		data.amount
 * });
 * ```
 *
 * </br>
 * 
 * ### **CHANNELS_REVOKE** 
 * When dedicated channels are removed from a sound
 *
 * ``` javascript  
 * soundPlayer.on(soundPlayer.CHANNELS_REVOKE, function(soundId) {});
 * ```
 *
 * </br>
 *
 * ### **SINGLE_COMPLETE** 
 * When a **playSingle** call finished playing it's sound
 *
 * ``` javascript  
 * soundPlayer.on(soundPlayer.SINGLE_COMPLETE, function(soundId) {});
 * ```
 * 
 * </br>
 *
 * ### **PLAY_SINGLE** 
 * When a **playSingle** call starts playback
 *
 * ``` javascript  
 * soundPlayer.on(soundPlayer.PLAY_SINGLE, function(soundId) {});
 * ```
 *
 * </br>
 *
 * ### **PLAY_LOOP** 
 * When a **playLoop** call starts playback
 *
 * ``` javascript  
 * soundPlayer.on(soundPlayer.PLAY_LOOP, function(soundId) {});
 * ```
 *
 * </br>
 *
 * ### **PAUSE** 
 * When a sound is paused 
 *
 * ``` javascript  
 * soundPlayer.on(soundPlayer.PAUSE, function(soundId) {});
 * ```
 *
 * </br>
 *
 * ### **RESUME** 
 * When a sound is resumed
 *
 * ``` javascript  
 * soundPlayer.on(soundPlayer.RESUME, function(soundId) {});
 * ```
 *
 * </br>
 *
 * ### **STOP** 
 * When a sound is stopped 
 *
 * ``` javascript  
 * soundPlayer.on(soundPlayer.STOP, function(soundId) {});
 * ```
 *
 * </br>
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

			this.isLoading = false;
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
				channel.Paused = function() { 
					return this.timer.Paused; 
				}
				
				channel.Playing = function() { 
					return this.timer.Running; 
				}

				channel.Stopped = function() { 
					return this.timer.Stopped; 
				}

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
				this.loadChannel(id, channels[i]);
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
			if (this.isLoading) {
				ErrorPrinter.printError('Sound Player', 'Still loading resources. Wait till everything is complete, before loading more');
			}

			this.isLoading = true;

			var soundAssetCount = Object.keys(this.audioAssetPaths).length;

			for (var id in this.audioAssetPaths) {
				if (this.audioTags[id]) {
					ErrorPrinter.printError('Sound Player', 'Id: ' + id + ' is already in use');
					soundAssetCount--;
					continue;
				}
			
				this.loadAudioTag(id, path, function() {
					soundAssetCount--;
				
					if (soundAssetCount <= 0) {
						this.execute(this.ON_LOAD_ALL_COMPLETE);
						this.isLoading = false;
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

			this.loadAudioTag(id, path, function() {
				this.execute(this.ON_LOAD_COMPLETE, id);
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
			var soundList = this.preAssignedChannels[id] ? this.preAssignedChannels[id] : this.pooledChannels;
			
			if (soundList.length == 0) return;

			var channel = this.getPooledChannel(soundList);

			if(this.preAssignedChannels[id]) {
				this.playChannelSingle(id, channel);
			} else {
				this.loadChannel(id, channel, function (channel) {
					this.playChannelSingle(id, channel);
				}.bind(this));
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
			var soundList = this.preAssignedChannels[id] ? this.preAssignedChannels[id] : this.pooledChannels;
			
			if (soundList.length == 0) return;

			var channel = this.getPooledChannel(soundList);

			if(this.preAssignedChannels[id]) {
				this.playChannelLoop(channel, soundList);
			} else {
				this.loadChannel(id, channel, function (channel) {
					this.playChannelLoop(channel, soundList);
				}.bind(this));
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
		
		/**
		 * <p style='color:#AD071D'><strong>getPooledChannel</strong></p>
		 *
		 * Get a pooled audio instance.
		 * 
		 * @param  {Array} fromList The list to get a channel from
		 *
		 * @return {Audio} The pooled channel
		 */
		getPooledChannel: function(fromList) {
			if (fromList.length == 0)
				return;
			
			return fromList.pop();
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>loadAudioTag</strong></p>
		 *
		 * Create an audio tag to load a sound resource into
		 * 
		 * @param  {String} id Used to identify the resource later
		 * @param  {String} path Path to the resource
		 * @param  {Function} onComplete On complete callback
		 */
		loadAudioTag: function(id, path, onComplete) {
			var audio = document.createElement("audio");

			audio.setAttribute("src", path);
			audio.setAttribute("preload", "auto");

			audio.addEventListener("canplaythrough", function() {
				onComplete.call(this)
			}.bind(this));

			this.audioTags[id] = audio;

			document.body.appendChild(audio);
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>loadChannel</strong></p>
		 *
		 * Update the source of a pooled channel
		 * 
		 * @param  {String} id Id of the sound resource to load into the provided channel
		 * @param  {Audio} channel Channel to update
		 * @param  {Function} onReady On complete callback
		 */
		loadChannel: function(id, channel, onReady) {
			var audio = this.audioTags[id];

			if (!audio) return;

			channel.loaded = false;

			var onMD = function() {
				this.removeEventListener('loadedmetadata', onMD);

				this.loaded = true;

				if (onReady) {
					onReady(this);
				}
			}.bind(channel);

			var load = function() {
				this.addEventListener('loadedmetadata', onMD);

				this.id = id;
				this.src = audio.src;
				this.time = audio.duration;

				this.load();

				audio.removeEventListener('canplaythrough', load);
			}.bind(channel);

			if (audio.readyState != 4) {
				audio.addEventListener('canplaythrough', load);
			} else {
				load();
			}
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>playChannelSingle</strong></p>
		 *
		 * Play the specified channel once.
		 *
		 * @param  {String} id    Id of the sound to play
		 * @param  {Audio} channel    Channel to be played once
		 */
		playChannelSingle: function(id, channel) {
			var soundList = this.preAssignedChannels[id] ? this.preAssignedChannels[id] : this.pooledChannels;

			if (!this.canPlay(channel, soundList)) {
				return;
			}

			channel.timer.on('complete', function() {
				var c = channel;

				c.currentTime = 0;
				c.pause();

				if (this.preAssignedChannels[id]) {
					this.preAssignedChannels[id].push(c);
				} else {
					this.pooledChannels.push(c);
				}

				this.activeChannels.splice(this.activeChannels.indexOf(c), 1);
				this.execute(this.SINGLE_COMPLETE, c.id);
			}.bind(this), true);

			channel.timer.Delay(channel.time * 1000).RepeateCount(1).RemoveOnComplete(false).reset();

			this.execute(this.PLAY_SINGLE, channel.id);

			channel.play();
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>playChannelLoop</strong></p>
		 *
		 * Play the specified channel in a loop
		 * 
		 * @param  {String} id    Id of the sound to play
		 * @param  {Audio} channel    Channel to be played in a loop
		 */
		playChannelLoop: function(id, channel) {
			var soundList = this.preAssignedChannels[id] ? this.preAssignedChannels[id] : this.pooledChannels;

			if (!this.canPlay(channel, soundList)) {
				return;
			}

			channel.timer.on('repeate', function() {
				var c = channel;

				c.currentTime = 0;
				c.play();

				this.execute(this.PLAY_LOOP, c.id);
			}.bind(this));

			channel.timer.Delay(channel.time * 1000).RepeateCount(-1).RemoveOnComplete(false).reset();

			channel.play();

			this.execute(this.PLAY_LOOP, channel.id);
		},
		/**
		 * --------------------------------
		 */
		
		/**
		 * <p style='color:#AD071D'><strong>canPlay</strong></p>
		 *
		 * Test whether the provided channel can be played
		 * 
		 * @param  {Audio} channel    Channel to test
		 * @param  {Array} originList If the cahnnel is not loaded, send it back to this list
		 *
		 * @return {Boolean} Whether the channel can be played or not
		 */
		canPlay: function(channel, originList) {
			if (!channel.loaded) {
				originList.push(channel);
				return false;
			}

			this.activeChannels.push(channel);

			return true;
		}
		/**
		 * --------------------------------
		 */
	});

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

	// This object is returned by the **pauseAll**, **stopAll** and **resumeAll** 
	// methods and is used to determine to which channels the specified action whould be applied.
	var bulkControl = function(method) {
		var channel = null;

		var args = Array.prototype.slice.call(arguments).splice(1);

		return {
			// The callback function is executed for each active channel
			// If it returns true the action is applied. The callback receives a channel as argument
			which: function(func) {
				for (var i = this.activeChannels.length-1; i >=0 ; i--) {
					channel = this.activeChannels[i];

					if(func(channel)) {
						method.call(this, channel, i, args);
					}
				}
			}.bind(this),

			// Use this method to execute the specified action in all the active channels
			now: function() {
				for (var i = this.activeChannels.length-1; i >=0 ; i--) {
					channel = this.activeChannels[i];
					method.call(this, channel, i, args);
				}
			}.bind(this)
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