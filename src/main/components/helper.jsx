/**
 * Created by zhangce on 17/7/26.
 */
import React from 'react';
import { Icon } from '../../library';

const NoResult = () =>{
    return (
        <div className="no-result-init">
            <span>暂无数据</span>
        </div>
    );
};

const Loading = () => {
    return (
        <div className="loading-box"><Icon type="loading" /><span>载入中...</span></div>
    );
};
function SearchNoResult() {
    return (
        <div className="no-result-card">
            没有相关搜索结果，请重新输入关键词内容
        </div>
    );
}
export {
    NoResult,
    Loading,
    SearchNoResult,
};
