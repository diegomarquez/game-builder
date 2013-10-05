requirejs.config({
	paths: {
		"delegate": "delegate",
		"class": "class",
		"sound_player": "sound_player",
		"state_machine": "state_machine",
		"timer_factory": "timer_factory",
		"draw": "draw",
		"util": "util",

		"circle": "collision/circle_collider",
		"polygon": "collision/polygon_collider",
		"f_polygon": "collision/fixed_polygon_collider",
		"collision_resolver": "collision/collision_resolver",
		"collision_component": "collision/collision_component",
		"sat": "collision/sat",

		"game": "game_canvas/canvas_wrapper",
		
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

		"domReady": "requireJS/domReady"
	}
});

gjs = {}

require(['domReady!', 'game', 'root', 'layers', 'assembler', 'game_object_pool', 'component_pool'],

	function(doc, game, root, layers, assembler, game_object_pool, component_pool) {

		var mainPath = document.querySelectorAll('script[data-main]')[0].getAttribute('main-path')

		//Main dependecies, all together in a global variable for easy access.
		gjs['game']      = game;
		gjs['layers']    = layers;
		gjs['assembler'] = assembler;
		gjs['go_pool']   = game_object_pool
		gjs['co_pool']   = component_pool;
		gjs['canvas']    = document.getElementById('game');

		require([mainPath], function(main) {
			main.start();

			game.on("update", this, function() {
				root.update(game.delta, game.isPaused);
				root.transformAndDraw(game.context);
			});

			layers.add("Back");
			layers.add("Middle");
			layers.add("Front");
			layers.add("Text");
			layers.add("Hud");
			layers.add("Popup");

			game.create(document.getElementById('main'), document.getElementById('game'));
		});
	});