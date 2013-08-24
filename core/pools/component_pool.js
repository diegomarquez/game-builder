define(['pool'], function(Pool) {

	var ComponentPool = Pool.extend({
		createConfiguration: function(alias, type) {
			var configuration = {
				componentId: type,
				componentArgs: null,

				args: function(args) {
					this.componentArgs = args;
					return this;
				}
			}

			this.configurations[alias] = configuration;

			return configuration;
		};

		getConfiguration: function(alias) {
			var configuration = this.configurations[alias];

			if (this.pools[configuration.componentId].length <= 0) {
				throw new Error('Component with id: ' + configuration.componentId + ' is not available');
			}

			return configuration;
		};
	});

	return new ComponentPool();
});