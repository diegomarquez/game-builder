requirejs.config({
	paths: {
		"delegate": "core/delegate",
		"game": "core/game",
		"sound_player": "core/sound_player",
		"state_machine": "core/state_machine",
		"timer_factory": "core/timer_factory",
		"class": "core/class",
		"component": "core/component",

		"keyboard": "core/input/keyboard",

		"matrix_3x3": "core/math/matrix_3x3",
		"vector_2D": "core/math/vector_2D",

		"root": "core/hierarchy/root",
		"game_object": "core/hierarchy/game_object",
		"game_object_container": "core/hierarchy/game_object_container",
		"factory": "core/factory",

		"draw": "utils/draw",

		"domReady": "requireJS/domReady"		
	}
});

require(['domReady!', 'game', 'root', 'main'], function(doc, game, root, main) {

	main.start();
	
	game.on("update", this, function() {
		root.update(game.delta, game.isPaused);
		root.transformAndDraw(game.context);
	});

	game.create(document.getElementById('main'), document.getElementById('game'));
});