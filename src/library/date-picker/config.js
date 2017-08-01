
const easyToMap = (len) => {
    const mapArray = []
    for(let i = 0; i < len; i++) {
        mapArray.push(i)
    }
    return mapArray
}
const dateConfig = {
    days: ['一','二','三','四','五','六','七'],
    months: ['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
    easyToMap,
}

export default dateConfig