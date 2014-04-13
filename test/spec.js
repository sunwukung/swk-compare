describe("swk-compare", function () {

    var expect = require("expect.js"),
        _ = require("lodash"),
        types = [
            false,
            null,
            undefined,
            123,
            1.01,
            "foo",
            { foo: "bar" },
            [1, 2, 3],
            function () { return true; }
        ],
        getScalar = function () {
            return _.reject(types, function (t) {
                return _.isFunction(t) || _.isObject(t) || _.isArray(t);
            });
        },
        compare = require("./../lib/swk-compare.js");


    it("is a module", function () {
        expect(compare).not.to.be(undefined);
    });



    describe("a comparison schema,", function () {

        describe("when generated with a scalar property,", function () {

            it("tests for equality", function () {
                _.each(getScalar(), function (t) {
                    expect(compare(t, t)).to.be(true);
                });
            });

        });

        describe("when generated with a function,", function () {
            var compareator = function (val) {
                return val === "foo";
            };

            it("evaluates the context with the predicate", function () {
                expect(compare("foo", compareator)).to.be(true);
                expect(compare("bar", compareator)).to.be(false);
            });
        });

        describe("when generated with an array", function () {

            it("compares arrays", function () {
                expect(compare([1, 2, 3], [1, 2, 3])).to.be(true);
                expect(compare([2, 3, 4], [1, 2, 3])).to.be(false);
            });

            it("compares nested arrays", function () {
                var sut = [1, 2, 3, ["tom", "dick", "harry"]];
                expect(compare(
                    sut,
                    [1, 2, 3, ["tom", "dick", "harry"]]
                )).to.be(true);

                expect(compare(
                    sut,
                    [1, 2, 3, ["tom", "dick", "barry"]]
                )).to.be(false);
            });

            it("compares arrays of varying data types", function () {
                expect(compare(types, types)).to.be(true);
                expect(compare(types, [
                    false,
                    null,
                    undefined,
                    123,
                    1.01,
                    "foo",
                    {"foo": "bar"},
                    [1, 2, 3],
                    function (f) {
                        // the final element of the types fixture
                        // contains a function that will return true,
                        // this test forces that comparison to break
                        return f() === false;
                    }
                ])).to.be(false);
            });

        });



        describe("when generated with a shallow object with no methods,", function () {

            var schema = {
                foo: "tom",
                bar: "dick",
                baz: "harry"
            };


            it("returns true if object contains same keys and values", function () {
                expect(compare({
                    foo: "tom",
                    bar: "dick",
                    baz: "harry"
                }, schema)).to.be(true);
            });

            it("returns false if object contains less keys", function () {
                expect(compare({
                    foo: "tom",
                    bar: "dick"
                }, schema)).to.be(false);
            });

            it("returns false if object contains different keys", function () {
                expect(compare({
                    foo: "tom",
                    bar: "dick",
                    qux: "harry"
                }, schema)).to.be(false);
            });

            it("returns false if object contains different values", function () {
                expect(compare({
                    foo: "tom",
                    bar: "dick",
                    baz: "larry"
                }, schema)).to.be(false);
            });
        });

        describe("when generated with a deep object with no methods", function () {

            var schema = {
                foo: "tom",
                bar: "dick",
                baz: {
                    quu : "apples",
                    qux : "oranges"
                }
            };

            it("returns true if object contains same keys and values", function () {
                expect(compare({
                    foo: "tom",
                    bar: "dick",
                    baz: {
                        quu : "apples",
                        qux : "oranges"
                    }
                }, schema)).to.be(true);
            });

            it("returns false if object contains less keys", function () {
                expect(compare({
                    foo: "tom",
                    bar: "dick"
                }, schema)).to.be(false);
            });

            it("returns false if object contains different keys", function () {
                expect(compare({
                    foo: "tom",
                    bar: "dick",
                    baz: {
                        quu : "apples",
                        qub : "oranges"
                    }
                }, schema)).to.be(false);
            });

            it("returns false if object contains different values", function () {
                expect(compare({
                    foo: "tom",
                    bar: "dick",
                    baz: {
                        quu : "apples",
                        qux : "bananas"
                    }
                }, schema)).to.be(false);
            });

        });


        // ====================================================
        // THESE TESTS ARE MORE PROOF OF CONCEPT THAN API TESTS
        // ====================================================
        describe("when generated with a nested array of mixed types", function () {

            it("executes appropriate compareation at each level", function () {
                var schema = [
                    types,
                    {
                        foo: "tom",
                        bar: "dick",
                        baz: "harry"
                    }
                ];

                expect(compare(schema, schema)).to.be(true);
                expect(compare([
                    "a",
                    {
                        foo: "sue",
                        bar: "barbara",
                        baz: "wendy"
                    }
                ], schema)).to.be(false);
            });

        });

        describe("when generated with an object containing mixed types", function () {


            it("executes appropriate compareation at each level", function () {
                var schema = {
                    foo : "tom",
                    bar : function (attr) { return attr === "dick"; },
                    baz : [
                        "cats",
                        function (attr) { return attr === "dogs"; },
                        {
                            quu: "lions",
                            qux: function (attr) {
                                return attr === "tigers";
                            }
                        }
                    ],
                    bang : {
                        tik: "apples",
                        tok: function (attr) {
                            return attr === "oranges";
                        }
                    }
                };

                expect(compare({
                    foo: "tom",
                    bar: "dick",
                    baz: [
                        "cats",
                        "dogs",
                        {
                            quu: "lions",
                            qux: "tigers"
                        }
                    ],
                    bang: {
                        tik: "apples",
                        tok: "oranges"
                    }
                }, schema)).to.be(true);

                expect(compare({
                    foo: "tom",
                    bar: "dick",
                    baz: [
                        "cats",
                        "dogs",
                        {
                            quu: "giraffes",
                            qux: "tigers"
                        }
                    ],
                    bang: {
                        tik: "apples",
                        tok: "oranges"
                    }
                }, schema)).to.be(false);

            });
        });


    });


});