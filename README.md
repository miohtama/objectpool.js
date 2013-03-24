# Introduction

This is a simple object pool for Javascript. It is intended to speed up real-time JavaScript applications, like games, by reusing allocated objects instead of recreating them for garbage collection.

# Benefits

* Pure Javascript

* Does not need modification or support in the allocated object themselves

* Packed for distribution

* Unit tests

* Support and patches on GitHub

# How it works

Allocated objects do not need to have any special properties or features. You simple supply a ``allocator`` function as a parameter to the pool constructor ``Pool(allocator)``
which is responsible to creating new objects on demand.

You can set the initial pool size::

The pool grows by the factor of ``Pool.

The pool will never shrink.

# Support

[File issues on Github](https://github.com/miohtama/objectpool.js/)

# Packing

The module is packed as NPM module and available for browser side consumption via [Browserify](http://browserify.org/)

# Running tests

Example:

    npm install mocha
    node_modules/mocha/bin/mocha

# Limitations

This code is ECMAScript 5 only.

# Background

*

* http://stackoverflow.com/questions/8410667/object-pools-in-high-performance-javascript