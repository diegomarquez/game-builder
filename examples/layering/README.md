[example]: http://diegomarquez.github.io/game/examples/layering/index.html
[bundles]: ../resources/bundles
[bundle]: ../resources/bundles/layering_bundle.js

[css]: ./main.css
[main]: ./main.js
[index]: ./index.html
[bootstrap]: ../src/bootstrap.js

[layers]: ../../src/hierarchy/layers.js
[assembler]: ../../src/pools/assembler.js

[game_object]: ../../src/hierarchy/game_object.js
[renderer]: ../../src/components/rendering/renderer.js
[game_object_container]: ../../src/hierarchy/game_object_container.js

[basic_game_object]: ../resources/basic_game_object.js
[box_renderer]: ../resources/box_renderer.js
[basic_container]: ../resources/basic_container.js

# Use layers to manage drawing order with precision.

#### This example demonstrates the use of layers. In reality it is just a fancy name for the containers of the previous example. The difference being that these are dedicated to help in organizing what gets drawn and when.

#### You can view this [example running][example]

**********
**********
**********

### New things that are happening here

**New Modules used in this example**

[**layers.js**][layers]

**********
**********
**********

[**main.js**][main]

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

The example shows a bunch of the things you can do with the [**layers**][layers] object. What follows are all the possibilities.

```javascript
//Adds a layer with the name 'Front'.
gjs.layers.add('Front');
```

```javascript
//Removes a layer with the name 'Front'. All game objects contained in it 
//are sent back to their respective pools.
gjs.layers.clear('Front');
```

```javascript
//Removes a layer with the name 'Front'. All game objects contained in it 
//are sent back to their respective pools and the seices to exist.
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
//Effectively pausing that layer.
gjs.layers.stop_update('Front');
```

```javascript
//Stop calling draw method on game objects on the 'Front' layer. 
//Effectively making the layer invisible.
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

