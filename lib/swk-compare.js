var _ = require("lodash"),
    actionMap,
    clean,
    get,
    iterable,
    hasType,
    rec,
    scl,
    valid,
    vArr,
    vScl,
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

iterable = function (value) {
    return _.isArray(value) || _.isObject(value);
};

rec = function (schema, context) {
    return clean(_.flatten(_.map(schema, function (scheme, key) {
        return actionMap[hasType(scheme)](scheme, get(key, context));
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

compare = function (data, schema) {
    return actionMap[hasType(schema)](schema, data);
};

actionMap = {
    fun : vFun,
    arr : vArr,
    obj : vObj,
    scl : vScl
};

module.exports = compare;




