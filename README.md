# [GAME-BUILDER][game-builder]

![game][game]

These are some files I decided to extract from a previous javascript project. These should provide all the things a simple arcade game needs. I am talking Asteroids or Galaga simple. 

By itself this repository is kind of useless, as it is nothing more than a collection of requirejs modules. You could try and figure out how to use them, though. 

For better results it is better to use it in conjuction with [generator-game-builder][generator], a [Yeoman][yeoman] generator that generates(dur) the basic setup to start working with this stuff. Or you could just copy/paste stuff like crazy, your call.

-----------------------------------

###### TODO List:

- Examples v6 
    - Add feedback about the internals of each example
        - Pooled Objects (DONE)
        - Active Objects (DOE)
        - Pooled Sound Channels
        - Active Sound Channels
        - Loaded Sounds
        - Assigned Channels
        - Cached Images
        - Cached Paths
        - Cached Text
        - Cached Objects (DONE)
    - Module to add that information to all examples
        - debug folder (DONE)
        - Add to all examples
    - Style
    - Interface for all Caches

- Fix CSS on examples, they are not alligned properly when putting them in an iFrame
    - Checkout renderers examples

- Tag
- Deploy Website

- Do a simple game and get this over with for fucks sake!

-----------------------------------

###### After Game:

- Figure out how to use r.js

- Shared Renderers. Share logic which does not need to keep state.
- 2D Camera
- Frame Animation System

- Animation Capturing Tool
- Visual Editor

- Proper Tests

### [This is the prototype game][tirador] which spurred the creation of this project.

[game]: http://diegomarquez.github.io/game-builder/Galaga.png
[tirador]: http://www.treintipollo.com/tirador/index.html
[generator]: https://github.com/diegomarquez/generator-game-builder
[yeoman]: http://yeoman.io/
[game-builder]: http://diegomarquez.github.io/game-builder
