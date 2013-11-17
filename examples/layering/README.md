[example]: http://diegomarquez.github.io/game/examples/layering/index.html
[bundles]: ../resources/bundles
[bundle]: ../resources/bundles/layering_bundle.js

# Use layers to manage drawing order with precision.

#### A layer is basically a game object container like the ones in the previous example.
#### It is a specialised use case though, since most of the time you won't be moving a layer around.
#### You could do it though, if you really wanted to.

#### You can view this [example running][example]

**********
**********
**********

##### New things that are happening here

* main.js

**********

```javascript
require('layering_bundle').create();  
```

[The bundle file used in this example][bundle]

**********

```javascript
gjs.addToLayer('Front', 'Base_3');
gjs.addToLayer('Middle', 'Base_2');
gjs.addToLayer('Back', 'Base_1');
```

Here you can see how each game object is added to a different layer

**********

The example shows a bunch of the things you can do with the **layers** object. What follows are all the possibilities.

```javascript
//Adds a layer with the name 'Front'.
gjs.layers.add('Front');
```

```javascript
//Removes a layer with the name 'Front'. All game objects contained in it 
are sent back to their respective pools.
gjs.layers.clear('Front');
```

```javascript
//Removes a layer with the name 'Front'. All game objects contained in it 
are sent back to their respective pools and the seices to exist.
gjs.layers.remove('Front');
```

```javascript
//Get the layer with name 'Front'. You can then manipulate it like any other game object.
gjs.layers.get('Front');
```

```javascript
//All game objects in the 'Front' layer will stop update and rendering
gjs.layers.stop('Front');
```

```javascript
//All game objects in the 'Front' layer will resume update and rendering
gjs.layers.resume('Front');
```

```javascript
//Stop calling the update method on game objects on the 'Front' layer. 
Effectively pausing that layer.
gjs.layers.stop_update('Front');
```

```javascript
//Stop calling draw method on game objects on the 'Front' layer. 
Effectively making the layer invisible.
gjs.layers.stop_draw('Front');
```

```javascript
//Resume update on all game objects in the 'Front' layer.
gjs.layers.resume_update('Front');
```

```javascript
//Resume draw on all game objects in the 'Front' layer.
gjs.layers.resume_draw('Front');
```

```javascript
//Resume all activity on the 'Front'  layer
gjs.layers.resume('Front');
```

```javascript
//Clear all layers of game objects
gjs.layers.all('clear');
```
************

```javascript
gjs.layers.all('remove');
```

The **gjs.layers.all** method will apply to all layers. It has two arguments, *'action'* and *'method' In the case above it calls the remove method for every layer. If you were to call it with other arguments, like so:

```javascript
gjs.layers.all('stop', 'update');
```

It would call the stop_update method for all the layers.

