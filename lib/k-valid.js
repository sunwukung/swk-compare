var clean,
    get,
    iterable,
    isScalar,
    hasType,
    rec,
    scl,
    valid,
    validMap,
    vArr,
    vEql,
    vFun,
    vObj;

clean = function (result) {
    return !_.contains(result, false);
};

get = function (needle, hayStack) {
    return iterable(hayStack) ?
        hayStack[needle] :
        undefined;
};

hasType = function (schema) {
    return _.isFunction(schema)
        ? 'fun'
        : _.isArray(schema)
            ? 'arr'
            : _.isObject(schema)
                ? 'obj'
                : 'scl';
};

isScalar = function (val) {
    return val === val;
};

iterable = function (value) {
    return _.isArray(value) || _.isObject(value);
};

rec = function (schema, context) {
    return clean(_.flatten(_.map(schema, function (scheme, key) {
        return validMap[hasType(scheme)](scheme, get(key, context));
    })));
};

/*
------------------------------------------------
TYPE SPECIFIC VALIDATORS
------------------------------------------------
*/

vEql = function (schema, context) {
    return schema === context;
};

vScl = function (schema, context) {
    return vEql(schema, context);
};

vFun = function (schema, context) {
    return schema(context);
};

vArr = function (schema, context) {
    return rec(schema, context);
};

vObj = function (schema, context) {
    return rec(schema, context);
};

valid = function (data, schema) {
    return validMap[hasType(schema)](schema, data);
};

validMap = {
    fun : vFun,
    arr : vArr,
    obj : vObj,
    scl : vScl
};

module.exports = valid;




