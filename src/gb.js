define(['domready!', 'game', 'root', 'layers', 'assembler', 'reclaimer', 'game_object_pool', 'component_pool'], 
	function(doc, game, root, layers, assembler, reclaimer, gameObjectPool, componentPool) {

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
				this.layers.get(layerName).add(this.assembler.get(goId)).start();	
			}
		}
	}
);

