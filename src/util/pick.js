/**
 * pick.js.js
 *
 * @Author: jruif
 * @Date: 2017/7/31 下午7:28
 */
import { isObject, isFunction, isUndefined } from './isType';

const base = (obj, path, predicate) => {
    let result = {};
    if (Array.isArray(path)) {
        for (let i = 0; i < path.length; i++) {
            let key = path[i];
            if ((isFunction(predicate) && predicate(obj[key])) || isUndefined(predicate)) {
                result[key] = obj[key];
            }
        }
    }
    return result;
};

/*
 * let object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * pick(object, ['a', 'c']);
 * // => { 'a': 1, 'c': 3 }
 *
 */
const pick = (obj, path) => {
    return isObject(obj) ? base(obj, path) : {};
};

/*
 * import { isNumber } from './isType';
 * let object = { 'a': 1, 'b': '2', 'c': 3 };
 *
 * pickBy(object, isString);
 * // => { 'a': 1, 'c': 3 }
 *
 */
export const pickBy = (obj, predicate) => {
    const path = Object.keys(obj);
    return isObject(obj) ? base(obj, path, predicate) : {};
};

export default pick;
