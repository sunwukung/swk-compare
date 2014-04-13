## swk-compare

### Description
A simple library to assist with validating data by comparing it to an expectation

### How To Use

    var similair = compare(myValue, myExpectation);

**myValue** in the example above can be any of the following:

* a scalar value (i.e. integer, string, boolean)
* an array
* an object
* a function

**myExpectation** can contain the same

The comparison uses `like for like`:

    var similar = compare("a", "a"); // true
    var similar = compare("a", "b"); // false

or it can use a validation function:

    var similar = compare("a", function (context) {
        return context === "a");
    });// true

The comparison is recursive, so it will work with deeply nested structures

    var similar = compare(
        [1, 2, 3, {"foo": {"bar": {"baz": function () { return true; }}}}],
        [1, 2, 3, {"foo": {"bar": {"baz": function (f) { return f() === true; }}}}]
    ); // true
