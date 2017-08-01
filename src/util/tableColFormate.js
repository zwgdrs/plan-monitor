/**
 * Created by zhangce on 17/7/26.
 */
/*  params:
*   data: 对象
*   dataList: 数组
*   return：string
* */
const formate = (data, dataList) => {
    return (data === void 0 || data === null) ? '-'
        : dataList !== void 0 ? (Array.isArray(dataList) ? findItem(dataList, data) : dataList): data;
}

function findItem(dataArr, val) {
    const result = dataArr.find(item => item.value === val);
    return result !== void 0 ? result.label : val
}

export default formate;
