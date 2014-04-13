# [GAME-BUILDER][game-builder]

![game][game]

These are some files I decided to extract from a previous javascript project. These should provide all the things a simple arcade game needs. I am talking Asteroids or Galaga simple. 

By itself this repository is kind of useless, as it is nothing more than a collection of requirejs modules. You could try and figure out how to use them, though. 

For better results it is better to use it in conjuction with [generator-game-builder][generator], a [Yeoman][yeoman] generator that generates(dur) the basic setup to start working with this stuff. Or you could just copy/paste stuff like crazy, your call.

-----------------------------------

###### TODO List:

- Annoying tasks
    - Links to explanations of known errors (like requireJS)
        - Single page in the website
            - Reclaimer 
                -Missing game-object id
            - Game Object Pool 
                Game Object can only not be instantiated explicitly because it does not have a maximun amount, hence it can only be a child.
                Game Object is not available
                Configuration group does not exist
            - Component Pool
                Game Object is not available
            - Assembler
                Game object is not a container, can not have children
            - Path Renderer
                Missing width and height of path
            - Collision Component
                Parent Game Object needs to define an OnCollide method
            - Timer Factory
            - Timer
                Can't modify timer
            - State
                - Error in state logic
            - Sound
                - Already loading
                - Sound id already used
            - Font Loader
                - Font could not be loaded
            - Common, must be overriden

    - Consolidate file generation into single file with a single task
        - asset-map.js
        - config.js
        - font-data.js

- Tag
- Deploy Website

- Examples v6 
    - Add feedback about the internals of each example
        - Pooled Objects
        - Active Objects
        - Pooled Sound Channels
        - Active Sound Channels
        - Cached Images
        - Cached Paths
        - Cached Text
        - Loaded Sounds
        - Assigned Channels
    - Module to add that information to all examples

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
