轮播图组件
================

### demo

```

imgList: [
    {index: 1, img: 'http://img.6497.com/picture/2011041549999338.jpg', alt: 'banner'},
    {index: 2, img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcb6cGz3b7hWjgKzHR4lwwen79kPxcwaGVFHu8Y49YkoZJBPQn', alt: 'banner'},
    {index: 3, img: 'http://img2.imgtn.bdimg.com/it/u=2162793415,1151911813&fm=26&gp=0.jpg', alt: 'banner'},
    {index: 4, img: 'http://b.zol-img.com.cn/desk/bizhi/image/5/960x600/1403767656740.jpg', alt: 'banner'},
    {index: 5, img: 'http://t1.niutuku.com/960/46/46-419109.jpg', alt: 'banner'},
],
imgWidth: 640,
imgHeight: 400,
unit: 10,
time: 500,
interval: 3000,
dots: 'dots',
arrow: true,
// autoPlay: true,

```
### params

属性 | 说明 | 类型 | 默认值 | 是否可选
-----|-----|-----|--------|-------
imgList | 设置轮播图资源，包含，`img:链接`，`alt:图片说明`三个字段 | object | - | 否
imgWidth | 图片宽度 | number | - | 否
imgHeight | 图片高度 | number | - | 否
time | 设置过渡一帧的动画时间 | number | 500 | 是
interval | 设置过渡每帧的之间的间隔时间 | number | 3000 | 是  
dots | 设置显示的下方按钮类型, 可选值为 `dots: 原点类型`，`smallImg: 缩略图类型` | string | dots | 是
arrow | 设置显示的左右两侧箭头按钮类型 | bool | true | 是
autoPlay | 是否自动播放，true为自动播放，false为不自动播放 | boolean | false | 是

