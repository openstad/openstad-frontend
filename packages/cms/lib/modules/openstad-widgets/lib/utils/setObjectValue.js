const setObjectValue = (obj, is, value) => {
    if (typeof is === 'string')
        return setObjectValue(obj, is.split('.'), value);
    else if (is.length === 1 && value!==undefined)
        return obj[is[0]] = value;
    else if (is.length === 0)
        return obj;
    else
        return setObjectValue(obj[is[0]],is.slice(1), value);
};

module.exports = setObjectValue;
