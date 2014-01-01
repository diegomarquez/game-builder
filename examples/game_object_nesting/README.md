# game-object-nesting
-------------------

This example will be using a game object container. You can add other game objects as childs to these, and they will follow their parent everywhere using matrix transformations I do not fully understand. God bless them. 

The childs of a container are drawn on top of it in the order they were added.

### Acknowledgments:

I give thanks to the team behind [Easel.js][easeljs], because I shamelessly copy pasted their implementation of a 3x3 Matrix into my own code.

I also thank [these guys][matrix] for figuring out the whole mess in the first place.

A [GAME-BUILDER][game-builder] project

[game-builder]: http://diegomarquez.github.io/game-builder
[matrix]:http://mathworld.wolfram.com/Matrix.html
[easeljs]:http://www.createjs.com/#!/EaselJS
