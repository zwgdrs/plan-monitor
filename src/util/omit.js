/**
 * omit.js
 *
 * @Author: jruif
 * @Date: 2017/6/29 下午3:44
 */
import assign from 'object-assign';

function omit(obj, fields) {
    let copy = assign({}, obj);
    if (Array.isArray(fields)) {
        for (let i = 0; i < fields.length; i++) {
            let key = fields[i];
            delete copy[key];
        }
    } else if (fields) {
        Object.keys(obj).forEach((key) => {
            fields(copy[key]) && delete copy[key]
        })
    }
    return copy;
}

export default omit;
