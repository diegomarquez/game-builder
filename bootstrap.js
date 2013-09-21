requirejs.config({
	paths: {
		"delegate": "core/delegate",
		"component": "core/component",
		"renderer": "core/render/renderer",
		"class": "core/class",
		
		"game": "core/game",

		"keyboard": "core/input/keyboard",

		"sound_player": "core/sound_player",
		"state_machine": "core/state_machine",
		"timer_factory": "core/timer_factory",
		"draw": "core/draw",

		"matrix_3x3": "core/math/matrix_3x3",
		"vector_2D": "core/math/vector_2D",

		"root": "core/hierarchy/root",
		"layer": "core/hierarchy/layer",
		"game_object": "core/hierarchy/game_object",
		"game_object_container": "core/hierarchy/game_object_container",
		
		"pool": "core/pools/pool",
		"game_object_pool": "core/pools/game_object_pool",
		"component_pool": "core/pools/component_pool",
		"assembler": "core/assembler",

		"layers": "core/layers",

		"domReady": "requireJS/domReady"		
	}
});

require(['domReady!', 'game', 'root', 'layers', 'main'], function(doc, game, root, layers, main) {
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