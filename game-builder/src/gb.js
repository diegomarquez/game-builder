define(['game', 'root', 'layers', 'assembler', 'reclaimer', 'game_object_pool', 'component_pool'], 
	function(game, root, layers, assembler, reclaimer, gameObjectPool, componentPool) {
		return {
			game: game,
			root: root,
			layers:layers,

			assembler: assembler,
			reclaimer: reclaimer,

			goPool:gameObjectPool,
			coPool:componentPool,

			canvas: document.getElementById('game'),

			addToLayer: function(layerName, goId) {
				var go = this.layers.get(layerName).add(this.assembler.get(goId));
				go.start();	
				return go;
			}
		}
	}
);

