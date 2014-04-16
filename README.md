# [GAME-BUILDER][game-builder]

![game][game]

These are some files I decided to extract from a previous javascript project. These should provide all the things a simple arcade game needs. I am talking Asteroids or Galaga simple. 

By itself this repository is kind of useless, as it is nothing more than a collection of requirejs modules. You could try and figure out how to use them, though. 

For better results it is better to use it in conjuction with [generator-game-builder][generator], a [Yeoman][yeoman] generator that generates(dur) the basic setup to start working with this stuff. Or you could just copy/paste stuff like crazy, your call.

-----------------------------------

###### TODO List:

- website error anchors

- Generator Templates to extend path renderer and bitmap-renderer
- Make generator more flexible, be hable to send parent class and dependencies on creation

- Remove grunt and bower from dependencies
    - Examples
    - Seed
    - Generator
    - Add installation instructions in website

- Try out all examples

- Annoying tasks
    - Generate Errors page with mastache template, include all data in a JSON file.
    - Generate links to corresponding documentation (titles and red text) while processing the template.

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
