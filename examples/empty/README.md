[example]: http://diegomarquez.github.io/game/examples/empty/index.html

[css]: ./main.css
[main]: ./main.js
[index]: ./index.html
[bootstrap]: ../../src/bootstrap.js

# The empty example

#### There isn't much of anything going on in here. Basically just what an empty project would look like.

**********
**********
**********

##### New things that are happening here

[**main.css**][css]

Nothing of mention in this file, and nothing of mention about it in any other example.

**********
**********
**********

[**index.html**][index]

There aren't that many things in index.html. 
The file has enough comments on everything that is going on.
Go take a look if you are interested.

**********
**********
**********

[**main.js**][main]

This is your applications main entry point. It's a requirejs module that executes a function when loaded. In that function you should put your apps initialization code. In this case the following. 

```javascript
gjs.game.on("init", this, function() {
	console.log("Hi!")
});	
```

The only thing going on in here is a callback attached to the 'init' event of the **gjs global** **game** property. The **gjs global** has several useful properties which will start to creep up as the examples continue. It is defined in [**bootstrap.js**][bootstrap]
