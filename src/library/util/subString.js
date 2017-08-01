export default function subString(str, limit, suffix) {
    let tmp = str.replace(/([^\x00-\xff])/g, '$1 ');
    if (tmp.length > limit && suffix) {
        tmp = tmp.substr(0, limit - 2) + suffix;
    }
    return tmp.replace(/([^\x00-\xff])\s/g, '$1');
};
