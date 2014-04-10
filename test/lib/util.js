var util = (function (util) {

    util.types = [
        false,
        null,
        undefined,
        123,
        1.01,
        'foo',
        { foo: 'bar' },
        [1,2,3],
        function () {return true;}
    ];

    util.exclude = function (type) {
        var method = 'is'.concat(type[0].toUpperCase(), type.slice(1).toLowerCase());
        return _.filter(util.types, function (t) {
            return !_[method](t);
        });
    };

    util.getScalar = function () {
        return _.reject(util.types, function (t) {
            return _.isFunction(t) || _.isObject(t) || _.isArray(t);
        });
    }

    util.getAsyncFsm = function (fsmFactory, async) {
        return util.getFsm(fsmFactory, function (stateSpec) {
            stateSpec.states.foo = {
              paths: {
                bar: {
                  async: async
                }
              }
            };
            return stateSpec;
        });
    };

    util.getBaseSpec = function () {
        return {
            initial: 'foo',
            states: {
              foo: {},
              bar: {}
            }
        };
    };

    util.getFsm = function (fsmFactory, fn) {
        var stateSpec = util.getBaseSpec();
        if (_.isFunction(fn)) {
          // enable user to pass in arbitrary specification requirements
          stateSpec = fn(stateSpec);
        }
        return fsmFactory.build({msg: 'foo'}, stateSpec);
    };


    return util;


}(util || {}));