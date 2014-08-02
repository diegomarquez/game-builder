# [GAME-BUILDER][game-builder]

![game][game]

These are some files I decided to extract from a previous javascript project. These should provide all the things a simple arcade game needs. I am talking Asteroids or Galaga simple. 

By itself this repository is kind of useless, as it is nothing more than a collection of requirejs modules. You could try and figure out how to use them, though. 

For better results it is better to use it in conjuction with [generator-game-builder][generator], a [Yeoman][yeoman] generator that generates(dur) the basic setup to start working with this stuff. Or you could just copy/paste stuff like crazy, your call.

-----------------------------------

###### TODO List:

- Consider root as a stand alone object, so that gb does not have to load game-object during initialization
- Add alpha to matrix_3x3.js    

- Update main.js template in generator
- Update renderer.js template in generator

- Shared Renderers and components. Share logic which does not need to keep state.
- Different renderers on different viewports
- Add matrix transformation to viewport layers before drawing game objects

- Try out examples, Build docs, tag, deploy website

- Do a simple game and get this over with for fucks sake!
    - Something like Galaga, with a boss.

### [This is the prototype game][tirador] which spurred the creation of this project.

[game]: http://diegomarquez.github.io/game-builder/Galaga.png
[tirador]: http://www.treintipollo.com/tirador/index.html
[generator]: https://github.com/diegomarquez/generator-game-builder
[yeoman]: http://yeoman.io/
[game-builder]: http://diegomarquez.github.io/game-builder
