/**
 * stringifyJSON.js
 *
 * @Author: jruif
 * @Date: 2017/7/6 下午10:25
 */
import { isObject } from './isType';

function stringifyJSON(obj) {
    let _obj = obj;
    Object.keys(_obj).forEach((key) => {
        let param = _obj[key];
        if (isObject(param) || Array.isArray(param)) {
            param = JSON.stringify(param);
            _obj[key] = param;
        }
    });
    return JSON.stringify(_obj);
}


export default stringifyJSON;
