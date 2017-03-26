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
 * [asset-preloader](@@asset-preloader@@)
 * [error-printer](@@error-printer@@)
 * [util](@@util@@)
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
 * After creating the channels, it is a matter of adding some sounds files, using the **add** method. After
 * doing that the **playSingle** and **playLoop** methods will play sound given an id, provided the sound file has already been loaded,
 * otherwise it will be necessary to wait before playback starts.
 *
 * To avoid the initial wait consider using the **loadAll** method before playing any sound,
 * to allow the browser to cache the resources before using them.
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
define(['delegate', 'timer-factory', 'asset-preloader', 'error-printer', 'util'], function(Delegate, TimerFactory, AssetPreloader, ErrorPrinter, Util) {
	var SoundPlayer = Delegate.extend({
		/**
		* <p style='color:#AD071D'><strong>init</strong></p>
		*
		* Constructor
		*/
		init: function() {
			this._super();

			this.audioAssetPaths = {};
			this.audioAssetInfo = {};

			this.audioTags = {};
			this.audioTagsLoading = {};
			this.pooledChannels = [];
			this.activeChannels = [];
			this.preAssignedChannels = {};
			this.idsToPreAssignOnceLoaded = {};

			this.audioBuffers = {};
			this.audioBuffersLoading = {};
			this.activeBufferNodes = {};
			this.maximumAmountOfBuffers = 0;
			this.preAssignedBuffers = {};
			this.activePreAssignedBuffers = {};
			this.activeNoneAssignedBuffers = 0;

			this.currentTime = new Date();

			this.isLoading = false;

			window.AudioContext = window.AudioContext || window.webkitAudioContext;
			this.audioContext = null;
			
			if (window.AudioContext)
				this.audioContext = new window.AudioContext();

			this.pooledBufferNodes = {};
			
			this.blocked = false;
			this.remainEnabled = [];
			this.remainDisabled = [];
		},
		/**
		* --------------------------------
		*/

		/**
		* <p style='color:#AD071D'><strong>createChannels</strong></p>
		*
		* Define the amount of sounds that are allowed to be playing at the same time.
		*
		* @param {Number} amount
		*/
		createChannels: function(amount) {
			if (this.audioContext) {
				this.maximumAmountOfBuffers = amount;
			} else {
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

					channel.waitingToPlay = false;
					channel.stopRequested = false;
					channel.pauseRequested = false;

					this.pooledChannels.push(channel);
				}
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
			if (this.audioContext) {
				return 0;
			} else {
				return this.pooledChannels.length;
			}
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
			if (this.audioContext) {
				var result = 0;

				for (var k in this.activeBufferNodes) {
					result += this.activeBufferNodes[k].length;
				}

				return result;
			} else {
				return this.activeChannels.length;
			}
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
			if (this.audioContext) {
				var result = 0;

				for(var k in this.preAssignedBuffers) {
					result += this.preAssignedBuffers[k];
				}

				return result;
			} else {
				var result = 0;

				for(var k in this.preAssignedChannels) {
					result += this.preAssignedChannels[k].length;
				}

				return result;
			}
		},
		/**
		* --------------------------------
		*/

		/**
		* <p style='color:#AD071D'><strong>add</strong></p>
		*
		* Define an id for a given path to an audio resource. The id can later be used with
		* the various methods of the player to manipulate the sound.
		*
		* @param {String} id Use this identifier to later play the loaded sound
		* @param {String} path A path to a sound file. Can be relative or absolute
		* @param {Boolean = false} dynamicLoad If unspecified or false, the sounds will be loaded with **loadAll**. Otherwise they will be loaded when needed.
		* @param {String = ""} group Use this id to control all sounds with the same group id at the same time
		*/
		add: function(id, path, dynamicLoad, group) {
			// Ensure the supported audio format is being used
			this.audioAssetPaths[id] = AssetPreloader.convertPathToSupportedAudioFormat(path);

			var type = "";

			if (this.audioContext) {
				type = "web-audio";
			} else {
				type = "audio-tag";
			}

			this.audioAssetInfo[id] = {
				type: type,
				dynamic: !!dynamicLoad,
				group: group || ""
			};
		},
		/**
		* --------------------------------
		*/

		/**
		*
		* <p style='color:#AD071D'><strong>hasId</strong></p>
		*
		* Whether or not the sound player has the specified id registered.
		*
		* @param {String} id A registered id
		* @return {Boolean}
		*/
		hasId: function(id) {
			return !!this.audioAssetPaths[id];
		},
		/**
		* --------------------------------
		*/

		/**
		*
		* <p style='color:#AD071D'><strong>getResourcePath</strong></p>
		*
		* Get the resource path associated with the specified id.
		*
		* @param {String} id A registered id
		* @return {Boolean}
		*/
		getResourcePath: function(id) {
			return this.audioAssetPaths[id];
		},
		/**
		* --------------------------------
		*/

		/**
		* <p style='color:#AD071D'><strong>assignChannels</strong></p>
		*
		* Set aside an amount of times a given id can be played at the same time.
		*
		* @param {String} id Id of the sound that will get channels assigned
		* @param {Number} amount Amount of channels to set appart for the given sound
		*/
		assignChannels: function(id, amount) {
			if (this.audioContext) {
				if (!this.preAssignedBuffers[id]) {
					this.preAssignedBuffers[id] = amount;
					this.activePreAssignedBuffers[id] = 0;
				}

				this.preAssignedBuffers[id] = amount;
				this.activePreAssignedBuffers[id] = 0;
			} else {
				if (!this.idsToPreAssignOnceLoaded[id]) {
					this.idsToPreAssignOnceLoaded[id] = amount;
				}

				this.idsToPreAssignOnceLoaded[id] = amount;
			}
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
		* @param {String} id Id of the sound that has channels assigned
		*/
		clearAssignedChannels: function(id) {
			if (this.audioContext) {
				if (this.preAssignedBuffers[id]) {
					this.preAssignedBuffers[id] = 0;
					this.activePreAssignedBuffers[id] = 0;
				}
			} else {
				if (this.idsToPreAssignOnceLoaded[id])
					this.idsToPreAssignOnceLoaded[id] = 0;

				if (!this.preAssignedChannels[id])
					return;

				this.pooledChannels = this.pooledChannels.concat(this.preAssignedChannels[id]);
				this.preAssignedChannels[id] = null;
			}
		},
		/**
		* --------------------------------
		*/

		/**
		* <p style='color:#AD071D'><strong>loadAll</strong></p>
		*
		* Will load all the sounds that were added previously using <strong>add</strong>.
		* When all the loading is complete a delegate is executed.
		*
		* @throws {Error} If it is already loading files
		*/
		loadAll: function() {
			if (this.isLoading) {
				ErrorPrinter.printError('Sound Player', 'Still loading resources. Wait till everything is complete, before loading more');
			}

			this.isLoading = true;

			var soundAssetCount = Object.keys(this.audioAssetPaths).length;

			if (soundAssetCount === 0) {
				this.execute(this.ON_LOAD_ALL_COMPLETE);
				this.isLoading = false;

				return;
			}

			var checkAllAssetsLoaded = function() {
				soundAssetCount--;

				if (soundAssetCount <= 0) {
					this.execute(this.ON_LOAD_ALL_COMPLETE);
					this.isLoading = false;
				}
			}.bind(this);

			for (var id in this.audioAssetPaths) {
				if (this.audioTags[id]) {
					ErrorPrinter.printError('Sound Player', 'Id: ' + id + ' is already in use');
					soundAssetCount--;
					continue;
				}

				var path = this.audioAssetPaths[id];
				var type = this.audioAssetInfo[id].type;
				var dynamic = this.audioAssetInfo[id].dynamic;

				if (dynamic) {
					checkAllAssetsLoaded();
					continue;
				}

				if (type === 'audio-tag') {
					loadAudioTag.call(this, id, path, function() {
						if (this.idsToPreAssignOnceLoaded[id]) {
							var amound = this.idsToPreAssignOnceLoaded[id];
							var channels = this.pooledChannels.splice(0, amount);
							var channelsToLoad = channels.length;

							for(var i = 0; i < channels.length; i++) {
								loadChannel.call(this, id, channels[i], function(c) {
									channelsToLoad--;

									if (channelsToLoad <= 0) {
										checkAllAssetsLoaded();
									}
								});
							}

							if (!this.preAssignedChannels[id]) {
								this.preAssignedChannels[id] = [];
							}

							this.preAssignedChannels[id] = this.preAssignedChannels[id].concat(channels);
						} else {
							checkAllAssetsLoaded();
						}
					}, AssetPreloader);
				}

				if (type === 'web-audio') {
					loadWithWebAudio.call(this, id, path, function() {
						checkAllAssetsLoaded();
					}, AssetPreloader);
				}
			}
		},
		/**
		* --------------------------------
		*/
		
		/**
		* <p style='color:#AD071D'><strong>disableNewPlayback</strong></p>
		*
		* Disable the methods that play sound.
		*
		* @param {String|Array} remainEnabled optional sound ids or group ids that will still be playable
		*/
		disableNewPlayback: function(remainEnabled) {
			if (util.isString(remainEnabled)) {
				if (this.remainEnabled.indexOf(remainEnabled) === -1) {
					this.remainEnabled.push(remainEnabled);
				}
			} else if (util.isArray(remainEnabled)) {
				for (var i = 0; i < remainEnabled.length; i++) {
					var o = remainEnabled[i];

					if (util.isString(o) && this.remainEnabled.indexOf(o) === -1) {
						this.remainEnabled.push(o);
					}
				}
			} else {
				this.remainEnabled.length = 0;
			}

			this.blocked = true;
		},
		/**
		* --------------------------------
		*/
		
		/**
		* <p style='color:#AD071D'><strong>enableNewPlayback</strong></p>
		*
		* Enable the methods that play sound.
		*
		* @param {String|Array} remainDisabled optional sound ids or group ids that will remain blocked
		*/
		enableNewPlayback: function(remainDisabled) {
			if (util.isString(remainDisabled)) {
				if (this.remainDisabled.indexOf(remainDisabled) === -1) {
					this.remainDisabled.push(remainDisabled);
				}
			} else if (util.isArray(remainDisabled)) {
				for (var i = 0; i < remainDisabled.length; i++) {
					var k = remainDisabled[i];

					if (util.isString(k) && this.remainDisabled.indexOf(k) === -1) {
						this.remainDisabled.push(k);
					}
				}
			} else {
				this.remainDisabled.length = 0;
			}

			this.blocked = false;
		},
		/**
		* --------------------------------
		*/
		
		/**
		* <p style='color:#AD071D'><strong>playSingle</strong></p>
		*
		* Plays a sound 1 time.
		*
		* @param {String} id Id of the sound to play
		* @param {Boolean = false} force Force playback if it is blocked
		*/
		playSingle: function(id, force) {
			var path = this.audioAssetPaths[id];
			var type = this.audioAssetInfo[id].type;
			var group = this.audioAssetInfo[id].group;

			if (!force) {
				if (this.blocked) {
					if (this.remainEnabled.indexOf(id) === -1) {
						return;
					}

					if (this.remainEnabled.indexOf(group) === -1) {
						return;
					}
				} else {
					if (this.remainDisabled.indexOf(id) !== -1) {
						return;
					}

					if (this.remainDisabled.indexOf(group) !== -1) {
						return;
					}
				}
			}

			if (type === 'audio-tag') {
				if (this.audioTags[id]) {
					var soundList = this.preAssignedChannels[id] ? this.preAssignedChannels[id] : this.pooledChannels;

					if (soundList.length == 0) return;

					var channel = getPooledChannel.call(this, soundList);

					if(this.preAssignedChannels[id] && channel && channel.loaded) {
						channel.group = group;
						playChannelSingle.call(this, id, channel);
					} else if (this.preAssignedChannels[id] && channel && !channel.loaded) {
						var onMD = function() {
							channel.group = group;
							channel.removeEventListener('loadedmetadata', onMD);
							playChannelSingle.call(this, id, channel);
						}.bind(this);

						channel.addEventListener('loadedmetadata', onMD);
					} else {
						loadChannel.call(this, id, channel, function (channel) {
							channel.group = group;
							playChannelSingle.call(this, id, channel);
						}.bind(this));
					}
				} else {
					var forcePlayBack = !this.blocked;
					
					loadWithAudioTag.call(this, id, path, function(id) {
						this.playSingle(id, forcePlayBack);
					}.bind(this), AssetPreloader);
				}
			}

			if (type === 'web-audio') {
				if (this.audioBuffers[id]) {
					if (this.preAssignedBuffers[id]) {
						var maxAmount = this.preAssignedBuffers[id];

						if (this.activePreAssignedBuffers[id] < maxAmount) {
							this.activePreAssignedBuffers[id]++;
						} else {
							return;
						}
					} else {
						var maxAmount = this.maximumAmountOfBuffers;

						if (this.activeNoneAssignedBuffers < maxAmount) {
							this.activeNoneAssignedBuffers++;
						} else {
							return;
						}
					}

					var bufferNode;

					if (!this.pooledBufferNodes[id]) {
						bufferNode = createBufferSourceNode(this.audioBuffers[id], this.audioContext, false);
					} else if (!this.pooledBufferNodes[id].length) {
						bufferNode = createBufferSourceNode(this.audioBuffers[id], this.audioContext, false);
					}else {
						bufferNode = this.pooledBufferNodes[id].pop();

						bufferNode.update(this.audioBuffers[id], false);
					}

					if (!this.activeBufferNodes[id]) {
						this.activeBufferNodes[id] = [];
					}

					bufferNode.group = group;
					this.activeBufferNodes[id].push(bufferNode);

					bufferNode.onEnded = function() {
						var index = this.activeBufferNodes[id].indexOf(bufferNode);

						if (index !== -1) {
							this.activeBufferNodes[id].splice(index, 1);
						}

						if (!this.pooledBufferNodes[id]) {
							this.pooledBufferNodes[id] = [];
						}

						this.pooledBufferNodes[id].push(bufferNode);

						if (this.preAssignedBuffers[id]) {
							this.activePreAssignedBuffers[id]--;
						} else {
							this.activeNoneAssignedBuffers--;
						}

						this.execute(this.SINGLE_COMPLETE, id);
					}.bind(this);

					bufferNode.play();

					this.execute(this.PLAY_SINGLE, id);
				} else {
					var forcePlayBack = !this.blocked;
					
					loadWithWebAudio.call(this, id, path, function(id) {
						this.playSingle(id, forcePlayBack);
					}.bind(this), AssetPreloader);
				}
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
		* @param {String} id Id of the sound to play
		* @param {Boolean = false} force Force playback if it is blocked
		*/
		playLoop: function(id, force) {
			var path = this.audioAssetPaths[id];
			var type = this.audioAssetInfo[id].type;
			var group = this.audioAssetInfo[id].group;

			if (!force) {
				if (this.blocked) {
					if (this.remainEnabled.indexOf(id) === -1) {
						return;
					}

					if (this.remainEnabled.indexOf(group) === -1) {
						return;
					}
				} else {
					if (this.remainDisabled.indexOf(id) !== -1) {
						return;
					}

					if (this.remainDisabled.indexOf(group) !== -1) {
						return;
					}
				}
			}

			if (type === 'audio-tag') {
				if (this.audioTags[id]) {
					var soundList = this.preAssignedChannels[id] ? this.preAssignedChannels[id] : this.pooledChannels;

					if (soundList.length == 0) return;

					var channel = getPooledChannel.call(this, soundList);

					if(this.preAssignedChannels[id] && channel && channel.loaded) {
						channel.group = group;
						playChannelLoop.call(this, id, channel);
					} else if (this.preAssignedChannels[id] && channel && !channel.loaded) {
						var onMD = function() {
							channel.group = group;
							channel.removeEventListener('loadedmetadata', onMD);
							playChannelLoop.call(this, id, channel);
						}.bind(this);

						channel.addEventListener('loadedmetadata', onMD);
					} else {
						loadChannel.call(this, id, channel, function (channel) {
							channel.group = group;
							playChannelLoop.call(this, id, channel);
						}.bind(this));
					}
				}
				else {
					var forcePlayBack = !this.blocked;
					
					loadWithAudioTag.call(this, id, path, function(id) {
						this.playLoop(id, forcePlayBack);
					}.bind(this), AssetPreloader);
				}
			}

			if (type === 'web-audio') {
				if (this.audioBuffers[id]) {
					var bufferNode;

					if (!this.pooledBufferNodes[id]) {
						bufferNode = createBufferSourceNode(this.audioBuffers[id], this.audioContext, true);
					} else if (!this.pooledBufferNodes[id].length) {
						bufferNode = createBufferSourceNode(this.audioBuffers[id], this.audioContext, true);
					} else {
						bufferNode = this.pooledBufferNodes[id].pop();

						bufferNode.update(this.audioBuffers[id], true);
					}
					
					if (this.preAssignedBuffers[id]) {
						var maxAmount = this.preAssignedBuffers[id];

						if (this.activePreAssignedBuffers[id] < maxAmount) {
							this.activePreAssignedBuffers[id]++;
						} else {
							return;
						}
					} else {
						var maxAmount = this.maximumAmountOfBuffers;

						if (this.activeNoneAssignedBuffers < maxAmount) {
							this.activeNoneAssignedBuffers++;
						} else {
							return;
						}
					}

					if (!this.activeBufferNodes[id]) {
						this.activeBufferNodes[id] = [];
					}
					
					bufferNode.group = group;
					this.activeBufferNodes[id].push(bufferNode);

					bufferNode.onEnded = function() {
						var index = this.activeBufferNodes[id].indexOf(bufferNode);

						if (index !== -1) {
							this.activeBufferNodes[id].splice(index, 1);
						}

						if (!this.pooledBufferNodes[id]) {
							this.pooledBufferNodes[id] = [];
						}

						this.pooledBufferNodes[id].push(bufferNode);

						if (this.preAssignedBuffers[id]) {
							this.activePreAssignedBuffers[id]--;
						} else {
							this.activeNoneAssignedBuffers--;
						}
					}.bind(this);

					bufferNode.onLoop = function() {
						this.execute(this.PLAY_LOOP, id);
					}.bind(this);

					bufferNode.play();

					this.execute(this.PLAY_LOOP, id);
				} else {
					var forcePlayBack = !this.blocked;
					
					loadWithWebAudio.call(this, id, path, function(id) {
						this.playLoop(id, forcePlayBack);
					}.bind(this), AssetPreloader);
				}
			}
		},
		/**
		* --------------------------------
		*/

		/**
		* <p style='color:#AD071D'><strong>pause</strong></p>
		*
		* Pauses all the channels playing a sound with the given id.
		* If the Id is not found, the passed in argument will be treated as a group id and all sounds sharing it
		* will be paused.
		*
		* @param {String} id Id or group of the sound to pause
		*/
		pause: function(id) {
			if (this.audioAssetInfo[id]) {
				var type = this.audioAssetInfo[id].type;
				
				if (type === "audio-tag") {
					for (var i = this.activeChannels.length - 1; i >= 0 ; i--) {
						var channel = this.activeChannels[i];
						
						if (channel.id == id) {
							pauseChannel.call(this, channel);
						}
					}
				}
				
				if (type === "web-audio") {
					var activeBuffers = this.activeBufferNodes[id];
					
					if (!activeBuffers) return;
					
					for (var i = activeBuffers.length - 1; i >= 0 ; i--) {
						activeBuffers[i].pause();
					}
				}
			} else {
				if (this.activeChannels) {
					for (var i = this.activeChannels.length - 1; i >= 0; i--) {
						var channel = this.activeChannels[i];
						
						if (channel.group == id) {
							pauseChannel.call(this, channel);
						}
					}
				}
				
				if (this.activeBufferNodes) {
					for (var k in this.activeBufferNodes) {
						var bufferNodes = this.activeBufferNodes[k];
						
						for (var i = bufferNodes.length - 1; i >= 0; i--) {
							var bufferNode = bufferNodes[i];
							
							if (bufferNode.group === id) {
								bufferNode.pause();
							}
						}
					}
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
		* If the Id is not found, the passed in argument will be treated as a group id and all sounds sharing it
		* will be stopped.
		*
		* @param {String} id Id or group of the sound to stop
		*/
		stop: function(id) {
			if (this.audioAssetInfo[id]) {
				var type = this.audioAssetInfo[id].type;
				
				if (type === "audio-tag") {
					for (var i = this.activeChannels.length - 1; i >= 0 ; i--) {
						var channel = this.activeChannels[i];
						
						if (channel.id == id) {
							stopChannel.call(this, channel);
						}
					}
				}
				
				if (type === "web-audio") {
					var activeBuffers = this.activeBufferNodes[id];
					
					if (!activeBuffers) return;
					
					for (var i = activeBuffers.length - 1; i >= 0 ; i--) {
						activeBuffers[i].stop();
					}
				}
			} else {
				if (this.activeChannels) {
					for (var i = this.activeChannels.length - 1; i >= 0; i--) {
						var channel = this.activeChannels[i];
						
						if (channel.group == id) {
							stopChannel.call(this, channel);
						}
					}
				}
				
				if (this.activeBufferNodes) {
					for (var k in this.activeBufferNodes) {
						var bufferNodes = this.activeBufferNodes[k];
						
						for (var i = bufferNodes.length - 1; i >= 0; i--) {
							var bufferNode = bufferNodes[i];
							
							if (bufferNode.group === id) {
								bufferNode.stop();
							}
						}
					}
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
		* If the Id is not found, the passed in argument will be treated as a group id and all sounds sharing it
		* will be resumed.
		*
		* @param {String} id Id or group of the sound to resume
		*/
		resume: function(id) {
			if (this.audioAssetInfo[id]) {
				var type = this.audioAssetInfo[id].type;
				
				if (type === "audio-tag") {
					for (var i = this.activeChannels.length - 1; i >= 0 ; i--) {
						var channel = this.activeChannels[i];
						
						if (channel.id == id) {
							resumeChannel.call(this, channel);
						}
					}
				}
				
				if (type === "web-audio") {
					var activeBuffers = this.activeBufferNodes[id];
					
					if (!activeBuffers) return;
					
					for (var i = activeBuffers.length - 1; i >= 0 ; i--) {
						activeBuffers[i].resume();
					}
				}
			} else {
				if (this.activeChannels) {
					for (var i = this.activeChannels.length - 1; i >= 0; i--) {
						var channel = this.activeChannels[i];
						
						if (channel.group == id) {
							resumeChannel.call(this, channel);
						}
					}
				}
				
				if (this.activeBufferNodes) {
					for (var k in this.activeBufferNodes) {
						var bufferNodes = this.activeBufferNodes[k];
						
						for (var i = bufferNodes.length - 1; i >= 0; i--) {
							var bufferNode = bufferNodes[i];
							
							if (bufferNode.group === id) {
								bufferNode.resume();
							}
						}
					}
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
			return bulkControl.call(this, 'pause');
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
			return bulkControl.call(this, 'stop');
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
			return bulkControl.call(this, 'resume');
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
			return bulkControl.call(this, 'setproperty', property, value);
		},
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
	var bulkControl = function(action) {
		var args = Array.prototype.slice.call(arguments).splice(1);

		return {
			// The callback function is executed for each active channel
			// If it returns true the action is applied.
			// The callback receives the id of the playing
			// sound and the audio source as arguments
			which: function(func) {
				// Handle Audio Objects
				for (var i = this.activeChannels.length-1; i >=0 ; i--) {
					var channel = this.activeChannels[i];

					if(func(channel.id, channel)) {
						switch(action) {
							case 'pause':
								pauseChannel.call(this, channel, i, args);
								break;
							case 'resume':
								resumeChannel.call(this, channel, i, args);
								break;
							case 'stop':
								stopChannel.call(this, channel, i, args);
								break;
							case 'setproperty':
								setProperty.call(this, channel, i, args);
								break;
						}
					}
				}

				// Handle Audio Buffers
				for (var k in this.activeBufferNodes) {
					var activeBufferNodes = this.activeBufferNodes[k];

					for (var i = activeBufferNodes.length-1; i >=0 ; i--) {
						var buffer = activeBufferNodes[i];

						if(func(k, buffer)) {
							switch(action) {
								case 'pause':
									pauseBuffer.call(this, buffer, i, args);
									break;
								case 'resume':
									resumeBuffer.call(this, buffer, i, args);
									break;
								case 'stop':
									stopBuffer.call(this, buffer, i, args);
									break;
								case 'setproperty':
									setProperty.call(this, buffer, i, args);
									break;
							}
						}
					}
				}
			}.bind(this),

			// Use this method to execute the specified action in all the active audio
			now: function() {
				// Handle Audio Objects
				for (var i = this.activeChannels.length-1; i >=0 ; i--) {
					var channel = this.activeChannels[i];

					switch(action) {
						case 'pause':
							pauseChannel.call(this, channel, i, args);
							break;
						case 'resume':
							resumeChannel.call(this, channel, i, args);
							break;
						case 'stop':
							stopChannel.call(this, channel, i, args);
							break;
						case 'setproperty':
							setProperty.call(this, channel, i, args);
							break;
					}
				}

				// Handle Audio Buffers
				for (var k in this.activeBufferNodes) {
					var activeBufferNodes = this.activeBufferNodes[k];

					for (var i = activeBufferNodes.length-1; i >=0 ; i--) {
						var buffer = activeBufferNodes[i];

						switch(action) {
							case 'pause':
								pauseBuffer.call(this, buffer, i, args);
								break;
							case 'resume':
								resumeBuffer.call(this, buffer, i, args);
								break;
							case 'stop':
								stopBuffer.call(this, buffer, i, args);
								break;
							case 'setproperty':
								setProperty.call(this, buffer, i, args);
								break;
						}
					}
				}
			}.bind(this)
		}
	};

	var pauseBuffer = function(buffer) {
		buffer.pause();
		this.execute(this.PAUSE);
	}

	var stopBuffer = function(buffer, index) {
		buffer.stop();
		this.execute(this.STOP);
	}

	var resumeBuffer = function(buffer) {
		buffer.resume();
		this.execute(this.RESUME);
	}

	var pauseChannel = function(channel) {
		if (channel.waitingToPlay) {
			channel.pauseRequested = true;

			return;
		}

		channel.pauseRequested = false;

		channel.timer.pause();
		channel.pause();

		this.execute(this.PAUSE);
	};

	var stopChannel = function(channel, index) {
		if (channel.waitingToPlay) {
			channel.stopRequested = true;

			return;
		}

		channel.stopRequested = false;

		if(this.preAssignedChannels[channel.id]) {
			this.preAssignedChannels[channel.id].push(channel);
		} else {
			this.pooledChannels.push(channel);

			channel.id = 'none';
		}

		this.activeChannels.splice(index, 1);

		channel.currentTime = 0;
		channel.pause();
		channel.timer.stop();

		channel.timer.hardCleanUp();

		this.execute(this.STOP);
	};

	var resumeChannel = function(channel) {
		channel.waitingToPlay = true;

		channel.play().then(function() {
			channel.waitingToPlay = false;

			if (channel.stopRequested) {
				stopChannel.call(this, channel, this.activeChannels.indexOf(channel));
				return;
			}
			if (channel.pauseRequested) {
				pauseChannel.call(this, channel, this.activeChannels.indexOf(channel));
				return;
			}

			channel.timer.resume();

			this.execute(this.RESUME);
		}.bind(this));
	};

	var setProperty = function(object, index, args) {
		object[args[0]] = args[1];
	};

	var loadWithAudioTag = function(id, path, onComplete, assetPreloader) {
		if (this.audioTags[id]) {
			ErrorPrinter.printError('Sound Player', 'Id: ' + id + ' is already in use');
		}

		loadAudioTag.call(this, id, path, function() {
			if (onComplete)
				onComplete(id);

			this.execute(this.ON_LOAD_COMPLETE, id);
		}, assetPreloader);
	};

	var loadWithWebAudio = function(id, path, onComplete, assetPreloader) {
		if (this.audioBuffers[id]) {
			ErrorPrinter.printError('Sound Player', 'Id: ' + id + ' is already in use');
		}

		if (this.audioBuffersLoading[id]) {
			return;
		}

		this.audioBuffersLoading[id] = true;

		var cachedArrayBuffer = assetPreloader.getCachedAudio(path);

		if (cachedArrayBuffer) {
			this.audioContext.decodeAudioData(cachedArrayBuffer, function(buffer) {
				this.audioBuffers[id] = buffer;
				this.audioBuffersLoading[id] = false;

				if (onComplete)
					onComplete(id);
			}.bind(this));
		} else {
			var request = new XMLHttpRequest();

			if (window.location.protocol === 'file:') {
				request.open('GET', 'http://localhost:5000/' + path);
			} else {
				request.open('GET', path);
			}

			request.responseType = 'arraybuffer';

			request.onload = function() {
				this.audioContext.decodeAudioData(request.response, function(buffer) {
					this.audioBuffers[id] = buffer;
					this.audioBuffersLoading[id] = false;

					if (onComplete)
						onComplete(id);
				}.bind(this));
			}.bind(this);

			request.send();
		}
	};

	var getPooledChannel = function(fromList) {
		if (fromList.length == 0)
			return;

		return fromList.pop();
	};

	var loadAudioTag = function(id, path, onComplete, assetPreloader) {
		if (this.audioTagsLoading[id])
			return;

		var cachedAudioElement = assetPreloader.getCachedAudio(path);

		var audio;

		if (cachedAudioElement) {
			audio = cachedAudioElement;
			this.audioTagsLoading[id] = false;
			this.audioTags[id] = cachedAudioElement;

			onComplete.call(this);
		} else {
			audio = document.createElement("audio");

			audio.setAttribute("src", path);
			audio.setAttribute("preload", "auto");

			audio.addEventListener("canplaythrough", function() {
				this.audioTagsLoading[id] = false;

				onComplete.call(this)
			}.bind(this));

			this.audioTags[id] = audio;
			this.audioTagsLoading[id] = true;
		}

		document.body.appendChild(audio);
	};

	var loadChannel = function(id, channel, onReady) {
		var audio = this.audioTags[id];

		if (!audio) return;

		channel.loaded = false;

		var onMD = function() {
			channel.removeEventListener('loadedmetadata', onMD);

			channel.loaded = true;

			if (onReady) {
				onReady(channel);
			}
		};

		var load = function() {
			channel.addEventListener('loadedmetadata', onMD);

			channel.id = id;
			channel.src = audio.src;
			channel.time = audio.duration;

			channel.load();

			audio.removeEventListener('canplaythrough', load);
		};

		if (audio.readyState != 4) {
			audio.addEventListener('canplaythrough', load);
		} else {
			load();
		}
	};

	var playChannelSingle = function(id, channel) {
		var soundList = this.preAssignedChannels[id] ? this.preAssignedChannels[id] : this.pooledChannels;

		if (!canPlay.call(this, channel, soundList)) {
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

		channel.waitingToPlay = true;

		channel.play().then(function() {

			channel.waitingToPlay = false;

			if (channel.stopRequested) {
				stopChannel.call(this, channel, soundList.indexOf(channel));
				return;
			}

			if (channel.pauseRequested) {
				pauseChannel.call(this, channel, soundList.indexOf(channel));
				return;
			}

			channel.timer.Delay(channel.time * 1000).RepeateCount(1).RemoveOnComplete(false).reset();

			this.execute(this.PLAY_SINGLE, channel.id);

		}.bind(this));
	};

	var playChannelLoop = function(id, channel) {
		var soundList = this.preAssignedChannels[id] ? this.preAssignedChannels[id] : this.pooledChannels;

		if (!canPlay.call(this, channel, soundList)) {
			return;
		}

		channel.timer.on('repeate', function() {
			var c = channel;

			c.currentTime = 0;

			c.waitingToPlay = true;

			c.play().then(function() {
				c.waitingToPlay = false;

				if (c.stopRequested) {
					stopChannel.call(this, c, soundList.indexOf(c));
					return;
				}

				if (c.pauseRequested) {
					pauseChannel.call(this, c, soundList.indexOf(channel));
					return;
				}

				this.execute(this.PLAY_LOOP, c.id);
			}.bind(this));
		}.bind(this));

		channel.waitingToPlay = true;

		channel.play().then(function() {
			channel.waitingToPlay = false;

			if (channel.stopRequested) {
				stopChannel.call(this, channel, soundList.indexOf(channel));
				return;
			}

			if (channel.pauseRequested) {
				pauseChannel.call(this, channel, soundList.indexOf(channel));
				return;
			}

			channel.timer.Delay(channel.time * 1000).RepeateCount(-1).RemoveOnComplete(false).reset();

			this.execute(this.PLAY_LOOP, channel.id);
		}.bind(this));
	};

	var canPlay = function(channel, originList) {
		if (!channel.loaded) {
			originList.push(channel);
			return false;
		}

		this.activeChannels.push(channel);

		return true;
	}

	var createBufferSourceNode = function(buffer, context, loop) {
		var sourceNode = null;
		var startedAt = 0;
		var pausedAt = 0;
		var playing = false;
		var paused = false;
		var buff = buffer;
		var l = loop;

		function play() {
			if (playing)
				return;

			if (paused)
				return;

			var offset = pausedAt;

			sourceNode = context.createBufferSource();
			sourceNode.connect(context.destination);
			sourceNode.buffer = buff;
			sourceNode.loop = l;

			sourceNode.onended = function() {
				if (l) {
					if (sound.onLoop)
						sound.onLoop();
				} else {
					if (sound.onEnded && !paused) {
						sound.onEnded();
					}
				}
			};

			sourceNode.start(context.currentTime, offset);

			startedAt = context.currentTime - offset;
			pausedAt = 0;
			playing = true;
			paused = false;
		};

		function resume() {
			if (!paused)
				return;

			paused = false;

			play();
		}

		function pause() {
			if (!playing)
				return;

			var elapsed = context.currentTime - startedAt;
			paused = true;
			stop();
			paused = true;
			pausedAt = elapsed;
		};

		function stop() {
			if (!playing)
				return;

			if (sourceNode) {
				sourceNode.disconnect();
				sourceNode.stop(0);
				sourceNode = null;

				if (sound.onEnded && !paused) {
					sound.onEnded();
				}
			}

			pausedAt = 0;
			startedAt = 0;
			playing = false;
			paused = false;
		};

		function getCurrentTime() {
			if(pausedAt) {
				return pausedAt;
			}

			if(startedAt) {
				return context.currentTime - startedAt;
			}

			return 0;
		};

		function getDuration() {
			return buffer.duration;
		};

		function updateBuffer(newBuffer, newLoop) {
			buff = newBuffer;
			l = newLoop;

			sourceNode = null;
			startedAt = 0;
			pausedAt = 0;
			playing = false;
			paused = false;
		}

		var sound = {
			currentTime: getCurrentTime,
			duration: getDuration,
			play: play,
			pause: pause,
			resume: resume,
			stop: stop,
			onEnded: null,
			onLoop: null,
			group: "",

			update: function(buffer, loop) {
				updateBuffer(buffer, loop);

				this.onEnded = null;
				this.onLoop = null;
			},

			Playing: function() {
				return playing;
			},

			Paused: function() {
				return paused;
			},

			Stopped: function() {
				return !!sourceNode;
			}
		};

		return sound;
	}

	return new SoundPlayer();
});