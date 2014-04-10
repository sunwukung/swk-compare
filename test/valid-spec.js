describe('valid', function() {


    it('is a module', function () {
        expect(valid).not.to.be(undefined);
    });



    describe('a validator,', function () {

        describe('when generated with a scalar property,', function () {

            it('tests for equality', function () {
                _.each(util.getScalar(), function (t) {
                    expect(valid(t, t)).to.be(true);
                });
            });

        });

        describe('when generated with a function,' , function () {
            var validator = function (val) {
                return val === "foo";
            };

            it('evaluates the context with the predicate', function () {
                expect(valid('foo', validator)).to.be(true);
                expect(valid('bar', validator)).to.be(false);
            })
        });

        describe('when generated with an array', function () {
            it('compares the arrays', function () {
                expect(valid([1,2,3], [1,2,3])).to.be(true);
                expect(valid([2,3,4], [1,2,3])).to.be(false);
            });
        });



        describe('when generated with a shallow object with no methods,', function () {

            var schema = {
                foo: 'tom',
                bar: 'dick',
                baz: 'harry'
            };


            it('returns true if object contains same keys and values', function () {
                expect(valid({
                    foo: 'tom',
                    bar: 'dick',
                    baz: 'harry'
                }, schema)).to.be(true);
            });

           it('returns false if object contains less keys', function () {
                expect(valid({
                    foo: 'tom',
                    bar: 'dick'
                }, schema)).to.be(false);
            });

            it('returns false if object contains different keys', function () {
                expect(valid({
                    foo: 'tom',
                    bar: 'dick',
                    qux: 'harry'
                }, schema)).to.be(false);
            });

            it('returns false if object contains different values', function () {
                expect(valid({
                    foo: 'tom',
                    bar: 'dick',
                    baz: 'larry'
                }, schema)).to.be(false);
            });
        });

        describe('when generated with a deep object with no methods', function () {

            var schema = {
                foo: 'tom',
                bar: 'dick',
                baz: {
                    quu : 'apples',
                    qux : 'oranges'
                }
            };

            it('returns true if object contains same keys and values', function () {
                expect(valid({
                    foo: 'tom',
                    bar: 'dick',
                    baz: {
                        quu : 'apples',
                        qux : 'oranges'
                    }
                }, schema)).to.be(true);
            });

            it('returns false if object contains less keys', function () {
                expect(valid({
                    foo: 'tom',
                    bar: 'dick'
                }, schema)).to.be(false);
            });

            it('returns false if object contains different keys', function () {
                expect(valid({
                    foo: 'tom',
                    bar: 'dick',
                    baz: {
                        quu : 'apples',
                        qub : 'oranges'
                    }
                }, schema)).to.be(false);
            });

            it('returns false if object contains different values', function () {
                expect(valid({
                    foo: 'tom',
                    bar: 'dick',
                    baz: {
                        quu : 'apples',
                        qux : 'bananas'
                    }
                }, schema)).to.be(false);
            });

        });

        describe('when generated with an object that contains other types', function () {

            // more a proof of concept than an actual test

            it('executes type specific validation at each level', function () {
                var schema = {
                    foo : 'tom',
                    bar : function (attr) { return attr === 'dick'; },
                    baz : [
                        'cats',
                        function (attr) { return attr === 'dogs'; },
                        {
                            quu: 'lions',
                            qux: function (attr) {
                                return attr === 'tigers';
                            }
                        }
                    ],
                    bang : {
                        tik: 'apples',
                        tok: function (attr) {
                            return attr === 'oranges';
                        }
                    }
                };

                expect(valid({
                    foo: 'tom',
                    bar: 'dick',
                    baz: [
                        'cats',
                        'dogs',
                        {
                            quu: 'lions',
                            qux: 'tigers'
                        }
                    ],
                    bang: {
                        tik: 'apples',
                        tok: 'oranges'
                    }
                }, schema)).to.be(true);

                expect(valid({
                    foo: 'tom',
                    bar: 'dick',
                    baz: [
                        'cats',
                        'dogs',
                        {
                            quu: 'giraffes',
                            qux: 'tigers'
                        }
                    ],
                    bang: {
                        tik: 'apples',
                        tok: 'oranges'
                    }
                }, schema)).to.be(false);

            })
        });


    });


});