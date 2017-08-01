/**
 * isType.js
 *
 * @Author: jruif
 * @Date: 2017/7/6 下午10:28
 */

export const toFirstUpperCase = target => {
    if (typeof target !== 'string') {
        return console.warn('target must be string');
    } else {
        return target.replace(/^\w/, a => a.toUpperCase());
    }
};

const isBaseType = ['string', 'number', 'undefined', 'boolean', 'symbol', 'function'].reduce((result, type) => {
    result[type] = obj => typeof obj === type;
    return result;
}, {});

export const isString = isBaseType.string;
export const isNumber = isBaseType.number;
export const isUndefined = isBaseType.undefined;
export const isBoolean = isBaseType.boolean;
export const isSymbol = isBaseType.symbol;
export const isFunction = isBaseType.function;

export const isObject = obj => Object.prototype.toString.call(obj) === `[object Object]`;

export const isNull = obj => obj === null;

export const hasChildren = (child) => {
    return (
            Array.isArray(child) && child.length > 0
        ) || (
            !isNull(child) &&
            !isUndefined(child)
        );
};

export default  {
    ...isBaseType,
    isObject,
    isNull,
    hasChildren,
};

