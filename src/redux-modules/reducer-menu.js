/**
 * menuStone.js
 *
 * @Author: jruif
 * @Date: 2017/7/21 下午12:29
 */

import { actionType as type } from './action';
import { reducerCreator } from '../util/redux-tool';
import deepCopy from 'deep-extend';
import { isString, isUndefined } from '../util/isType';

export const initMenu = [
    {
        name: "首页",
        id: "index",
        icon: "home",
        url: "/index",
    }, {
        name: "发布",
        id: "edit",
        icon: "edit",
        url: "/wemedia/article/postpage/$wemediaId",
        target: '_self',
    }, {
        name: "计划控制",
        id: "plan-monitor",
        icon: "home",
        submenu: [{
            name: "个人中心",
            id: "my-center",
            icon: "home",
            url: "/my-center",
        },{
            name: "制定计划",
            id: 'make-plan',
            icon: "home",
            url: "/make-plan",
        }],
    },{
        name: "管理",
        id: 'manage',
        icon: "file",
        submenu: [{
            name: "内容管理",
            id: "content",
            url: "/manager",
        }, {
            name: "内容同步",
            id: "fetch",
            url: "/fetch",
            flag: 'fetchFlag',
            new: true, //menu 小红点提示
        },/* {
            name: "素材管理",
            id: "material",
            url: "#",
        },*/ {
            name: "我的转载",
            id: "reproduction",
            url: "/reproduction",
        }],
    }, {
        name: "数据",
        id: "stat",
        icon: "chart",
        submenu: [{
            name: "订阅数据",
            id: "subscriptionData",
            url: "/subscribe-data",
            new: true,
        }, {
            name: "内容数据",
            id: "contentData",
            url: "/content-data",
            new: true,
        }, {
            name: "指数星级",
            id: "index-starLevel",
            url: "/index-starLevel",
            new: true,
        }],
    }, {
        name: "收益",
        id: "income",
        icon: "income",
        submenu: [{
            name: '收益统计',
            id: 'incomeStat',
            url: "/income-stat",
            new: true,
        }, {
            name: "收益结算",
            id: "account",
            url: "/wemedia/profit/incomePage.html",
            target: '_self',
        }],
    }, {
        name: "功能",
        id: 'function',
        icon: "function",
        flag: 'hasFunction',
        submenu: [{
            name: "跟贴管理",
            id: "tie",
            url: "/comment",
            flag: 'comment',
            new: true, //menu 小红点提示
        }, {
            name: "push中心",
            id: "push",
            url: "/push",
            flag: 'pushFlag',
            new: true, //menu 小红点提示
        }, {
            name: "我的直播",
            id: "live",
            url: "/live",
            flag: 'liveRoomFlag',
            new: true, //menu 小红点提示
        }, {
            name: "我的问吧",
            id: "askBar",
            url: "/askbar",
            flag: 'askBarFlag',
            new: true, //menu 小红点提示
        }],
    }, {
        name: "设置",
        id: 'setting',
        icon: "setting",
        submenu: [{
            name: "帐号信息",
            id: "mediainfo",
            url: "/wemedia/info.html",
            target: '_self',
        }, {
            name: "帐号特权",
            id: "privilege",
            url: "/wemedia/authority.html",
            flag: 'authorityFlag',
            target: '_self',
        }, {
            name: "自定义主页",
            id: "customTab",
            url: "/wemedia/customize/tab.html",
            target: '_self',
            flag: 'customTab',
        }],
    },
];

const hasRole = (flag, props) => {
    if (isString(flag)) {
        if (flag === 'hasFunction') {
            return !!(props.comment | props.pushFlag | props.liveRoomFlag | props.askBarFlag);
        }
        if(flag === 'customTab'){
            return props.accountType === 4; // 企业号
        }
        return props[flag];
    } else {
        return true;
    }
};

export default reducerCreator([], {
    [type.filterMenu]: (state, action) => {
        return [...initMenu].map(item => {
            const newItem = deepCopy({}, item);
            let result = true;
            if (isString(newItem.flag)) {
                result = hasRole(newItem.flag, action.value);
            }

            if (result && newItem.submenu && newItem.submenu.length > 0) {
                newItem.submenu = newItem.submenu.map(sub => {
                    const newSub = deepCopy({}, sub);
                    let subResult = true;
                    if (isString(newSub.flag)) {
                        subResult = hasRole(newSub.flag, action.value);
                    }

                    return subResult ? newSub : undefined;
                }).filter(item => !isUndefined(item));
            }

            return result ? newItem : undefined;
        }).filter(item => !isUndefined(item));
    },
});
