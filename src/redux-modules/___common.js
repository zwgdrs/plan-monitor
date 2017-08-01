/**
 * common.js
 *
 * @Author: jruif
 * @Date: 2017/7/17 下午5:52
 */

// 废弃文件，暂时保留，帮助理解reducer.js文件写法
//
import { actionType as type } from './action';
import { reducerCreator, updateReducer } from '../util/redux-tool';

// 全局通用初始数据
const initState = {
    user: {},
    menu: [],
};

export default reducerCreator(initState, {
    [type.updateUser]: updateReducer(),
});
