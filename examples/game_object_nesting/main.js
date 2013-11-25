gjs.setModulePath('nesting_bundle');

define(function(require) {
		var main = function(){
			gjs.game.on("init", this, function() {
				 require('nesting_bundle').create()
				
				//The ID Continer_1 is defined in nesting_bundle.js
				gjs.addToLayer('Middle', 'Container_1');
			});
		};

		return new main()
	}
);