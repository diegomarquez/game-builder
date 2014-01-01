# timers
-------------------

This example will deal with the timer_factory module.
This module exists because Javascript's setTimeout and setInterval methods work... but they are a bit lacking in functionality.

The timer factory gives you a type of object which uses setTimeout under the hood,
it has convenience methods such as pause/resume and a couple of other callbacks. 

The factory in turn keeps track of all timers created and will let you pause,resume or stop
all timers in your application with one method call. Pretty fucking nifty if you ask me!

A [GAME-BUILDER][game-builder] project

[game-builder]: http://diegomarquez.github.io/game-builder