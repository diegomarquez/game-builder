# [GAME-BUILDER][game-builder]

![game][game]

These are some files I decided to extract from a previous javascript project. These should provide all the things a simple arcade game needs. I am talking Asteroids or Galaga simple. 

By itself this repository is kind of useless, as it is nothing more than a collection of requirejs modules. You could try and figure out how to use them, though. 

For better results it is better to use it in conjuction with [generator-game-builder][generator], a [Yeoman][yeoman] generator that generates(dur) the basic setup to start working with this stuff. Or you could just copy/paste stuff like crazy, your call.

-----------------------------------

###### TODO List:

- Refactor examples to use viewports

- Viewports
	- Concerns
		- Each camera clears it's viewing region.
			- The camera manager takes care of deciding what part the view needs to be cleared in each viewport
			- Mainly for overlapping viewports
	- Basic Culling strategy
		- When the root draws to a viewport, it sends the information about the viewport to all the game-objects, so they can decide
        if they are in the region of the viewport
        - All renderers must define a region so they can calculate if they are in the viewport or not 

- Rename the current layer.js and layers.js to group.js and groups.js. 
    - Rename all the places where it is a dependency. This requires trying out every example.
    - Rename in documentation where needed

- Document viewport.js and viewports.js
- Document view/layer.js
- Document new transform and draw methods
    - root.js
    - game-object.js
    - game-object-container.js

- Add errors to website
    - Rename heriarchy folders errors (Layer -> Group)

- Example than demonstrates multiple viewports
    - Don't forget to try out collision between different game-objects in different viewports
- Add game-objects in each viewport to activity display
- Add gb.js error to error page

- Delete old files

- Add alpha to matrix_3x3.js    
- Move repeated code from every main.js into game.js

- Shared Renderers. Share logic which does not need to keep state.

- Do a simple game and get this over with for fucks sake!
    - Something like Galaga, with a boss.

-----------------------------------

###### After Game:

- Figure out how to use r.js

- Frame Animation System
- Animation Capturing Tool
- Visual Editor

### [This is the prototype game][tirador] which spurred the creation of this project.

[game]: http://diegomarquez.github.io/game-builder/Galaga.png
[tirador]: http://www.treintipollo.com/tirador/index.html
[generator]: https://github.com/diegomarquez/generator-game-builder
[yeoman]: http://yeoman.io/
[game-builder]: http://diegomarquez.github.io/game-builder
