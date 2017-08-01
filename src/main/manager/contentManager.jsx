/**
 * ContentManager.jsx
 *
 * @Author: wangyinan
 * @Date: 2017/7/18 下午5:40
 */

import React from 'react';
// import PropTypes from 'prop-types';
import action from '../../redux-modules/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import ajax from '../../util/ajax';
import { Button, Input, DropDownMenu, MenuItem, Pagination } from '../../library';
import ArticleCard from './articleCard';
import { SearchNoResult, NoResult, Loading } from '../components/helper';
import './contentStyle.scss';

const URLs = {
    list: '/content/manage/list.do',
    online: '/content/manage/oper.do',
    top: '/content/manage/changeTopState.do',
};

class ContentManager extends React.PureComponent {
    static propTypes = {};

    static defaultProps = {
        contentList: [],
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            firstSearch: true,
            size: 10,
            currentPage: 1,
            word: '',
            contentType: 0,
            stateType: -1,
            loading: false,
        }
    }

    componentWillMount() {
        this.getContentList();
    }

    onPageChange = (number) => {
        const {
            word,
            contentType,
            stateType,
        } = this.props;
        this.setState({
            currentPage: number,
            word,
            contentType,
            stateType,
        }, () => {
            this.getContentList();
        });
    };

    getContentList = (isSearch = false) => {
        const {
            size,
            currentPage,
        } = this.state;
        let stateType, contentType, word;
        if (isSearch) {
            word = this.state.word;
            stateType = this.state.stateType;
            contentType = this.state.contentType;
        } else {
            word = this.props.word;
            stateType = this.props.stateType;
            contentType = this.props.contentType;
        }
        const {
            updateContentManager,
            wemediaId,
        } = this.props;
        this.setState({
            loading: true,
        });
        const data =  {
            wemediaId,
            pageNo: isSearch ? 1 : currentPage,
            contentState: stateType,
            size,
            word,
            contentType,
        };
        if (!word) {
            delete data.word;
        }
        ajax(URLs.list, {
            method: 'post',
            data,
        }, rs => {
            if (rs.data) {
                updateContentManager([
                    {key: 'contentList', value: rs.data.list},
                    {key: 'total', value: rs.data.total},
                ]);
            }
            return rs;
        }).then(() => {
            this.setState({
                loading: false,
            });
            updateContentManager([
                {key: 'stateType', value: stateType},
                {key: 'contentType', value: contentType},
                {key: 'word', value: word},
            ]);
        });
    };

    onContentTypeChange = (e, key, value) => {
        this.setState({
            contentType: value,
        });
    };

    onStateTypeChange = (e, key, value) => {
        this.setState({
            stateType: value,
        });
    };

    onInput = e => {
        this.setState({
            word: e.target.value,
        });
    }

    onSearch = () => {
        this.setState({
            currentPage: 1,
            firstSearch: false,
        }, () => this.getContentList(true));
    };

    onChangeTopState = (params) => {
        const {
            updateContentManager,
            wemediaId,
        } = this.props;
        this.setState({
            loading: true,
        });
        return ajax(URLs.top, {
            method: 'post',
            data: {
                ...params,
                wemediaId,
            },
        }, rs => {
            if (rs && rs.data) {
                updateContentManager([
                    {key: 'contentList', value: rs.data.list},
                ]);
            }
            return rs;
        }).then(() => {
            this.setState({
                currentPage: 1,
                contentType: 0,
                stateType: -1,
                loading: false,
            });
            updateContentManager([
                {key: 'stateType', value: -1},
                {key: 'contentType', value: 0},
                {key: 'word', value: ''},
            ]);
        });
    }

    onChangeOnline = (params, index) => {
        const {
            wemediaId,
            contentList,
            updateContentManager,
        } = this.props;
        this.setState({
            loading: true,
        });

        contentList[index].contentState = params.operation === 'online' ? 1 : 7;
        return ajax(URLs.online, {
            method: 'post',
            data: {
                ...params,
                wemediaId,
            },
        }, () => {
            updateContentManager([
                {key: 'contentList', value: [...contentList]},
            ]);
        }).then(() => {
            this.setState({
                loading: false,
            });
        });
    }

    render() {
        const {
            size,
            currentPage,
            contentType,
            stateType,
            loading,
            firstSearch,
        } = this.state;
        const {
            contentList,
            total,
        } = this.props;
        const contentTypes = [{
            value: 0,
            name: '全部类型',
        }, {
            value: 1,
            name: '文章',
        }, {
            value: 3,
            name: '图集',
        }, {
            value: 2,
            name: '视频',
        }];
        const stateTypes = [{
            value: -1,
            name: '全部状态',
        }, {
            value: 0,
            name: '草稿',
        }, {
            value: 1,
            name: '审核中',
        }, {
            value: 2,
            name: '未通过',
        }, {
            value: 3,
            name: '已发布',
        }, {
            value: 4,
            name: '编码中',
        }, {
            value: 5,
            name: '编码失败',
        }, {
            value: 6,
            name: '图片处理中',
        }, {
            value: 7,
            name: '图片处理失败',
        }];
        const Result = firstSearch ? <NoResult /> : <SearchNoResult />;
        if (contentList.length === size + 1) {
            contentList.shift();
            this.hasTop = true;
        } else {
            this.hasTop = false;
        }
        return (
            <div>
                <h2 styleName="title">内容管理</h2>
                <div styleName="search-bar">
                    <DropDownMenu
                        defaultValue={contentType}
                        styleName="type-selector"
                        onChange={this.onContentTypeChange}>
                        {contentTypes.map((item, index) => (
                            <MenuItem
                                styleName="item"
                                value={item.value}
                                key={index}>
                                {item.name}
                             </MenuItem>
                        ))}
                    </DropDownMenu>
                    <DropDownMenu
                        defaultValue={stateType}
                        styleName="type-selector"
                        onChange={this.onStateTypeChange}>
                        {stateTypes.map((item, index) => (
                            <MenuItem
                                styleName="item"
                                value={item.value}
                                key={index}>
                                {item.name}
                            </MenuItem>
                        ))}
                    </DropDownMenu>
                    <Input placeholder="请输入关键词进行搜索" styleName="search" onBlur={this.onInput}/>
                    <Button hollow type="secondary" styleName="search-btn" onClick= {this.onSearch}>搜索</Button>
                </div>
                {(firstSearch && total === 0) ? null : <div styleName="article-number">共<span>{total}</span>条内容</div>}
                {(loading && <Loading />) || (total > 0 ? contentList.map((content, index) => {
                    content.onChangeTopState = this.onChangeTopState;
                    content.onChangeOnline = this.onChangeOnline;
                    return (
                        <ArticleCard
                            hasTop={this.hasTop}
                            key={content.articleId || content.skipId}
                            index={index}
                            content={content}/>
                    );
                }) : Result)}
                <div styleName="pagination">
                    <Pagination
                        showQuickJump
                        onChange={this.onPageChange}
                        total={total}
                        size={size}
                        current={currentPage} />
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        wemediaId: state.common.user.wemediaId,
        ...state.contentManager,
    }),
    dispatch => bindActionCreators({
        updateContentManager: action.updateContentManager,
    }, dispatch),
)(ContentManager);
