import React from 'react';
import PropTypes from 'prop-types';
import './reprodStyle.scss';
import subString from '../../library/util/subString.js';

const propTypes = {

};

const defaultProps = {
};

function getReproductionUrl(
    state,
    type,
    id,
) {
    const articleOutPage = `//c.m.163.com/news/a/${id}.html?spss=newsapp&spsw=1`;
    const articlePcPage = `//dy.163.com/v2/article/detail/${id}.html`;
    const liveOutPage = `http://c.m.163.com/news/l/${id}.html?spss=newsapp&spsw=1`;
    if (type === 'liveList') {
        return liveOutPage;
    } else if (state === 3) {
        return articlePcPage;
    } else if (state === 4 || state === 5) {
        return articleOutPage;
    } else {
        return null;
    }
}

export default function ReprodCard(props) {
    let content;
    const {
        type,
        data,
    } = props;
    const articleMap = [
        '草稿',
        '',
        '审核不通过',
        '已发布',
        '作者下线',
        '管理员下线',
    ];
    const liveMap = [
        '',
        '审核不通过',
        data.isFinish ? '已结束' : '已发布',
        '用户下线',
        '管理员下线',
    ];
    const titleUrl = getReproductionUrl(data.state, type, data.id);
    const title = subString(data.title, 40, '...');
    let finalTitle;
    if (titleUrl) {
        finalTitle = (
            <a href={titleUrl}>{title}</a>
        );
    } else {
        finalTitle = title;
    }
    if (type === 'articleList') {
        content = [
            <span key={0}>{finalTitle}</span>,
            <span key={1}>{data.updateTime}</span>,
            <span key={2}>{articleMap[data.state]}</span>,
        ];
    } else {
        content = [
            <span key={0}>{finalTitle}</span>,
            <span key={1}>{data.startTime}</span>,
            <span key={2}>{data.endTime}</span>,
            <span key={3}>{liveMap[data.state]}</span>,
        ];
    }
    return (
        <div styleName={type === 'articleList' ? 'article-card' : 'live-card'}>
            {content}
        </div>
    );
};

ReprodCard.propTypes = propTypes;
ReprodCard.defaultProps = defaultProps;
