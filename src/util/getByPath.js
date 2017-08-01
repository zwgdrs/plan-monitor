/**
 * getByPath.js
 *
 * @Author: jruif
 * @Date: 2017/7/17 下午5:27
 */

import { isString, isSymbol, isNumber, isObject } from './isType';

/**
 * 如果value不是一个string或symbol，则转化为string
 *
 * @param {any} value
 * @returns {string|symbol}
 */
export const toKey = (value) => {
    if (isString(value) || isSymbol(value)) {
        return value;
    }
    const result = (value + '');
    return (result === '0' && (1 / value) === -Infinity) ? '-0' : result;
};

const getByPath = (object, path) => {
    let index = 0;
    let len;
    if (isString(path)) {
        path = path.split(/[\s,.]+/g);
    } else if (isNumber(path)) {
        path = [path];
    }

    if (!Array.isArray(path)) {
        throw new Error('The types of path must be a string or a number or an array ');
    }
    len = path.length;
    while (object !== null && index < len) {
        let current = object[toKey(path[index++])];
        if (isObject(current) || Array.isArray(current)) {
            object = current;
        } else {
            break;
        }
    }
    return {
        object,
        path,
    };
};

export default getByPath;
