/**
 * omit.js
 *
 * @Author: jruif
 * @Date: 2017/6/29 下午3:44
 */
import assign from 'object-assign';

function omit(obj, fields) {
    let copy = assign({}, obj);
    for (let i = 0; i < fields.length; i++) {
        let key = fields[i];
        delete copy[key];
    }
    return copy;
}

export default omit;
