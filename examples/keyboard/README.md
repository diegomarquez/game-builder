# keyboard
-------------------

This example will deal with the keyboard module. 
I believe that is pretty self explanatory.

Some notes, the keyboard module will setup some listeners to override standard browser behaviour.
You probably do not want the window to scroll when you press the arrow keys.

There are a bunch of variables set with keycodes, you can find them in the framework's folder in keyboard.js 
It's not all of them, but if you need more than 20 keys for a game... I don't know... maybe you are doing it wrong.

For reasons (I don't want to do it), only the callback for the A key makes something appear on the canvas.
If you want to see the rest of the messages, you can do so on your browser's console. 

If you try to create more game objects than the amount specified when creating the pools,
an error will be thrown, but that escapes the scope of this example.

Another example deals with recycling game objects. If you want to continue pressing 'A'
to create more boxes, refresh the example. Yeah... pretty crud, I know.

A [GAME-BUILDER][game-builder] project

[game-builder]: http://diegomarquez.github.io/game-builder