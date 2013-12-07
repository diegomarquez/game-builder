gjs = { 

	deps:
	[
	 	'domready!', 
	 	'game', 
	 	'root', 
	 	'layers', 
	 	'assembler', 
	 	'reclaimer', 
	 	'game_object_pool', 
	 	'component_pool'
	],

	config : {
		paths: {
			"delegate": "delegate",
			"class": "class",
			"sound_player": "sound_player",
			"state_machine_factory": "state_machine",
			"timer_factory": "timer_factory",
			"draw": "draw",
			"util": "util",

			"circle": "collision/circle_collider",
			"polygon": "collision/polygon_collider",
			"fixed_polygon": "collision/fixed_polygon_collider",
			"collision_resolver": "collision/collision_resolver",
			"collision_component": "collision/collision_component",
			"sat": "collision/sat",

			"game": "game_canvas/canvas_wrapper",
			"scale_aspect_ratio_extension": "game_canvas/extensions/scale_keeping_aspect_ratio",

			"keyboard": "input/keyboard",
			
			"matrix_3x3": "math/matrix_3x3",
			"vector_2D": "math/vector_2D",

			"component": "components/component",
			"renderer": "components/rendering/renderer",
			"bitmap_renderer": "components/rendering/bitmap_renderer",

			"root": "hierarchy/root",
			"layer": "hierarchy/layer",
			"layers": "hierarchy/layers",
			"game_object": "hierarchy/game_object",
			"game_object_container": "hierarchy/game_object_container",

			"pool": "pools/pool",
			"game_object_pool": "pools/game_object_pool",
			"component_pool": "pools/component_pool",
			"assembler": "pools/assembler",
			"reclaimer": "pools/reclaimer",
			"bundle": "pools/bundle",

			"domready": "../lib/requirejs-domready/domReady"
		}	
	},

	setModulePath: function(alias) {
		var paths = [];

		for(var i=0; i<this.srcPaths.length; i++) {
			paths.push(this.srcPaths[i] + alias)
		}

		this.config.paths[alias] = paths; 
		requirejs.config(this.config);
	}
}

requirejs.config(gjs.config);

require(gjs.deps,
	function(doc, game, root, layers, assembler, reclaimer, game_object_pool, component_pool) {

		require([mainPath], function(main) {
			game.on("update", this, function() {
				root.update(game.delta);
				root.transformAndDraw(game.context);
			});

			game.create(document.getElementById('main'), document.getElementById('game'));
		});
	});