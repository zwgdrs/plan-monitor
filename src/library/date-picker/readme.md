日期时间组件
===========

## demo

```js
const datePicker = {
    type: 'date', // 组件类型
    placeholder: '说点啥好', // 占位内容
    format: 'YYYY-MM-DD HH:mm:ss', // 时间格式
    defaultValue: '2017-07-01 00:00:00', // 类型为date的默认时间
    beginDateValue: '2017-07-01 00:00:00', // 类型为date-range的默认开始时间
    endDateValue: '2017-07-01 00:00:00', // 类型为date-range的默认结束时间
    onChange: (time) => console.log(time), // 时间改变之后的回调
    selectType: 'select-day', // 显示类型
    readOnly: true, // 是否只读，不可输入
    // disabled: true, // 是否禁用，禁用则input不可改变
    showTime: true, // 是否可以显示时间面板
}
``` 

## params

属性 | 说明 | 类型 | 默认值 | 是否可选
-----|-----|-----|--------|-------
type | 设置组件类型，包含，`date:单个日期时间组件`，`date-range:时间日期范围选择组件`两个字段 | string | date | 是
placeholder | 占位符 | string | - | 是
format | 时间格式,参考moment.js | string | YYYY-MM-DD | 是
defaultValue | 类型为date时的默认时间 | string | moment().format('YYYY-MM-DD') | 是
beginDateValue | 类型为date-range的默认开始时间 | string | moment().format('YYYY-MM-DD') | 是  
endDateValue | 类型为date-range的默认结束时间 | string | moment().format('YYYY-MM-DD') | 是
onChange | 改变时间之后的回调 | func | (obj) => console.log(obj) | 是
selectType | 显示类型,包含`select-day:选择天`，`select-month:选择月份`，`select-year:选择年` | string | 'select-day' | 是
readOnly | 是否只读 | bool | true | 是
showTime | 是否显示时间面板 | bool | true | 是