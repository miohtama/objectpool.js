/* jshint globalstrict: true, es5: true */

/* global module */

// Used this as a skeleton
// https://github.com/substack/mocha-testling-ci-example/tree/master/test

"use strict";

/**
 * PoolAllocationError is thrown when pool goes to bad state.
 */
function PoolAllocationError(message) {
    this.message = message;
}

PoolAllocationError.prototype = Object.create(Error);

/**
 * Generic object pool for Javascript.
 *
 * @param {Function} allocator return new empty elements
 *
 * @param {Function} resetor resetor(obj, index) is called on all new elements when they are (re)allocated from pool.
 *                   This is mostly useful for making object to track its own pool index.
 */
function Pool(allocator, resetor) {
    // Start with one element
    this.allocator = allocator;
    this.resetor = resetor;
    // Set initial state of 1 object
    this.elems[0] = this.allocator();
    this.freeElems = [0];
}

Pool.PoolAllocationError = PoolAllocationError;

Pool.prototype = {

    /** How fast we grow */
    expandFactor : 0.2,

    /** Minimum number of items we grow */
    expandMinUnits : 16,

    elems : [],

    /** List of discarded element indexes in our this.elems pool */
    freeElems : [],

    /**
     * @return {[type]} [description]
     */
    create : function() {

        if(!this.freeElems.length) {
            this.expand();
        }

        // See if we have any allocated elements to reuse
        var index = this.freeElems.pop();
        var elem = this.elems[index];
        this.resetor(elem, index);
        return elem;

    },

    /**
     * How many allocated units we have
     *
     * @type {Number}
     */
    get length() {
        return this.elems.length - this.freeElems.length;
    },

    /**
     * Make pool bigger by the default growth parameters.
     *
     */
    expand : function() {

        var oldSize = this.elems.length;

        var growth = Math.ceil(this.elems.length * this.expandFactor);

        if(growth < this.expandMinUnits) {
            growth = this.expandMinUnits;
        }

        this.elems.length = this.elems.length + growth;

        for(var i=oldSize; i<this.elems.length; i++) {
            this.elems[i] = this.allocator();
            this.freeElems.push(i);
        }
    },

    /**
     * Deallocate object at index n
     *
     * @param  {Number} n
     * @return {Object} discarded object
     */
    discard : function(n) {

        // Cannot double deallocate
        if(this.freeElems.indexOf(n) >= 0) {
            throw new PoolAllocationError("Double-free for element index " + n);
        }

        this.freeElems.push(n);
    },

    /**
     * Return object at pool index n
     */
    get : function(n) {
        return this.elems[n];
    }


};

module.exports = Pool;

