/**
 * actionType.js
 *
 * @Author: jruif
 * @Date: 2017/7/17 下午6:00
 */
import { actionCreator } from '../util/redux-tool';

export const actionType = {
    updateCommon: 'update_common',
    filterMenu: 'filter_menu',
    updateStatistics: 'update_statistics',
    updateNotice: 'update_notice',
    updateMsg: 'update_Message',
    initSubData: 'init_subscribe_data',
    updateContentManager: 'update_content_manager',
    updateReprodManager: 'update_reprod_manager',
    initFetchData: 'init_fetch_data', //内容同步页面
    initContentData: 'init_content_data', //内容同步页面
    initPushData: 'init_push_data', //push中心
    initIndexStarData: 'init_index_star_data', //push中心
    initCommentData: 'init_comment_data', //跟贴
    initLiveData: 'init_live_data', //直播
    initIncomeData: 'init_income_data', //直播
    initAskData: 'init_ask_data', //我的问吧
};
// 常规同步action，异步action可参考'./action-index.js'文件
const action = {};

Object.keys(actionType).forEach(type => {
    action[type] = actionCreator(actionType[type]);
});

export default action;
