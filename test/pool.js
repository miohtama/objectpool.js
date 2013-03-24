
// http://nodejs.org/api/assert.html
var assert = require('assert');

var Pool = require('../');


describe('pool', function () {

    "use strict";

    function TestObject(x, y) {
        this.x = x;
        this.y = y;
    }

    // Shuffles list in-place
    // http://dtm.livejournal.com/38725.html
    function shuffle(list) {
      var i, j, t;
      for (i = 1; i < list.length; i++) {
        j = Math.floor(Math.random()*(1+i));  // choose j in [0..i]
        if (j != i) {
          t = list[i];                        // swap list[i] and list[j]
          list[i] = list[j];
          list[j] = t;
        }
      }
    }

    // Responsible for allocating empty objects
    function TestObjectAllocator() {
        return new TestObject("garbage", "garbage");
    }

    // Called for recycled objects to reset their state
    function TestObjectReset(obj, index) {
        obj.x = undefined;
        obj.y = undefined;

        // Our object knows its own index so it can be freed from pool directly
        // However, doing this adds an extra reference on the object
        // which you might want to eliminate when dealing with very large pools of small objects
        obj.poolIndex = index;
    }

    it('should create empty pool by default', function (done) {

        var pool = new Pool(TestObjectAllocator, TestObjectReset);
        assert.equal(pool.length, 0);

        done();

    });

    it('should allocate empty objects filled in by allocator function', function (done) {

        var pool = new Pool(TestObjectAllocator, TestObjectReset);

        var object = pool.create();

        assert.ok(object.hasOwnProperty("x"));
        assert.equal(object.x, undefined);

        done();
    });


    it('should free objects', function (done) {

        var pool = new Pool(TestObjectAllocator, TestObjectReset);

        var object = pool.create();

        assert.equal(pool.length, 1);

        pool.discard(object.poolIndex);

        assert.equal(pool.length, 0);

        done();
    });

    it('should not allow double free', function (done) {

        var pool = new Pool(TestObjectAllocator, TestObjectReset);

        var object = pool.create();
        pool.discard(0);

        assert.throws(function() {
            pool.discard(0);
        }, Pool.PoolAllocationError);

        done();
    });


    it('should grow and discard gracefully', function (done) {

        var pool = new Pool(TestObjectAllocator, TestObjectReset);
        var myobjects = [];
        var i, object;

        // Fill pool
        for(i=0; i<1000; i++) {
            object = pool.create();
            assert.equal(pool.length, i+1);
            myobjects.push(object);
        }

        // Do flush in random order for little bit more stress
        shuffle(myobjects);

        // Flush pool
        for(i=999; i>0; i--) {
            object = myobjects.pop();
            pool.discard(object.poolIndex);
            assert.equal(pool.length, i);
        }

        done();
    });


});
