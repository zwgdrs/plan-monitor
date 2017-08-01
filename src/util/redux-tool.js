/**
 * redux-tool.js
 *
 * @Author: jruif
 * @Date: 2017/7/17 下午5:26
 */
import { isString, isUndefined, isNumber, isObject } from './isType';
import getByPath from './getByPath';
import deepCopy from 'deep-extend';

/**
 *
 * @param {string} type
 * @param {array} key
 * @returns function
 */
export const createActionCreator = (type, ...key) => {
    let obj = { type };
    return (...argv) => {
        key.forEach((elm, index) => {
            obj[elm] = argv[index];
        });
        return obj;
    }
};

/**
 * actionCreator
 *
 * @param {string} type
 * @returns function
 */
export const actionCreator = (type) => {
    return createActionCreator(type, 'key', 'value', 'index', 'count');
};

/**
 * reducer构造器
 *
 * @param {boolean} [filter=() => false]
 * @returns {function}
 */
export const updateReducer = (filter = () => false) => {

    let makeupState = (state, action) => {
        let currentPath = getByPath(state, action.key);

        if (isString(action.index)) {
            if (Array.isArray(currentPath.object) && action.index === 'all') {
                // 11
                action.index = [0];
                action.count = currentPath.object.length;
            } else {
                action.index = [action.index];
            }
        } else if (isNumber(action.index)) {
            // 4-7
            action.index = [action.index];
        }

        if (Array.isArray(action.index)) {
            if (isNumber(action.count)) {
                // 8-9
                for (let i = action.index.pop(); i < action.count; i++) {
                    action.index.push(i);
                }
            }

            // 是否定义了action.value是对数据操作的关键
            if (!isUndefined(action.value)) {
                action.index.forEach(val => {
                    // currentValue[val] 存在 => 修改，不存在 => 增加
                    deepCopy(currentPath.object[val], action.value);
                });
            } else {
                // 删除
                currentPath.object = currentPath.object.filter(val => !action.index.includes(val));
            }
        }

        if (isUndefined(action.index)) {
            if (isObject(action.value)) {
                deepCopy(currentPath.object, action.value);
            } else if (Array.isArray(action.value)) {
                // 不能直接赋值，利用引用传值
                currentPath.object.splice(0, currentPath.object.length, ...action.value);
            } else {
                currentPath.object[currentPath.path.slice(-1)[0]] = action.value;
            }
        }

        return state;
    };

    /**
     *
     *
     * @param {object} state
     * @param {object} action
     * @param {array|string|number} action.key
     * @param {any} action.value
     * @param {array|string|number|undefined} action.index
     * @param {number} action.count
     * @returns function
     */
    return (state, { key, value, index, count }) => {
        let newState = deepCopy({}, state);
        /*
         * 接受批量处理
         *
         * update([
         *      {
         *          key: 'other',
         *          value: {totalSize: rs.data.totalSize}
         *      },{
         *          key: 'data',
         *          index: 1,
         *      },{
         *          key: 'data',
         *          value: rs.data.featureList,
         *          index: 0
         *      }
         * ]);
         *
         */
        if (isUndefined(value) && Array.isArray(key)) {
            key.forEach(item => {
                newState = makeupState(newState, item); // {key, value, index, count} = item
            });
        } else {
            newState = makeupState(newState, { key, value, index, count });
        }
        return newState;
    }
};

/*
 *
 * createReducer(initState, {
 *   [actionType.xxx](state,action){
 *       return state;
 *   }
 * });
 *
 * */

// 对reducer进行包装,在同一个文件中的reducer全部包装进一个函数, 判断是否存在
export function reducerCreator(initState = {}, handlers) {
    return (state = initState, action) => {

        if (handlers.hasOwnProperty(action.type)) {
            return handlers[action.type](state, action);
        }

        if (Array.isArray(handlers)) {
            let actionType = handlers.find(val => val === action.type);

            if (actionType) {
                return updateReducer()(state, action);
            }
        }
        return state;
    }
}
