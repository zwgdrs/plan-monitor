import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import './contentStyle.scss';
import subString from '../../library/util/subString';
import getUrl from '../../util/getUrl';
import omit from '../../util/omit';
import { Button, Tooltip } from '../../library';

const propTypes = {

};

const defaultProps = {
    title: PropTypes.string,
};

export default class ArticleCard extends PureComponent{
    state = {
        offlineIsOpen: false,
        topIsOpen: false,
    };

    componentWillMount() {
        this.setState({
            contentState: this.props.content.contentState,
        });
    }

    componentWillReceiveProps(newProps) {
        if (newProps.content.contentState !== this.props.content.contentState) {
            this.setState({
                contentState: newProps.content.contentState,
            });
        }
    }

    componentWillUnmount() {
        this.setState({
            topIsOpen: false,
            offlineIsOpen: false,
        });
    }

    onOpenOffline = () => {
        this.setState({
            offlineIsOpen: true,
            topIsOpen: false,
        });
    };
    onCloseOffline = () => {
        this.setState({
            offlineIsOpen: false,
        });
    };
    onOpenSetTop = () => {
        this.setState({
            topIsOpen: true,
            offlineIsOpen: false,
        });
    };
    onCloseSetTop = () => {
        this.setState({
            topIsOpen: false,
        });
    };

    onConfirmSetTop = () => {
        const {
            onChangeTopState,
            articleId,
            skipId,
            skipTopicId,
        } = this.props.content;
        onChangeTopState(omit({
            topArticleId: articleId,
            skipId,
            skipTopicId,
        }, val => !val));
        this.onCloseSetTop();
    }

    onConfirmCancelTop = () => {
        const {
            articleId,
            onChangeTopState,
        } = this.props.content;
        onChangeTopState({
            calTopArticleId: articleId,
        });
    }

    onConfirmOnline = (online) => {
        const {
            index,
        } = this.props;
        return () => {
            const {
                onChangeOnline,
                contentType,
                articleId,
            } = this.props.content;
            onChangeOnline({
                contentType,
                articleId,
                operation: online ? 'online' : 'offline',
            }, index);
        };
    }

    getUrl() {
        const {
            content,
        } = this.props;
        const {
            articleId,
            skipId,
            skipTopicId,
            title,
            contentType,
        } = content;
        const {
            contentState,
        } = this.state;
        const titleWord = subString(title, 68, '...');
        const url = getUrl(contentState, contentType, articleId, skipId, skipTopicId);
        if (url) {
            return (
                <a href={url}>
                    {titleWord}
                </a>
            )
        } else {
            return titleWord;
        }
    }

    render() {
        const {
            hasTop,
            content,
        } = this.props;
        const {
            offlineIsOpen,
            topIsOpen,
            contentState,
        } = this.state;
        const {
            articleId,
            skipId,
            skipTopicId,
            isTop,
            showTime,
            recommendCount,
            pvCount,
            shareCount,
            contentType,
            originalState,
            picUrl,
        } = content;
        function getAction(actionName, isOpen, onConfirm, onCancel, tip) {
            return (
              <Tooltip
                  styleName="tip"
                  isOpen={isOpen}
                  key={actionName.props.children}
                  position="bottomRight"
                  content={actionName}
                  trigger="click"
                  title="">
                  <p>{tip}</p>
                  <p>
                      <Button size="small" styleName="tip-btn" type="primary" onClick={onConfirm}>确定</Button>
                      <Button size="small" styleName="tip-btn" onClick={onCancel}>取消</Button>
                  </p>
              </Tooltip>
            );
        };
        const editUrl = [
            `/wemedia/article/editpage/${articleId}.html`,
            `/wemedia/video/editpage/${skipTopicId}?videoId=${skipId}&option=edit`,
            `/wemedia/photoset/editpage.html?articleId=${articleId}`,
        ];
        const edit = <a href={editUrl[contentType - 1]} key="edit">编辑</a>;
        const online = <button key="online" onClick={this.onConfirmOnline(true)}>上线</button>;
        const offline = getAction(
            <button onClick={this.onOpenOffline}>下线</button>,
            offlineIsOpen,
            this.onConfirmOnline(false),
            this.onCloseOffline,
            '确定要撤回该文章吗？',
        );
        const setTop = hasTop ? getAction(
            <button onClick={this.onOpenSetTop}>置顶</button>,
            topIsOpen,
            this.onConfirmSetTop,
            this.onCloseSetTop,
            '只能置顶一篇文章，是否替换现有置顶文章？',
        ) : <button key="setTop" onClick={this.onConfirmSetTop}>置顶</button>;
        const cancelTop = <button key="cancelTop" onClick={this.onConfirmCancelTop}>取消置顶</button>;
        const topBtn = isTop ? cancelTop : setTop;
        const stateMap = [
            '草稿',
            '审核中',
            '未通过',
            '已发布',
            '处理失败',
            '管理员下线',
            '已下线',
            '待发布',
        ];
        const actionMap = [
            [edit, online],
            [],
            [edit],
            [offline, topBtn],
            [edit],
            [],
            [edit, online],
            [edit, online],
        ];
        const stateTag = (
            <span styleName="state-tag">{stateMap[contentState]}</span>
        );
        const originalTag = (
            <span styleName="original-tag">原创</span>
        );
        const topTag = (
            <div styleName="top-tag">
                <span>置顶</span>
            </div>
        );
        const playIcon = (
            <div styleName="play">
                <div styleName="triangle">
                    <div styleName="small-triangle" />
                </div>
            </div>
        );
        return (
            <div styleName="article-card">
                {isTop ? topTag : null}
                <div
                    styleName="cover">
                    {contentType === 3 && <div styleName="gallery-tag">图集</div>}
                    {contentType === 2 && playIcon}
                    <img
                        alt="封面"
                        src={picUrl || 'http://dingyue.nosdn.127.net/V9JXP9Z7=WGjCjplfdLjuLvPPKMo6ne8R=qLtp3T3ijSv1478571785436.png'}/>
                </div>
                <div styleName="actions">
                    {actionMap[contentState]}
                </div>
                <div
                    styleName="card-title">
                    <span>{this.getUrl()}</span>
                    {originalState && originalTag || null}
                    {contentState > -1 && stateTag}
                </div>
                <div styleName="data">
                    {`${showTime} | 推荐:${recommendCount} | 阅读:${pvCount} | 分享:${shareCount}`}
                </div>
            </div>
        );
    }
};

ArticleCard.propTypes = propTypes;
ArticleCard.defaultProps = defaultProps;
