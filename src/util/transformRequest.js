/**
 * transformRequest.js
 *
 * @Author: jruif
 * @Date: 2017/7/6 下午10:24
 */

function transformRequest(obj) {
    let str = [];
    obj && Object.keys(obj).forEach((key) => {
        str.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    });
    return str.join('&');
}

export default transformRequest;
