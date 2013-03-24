# Introduction

This is a simple object pool for Javascript. It is intended to speed up real-time JavaScript applications, like games, by reusing allocated objects instead of recreating them for garbage collection.

If you are unsure what object pooling is and why it is necessary when writing high performance real-time JavaScript please see *Background* section.

[![browser support](http://ci.testling.com/miohtama/objectpool.js.png)](http://ci.testling.com/miohtama/objectpool.js)

# Benefits

* Pure Javascript

* Does not need modification or support in the allocated object themselves, like inheritance chains

* Packed for distribution, both client-side ([Browserify](http://browserify.org/)) and NodeJS (npm)

* Unit tests with [Mocha](http://visionmedia.github.com/mocha/)

* [Support and patches on GitHub](https://github.com/miohtama/objectpool.js)

# How it works

## Creating pool

Allocated objects do not need to have any special properties or features.

Pool is created by giving it two fuction parameters *allocator()* and *resetor(index, object)*.
*allocator()* will create new objects. You can simply give a JavaScript constructor which does not take parameters,
or a function which calls constructor with default parameters. *resetor()* is called every time pool object is reused
and it is responsible to reset the object state.

Example:

    var Pool = require('objectpool');

    function TestObject(x, y) {
        this.x = x;
        this.y = y;
    }

    // Responsible for allocating empty objects
    function TestObjectAllocator() {
        return new TestObject(undefined, undefined);
    }

    // Called for recycled objects to reset their state
    function TestObjectReset(obj, index) {
        // Our object knows its own index so it can be freed from pool directly
        // However, doing this adds an extra reference on the object
        // which you might want to eliminate when dealing with very large pools of small objects
        obj.poolIndex = index;
    }

    var pool = new Pool(TestObjectAllocator, TestObjectReset);

## Creating objects

Now you can allocate objects from the pool.

    var newObject = pool.create();

## Freeing objects

Objects must be freed by their index number. If your application does not track
the indexes otherwise, you can use the trick above to let the object know its own index.

When you are done with the object you simple give:

    pool.discard(object.poolIndex);

Or if you know object's pool index:

    pool.discard(0);

## Growing the pool

The pool grows 20% every time it's length is exceeded. You can manipulate
growth parameters of pool - see source code for reference.

To see the number of the live objects in pool you can query length property.

    var numOfObjects = pool.length;

# Support

[File issues on Github](https://github.com/miohtama/objectpool.js/)

# Packing

The module is packed as NPM module and available for browser side consumption via [Browserify](http://browserify.org/)

You should get this code simply by:

    npm install objectbool

To use a local copy for the development do:

    git submodule add git://github.com/miohtama/objectpool.js.git external/objectpool.js
    git submodule init
    npm install external/objectpool.js

# Testing

To run testse:

    npm install mocha
    node_modules/mocha/bin/mocha

[See continuos integration status on testling.com](https://ci.testling.com/miohtama/objectpool.js)

# Limitations

This code is ECMAScript 5 only and I am not planning to support old browsers. However, adding polyfills
to support old browsers should not be hard, so patches welcome.

The allocation code is very crude. Currently we do not use any fancy data structures like linked lists or maps to speed up operations.
Expect them to be added in the future when we tune the object pool parameters to match the real-life load.

# Background

* [Garbage collection and object pooling](http://buildnewgames.com/garbage-collector-friendly-code/)

* [Object pools in high performance JavaScript](http://stackoverflow.com/questions/8410667/object-pools-in-high-performance-javascript)

# Author

Mikko Ohtamaa ( [Blog](http://opensourcehacker.com), [Twitter](http://twitter.com/moo9000), [Facebook](https://www.facebook.com/pages/Open-Source-Hacker/181710458567630) )