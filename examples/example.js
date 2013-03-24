var Pool = require('objectpool');

(function() {

    "use strict";

    function MyObject() {
    }

    function MyObjectFactory() {
        return new MyObject();
    }

    function MyObjectReset() {
    }

    var pool = new Pool(MyObjectFactory, MyObjectReset);

    var obj1 = pool.create();
    var obj2 = pool.create();

    console.log("Pool live size:" + pool.length);

})();