##表格

###todoList

-[x] 可以根据数据渲染数据
-[x] 支持列表内渲染自定义元素
-[x] 支持左右滑动
-[x] 支持列表可选
-[x] 支持自适应表格

###params

属性 | 说明 | 类型 | 默认值 | 是否可选
-----|-----|-----|--------|-------
columns | 表格设定，包含`title: string类型，标题，非可选`，`key: string类型，键值，非可选`，`style: object类型，样式，可选`三个字段 | object | - | 否
dataSource | 表格渲染的数据 | array类型 | [] | 是
onClickTh | 点击标题触发的回调函数 | 函数类型 | 空函数 | 是
checkBox | 是否显示每行列表的勾选框 | bool类型 | false | 否
longTable | 是否允许x轴滚动 | bool类型 | false | 是  
checkBoxCallback | 表单选择回调函数, 参数 `dots: selectDatas, array类型，选择的行数据` | func类型 | - | 否
allBorder | 是否显示条纹表格，true为显示，false为不显示，，true为显示，false为只显示下边框， | bool类型 | true | 否
stripe | 是否显示条纹表格 | bool类型 | false | 是
isHover | 是否显示鼠标当前所在行的hover背景样式，true为显示，false为不显示， | bool类型 | false | 是
