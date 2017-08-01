/**
 * ajax.js
 *
 * @Author: jruif
 * @Date: 2017/7/16 上午2:20
 */

import axios from 'axios';
import { Modal } from '../library';
import extend from 'object-assign';
import { isObject, isFunction } from './isType';
// import stringifyJSON from './stringifyJSON';
import transformRequest from './transformRequest';

// 校验返回结果
const proofResponse = (response) => {
    const rs = response.data;
    const status = {
        '0': () => Promise.reject(response),  //错误失败，业务异常
        '1': () => response, // 成功
        // '100': () => Promise.reject(rs),//参数缺失
        // '101': () => Promise.reject(rs),//参数错误
        '100021': () => {
            response.data = extend(rs, {
                msg: '未获取到登录信息,请点击确定完成登陆',
                url: '/wemedia/login.html?url=',
            });
            return Promise.reject(response);
        },
        // '404': () => Promise.reject(extend(rs, { msg: '未找到相关信息,请重试' })),
        other: () => Promise.reject(rs),
    };
    return rs && (status[rs.code] !== void 0 ? status[rs.code]() : status.other());
};

// 构造axios请求实例
const request = axios.create({
    baseURL: '/wemedia',
    method: 'get',
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
    },
    timeout: 60 * 1000, // 1 min
    responseType: 'json',
    paramsSerializer: params => transformRequest(params),
    transformRequest: [(data) => {
        if (isObject(data)) {
            return transformRequest(data);
        }
        return data;
    }],
    // transformResponse: [(data) => {
    //     return proofResponse(data);
    // }],

});

const ajax = (url, config, done = (...argv) => argv, onFail) => {
    if (isFunction(config)) {
        done = config;
        config = {};
    }

    config.url = url;
    config.params = extend({ _: +(new Date()) }, config.params || {});

    return request.request(config)
        .then(response => proofResponse(response))
        .then(response => {
            return done ? done(response.data) : response;
        })
        .catch((error) => {
            if (onFail) {
                onFail(error);
            }
            if (error.response) {
                // 服务器响应出错
                // 状态码非2xx错误
                console.log(error.response);
                // } else if (error.request) {
                //     // 请求已发送，但未收到响应
                //     // `error.request`是XMLHttpRequest的实例
                //     console.log(error.request);
            } else {
                // 自定义错误
                let data = error.data;
                console.error('Error', error);
                Modal.error({
                    content: (data && data.msg) || error.message || '未知错误！',
                    onClose: (...argv) => {
                        if (data && data.url) {
                            window.location.href = data.url;
                        }
                    },
                });
            }
        });
};

export default ajax;
