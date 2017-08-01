/**
 * index.js
 *
 * @Author: jruif
 * @Date: 2017/7/7 上午10:56
 */

import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducerCreator } from '../util/redux-tool';
import { actionType as type } from './action';
import menu from './reducer-menu';

export default combineReducers({
    routing: routerReducer,
    menu,
    common: reducerCreator({  // 可参考'./common.js'帮助理解
        user: {
            wemediaId: null,
            askBarFlag: false, //问吧权限
            liveRoomFlag: false, //直播权限
            authorityFlag: false, //账号特权权限
            shareIncome: false,//我的收益权限
            fetchFlag: false, //抓取权限
            pushFlag: false, //push 权限
            repostFlag: false, //文章转载权限
            comment: false, //跟帖展示
            hasFunction: false, // 功能
        },
    }, [type.updateCommon]),
    message: reducerCreator({
        list: [],
        unRead: [],
        total: 0,
    }, [type.updateMsg]),
    statistics: reducerCreator({ // 数据统计
        overview: {},    // 总览
    }, [type.updateStatistics]),
    notice: reducerCreator({
        list: [],
        total: 0,
        banner: [],
    }, [type.updateNotice]),
    initSubData: reducerCreator({
        changeData: {},
        sumData: {},
    }, [type.initSubData]),
    contentManager: reducerCreator({
        contentList:  [],
        total: 0,
        word: '',
        contentType: 0,
        stateType: -1,
    }, [type.updateContentManager]),
    reproductionManager: reducerCreator({
        articleList:  [],
        liveList: [],
        total: 0,
        word: '',
        stateType: 'all',
        liveType: 'all',
        articleType: 'all',
    }, [type.updateReprodManager]),
    fetchData: reducerCreator({ //内容同步页面
        tableList: [],
        total: 0,
    }, [type.initFetchData]),
    contentData: reducerCreator({
        articles: {},
        videos: {},
        lives: {},
        singleArticle: {},
        singleVideo: {},
        commentCountList: [],
        pvCountList: 0,
        recommendCountList: [],
        shareCountList: [],
        statDateList: [],
    }, [type.initContentData]),
    pushData: reducerCreator({ //push中心
        tableList: [],
        articleList: [],
        canApply: 1, // 0：不可以申请；1：可以申请
    }, [type.initPushData]),
    indexStarData: reducerCreator({
        indexData: {
            progressData: {},
            chartsData: {},
        },
        starData: {},
    }, [type.initIndexStarData]),
    commentData: reducerCreator({ //push中心
        tableList: [],
        total: 0,
    }, [type.initCommentData]),
    liveData: reducerCreator({ //我的直播
        tableList: [],
        total: 0,
    }, [type.initLiveData]),
    askData: reducerCreator({ //我的问吧
        data: {},
        total: 0,
    }, [type.initAskData]),
    incomeData: reducerCreator({
        changeData: {},
        sumData: {},
    }, [type.initIncomeData]),
});
