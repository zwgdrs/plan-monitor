/**
 * ContentManager.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/18 下午5:40
 */

import React from 'react';
// import PropTypes from 'prop-types';
import action from '../../redux-modules/action';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Input, DropDownMenu, MenuItem, Tabs, Pagination } from '../../library';
import ajax from '../../util/ajax';
import omit from '../../util/omit';
import ReprodCard from './reprodCard';
import { SearchNoResult, NoResult, Loading } from '../components/helper';
import contentStyle from './contentStyle.scss';
import reprodStyle from './reprodStyle.scss';

class ReproductionManager extends React.PureComponent {
    static propTypes = {};

    static defaultProps = {
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            firstSearch: true,
            type: 'articleList',
            pageSize: 10,
            currentPage: 1,
            stateType: 'all',
            liveType: 'all',
            articleType: 'all',
        };
    }
    componentWillMount() {
        this.getList();
    }

    getList = (isSearch = false) => {
        let articleType, liveType, stateType, word;
        const {
            currentPage,
            pageSize,
            type,
        } = this.state;
        const {
          wemediaId,
        } = this.props;
        this.setState({
            loading: true,
        });
        if (isSearch) {
            word = this.state.word;
            articleType = this.state.articleType;
            liveType = this.state.liveType;
            stateType = this.state.stateType;
        } else {
            stateType = this.props.stateType;
            word = this.props.word;
            liveType = this.props.liveType;
            articleType = this.props.articleType;
        }
        const {
            updateReprodManager,
        } = this.props;
        const url = type === 'articleList' ? '/manage/repost/article/list.do'
            : '/manage/repost/live/list.do';
        const data = {
            wemediaId,
            pageNo: currentPage,
            size: pageSize,
            word: word,
            state: type === 'articleList' ? articleType : liveType,
            finished: type === 'liveList' ? stateType : 'all',
        };
        if (data.state === 'all') {
            delete data.state;
        }
        if (data.finished === 'all') {
            delete data.finished;
        }
        ajax(url, {
            method: 'post',
            data: omit(data, val => !val),
        }, rs => {
            if (rs) {
                updateReprodManager([
                    {key: type, value: rs.data.list },
                    {key: 'total', value: rs.data.total },
                ]);
            }
            return rs;
        }).then(() => {
            this.setState({
                loading: false,
            });
            updateReprodManager([
                {key: 'articleType', value: articleType},
                {key: 'liveType', value: liveType},
                {key: 'word', value: word},
                {key: 'stateType', value: stateType},
            ]);
        });
    }

    onTabChange = (e, tab, key, value) => {
        this.props.updateReprodManager([
            {key: 'word', value: ''},
            {key: 'total', value: 0},
        ]);
        this.setState({
            type: value,
            currentPage: 1,
            word: '',
        }, () => this.getList());
    };

    onArticleTypeChange = (e, key, value) => {
        this.setState({
            articleType: value,
        });
    };

    onLiveTypeChange = (e, key, value) => {
        this.setState({
            liveType: value,
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
    };

    onSearch = () => {
        this.setState({
            firstSearch: false,
            currentPage: 1,
        }, () => this.getList(true));
    };

    onPageChange = (number) => {
        this.setState({
            currentPage: number,
        }, () => {
            this.getList();
        });
    };

    render() {
        const {
            firstSearch,
            loading,
            type,
            pageSize,
            currentPage,
            stateType,
            liveType,
            articleType,
        } = this.state;
        const {
            articleList,
            liveList,
            total,
        } = this.props;
        const articleTypes = [{
            value: 'all',
            name: '全部文章',
        }, {
            value: 3,
            name: '已发布',
        }, {
            value: 4,
            name: '作者下线',
        }, {
            value: 5,
            name: '管理员下线',
        }, {
            value: 2,
            name: '审核不通过',
        }];
        const liveTypes = [{
            value: 'all',
            name: '全部直播',
        }, {
            value: 1,
            name: '审核不通过',
        }, {
            value: 2,
            name: '已上线',
        }, {
            value: 3,
            name: '用户下线',
        }, {
            value: 4,
            name: '管理员下线',
        }];
        const stateTypes = [{
            value: 'all',
            name: '全部状态',
        }, {
            value: 0,
            name: '未结束',
        }, {
            value: 1,
            name: '已结束',
        }];
        const articleFliter = (
            <span
                key={0}>
                <DropDownMenu
                    key={0}
                    defaultValue={articleType}
                    styleName="contentStyle.type-selector"
                    onChange={this.onArticleTypeChange}>
                    {articleTypes.map((item, index) => (
                        <MenuItem
                            styleName="contentStyle.item"
                            value={item.value}
                            key={index}>
                            {item.name}
                        </MenuItem>
                    ))}
                </DropDownMenu>
                <Input placeholder="请输入关键词进行搜索" styleName="reprodStyle.search" onBlur={this.onInput} />
            </span>
        );
        const liveFliter = (
            <span
                key={1}>
                <DropDownMenu
                    defaultValue={liveType}
                    styleName="contentStyle.type-selector"
                    onChange={this.onLiveTypeChange}>
                    {liveTypes.map((item, index) => (
                        <MenuItem
                            styleName="contentStyle.item"
                            value={item.value}
                            key={index}>
                            {item.name}
                        </MenuItem>
                    ))}
                </DropDownMenu>
                <DropDownMenu
                    defaultValue={stateType}
                    styleName="contentStyle.type-selector"
                    onChange={this.onStateTypeChange}>
                    {stateTypes.map((item, index) => (
                        <MenuItem
                            styleName="contentStyle.item"
                            value={item.value}
                            key={index}>
                            {item.name}
                        </MenuItem>
                    ))}
                </DropDownMenu>
                <Input placeholder="请输入关键词进行搜索" styleName="contentStyle.search" onBlur={this.onInput} />
            </span>
        );
        const articleHead = (
            <div styleName="reprodStyle.article-list-head">
                <span>标题</span>
                <span>修改时间</span>
                <span>状态</span>
            </div>
        );
        const liveHead = (
            <div styleName="reprodStyle.live-list-head">
                <span>标题</span>
                <span>开始时间</span>
                <span>结束时间</span>
                <span>状态</span>
            </div>
        )
        const list = type === 'articleList' ? articleList : liveList;
        const head = type === 'articleList' ? articleHead : liveHead;
        const result = firstSearch ? <NoResult /> : <SearchNoResult />;
        return (
            <div>
                <Tabs
                    tabWidth="80px"
                    onChange={this.onTabChange}
                    styleName="reprodStyle.tabs">
                    <Tabs.Tab value="articleList" key="article">文章</Tabs.Tab>
                    <Tabs.Tab value="liveList" key="live">直播</Tabs.Tab>
                </Tabs>
                <div styleName="contentStyle.search-bar">
                    {type === 'articleList' ? articleFliter : liveFliter}
                    <Button hollow type="secondary" styleName="contentStyle.search-btn" onClick= {this.onSearch}>搜索</Button>
                </div>
                {(firstSearch && list.length === 0) ? null : <div styleName="contentStyle.article-number">共<span>{total}</span>条内容</div>}
                {list.length > 0 && head}
                {(loading && <Loading />) || (list.length > 0 ? list.map((item, index) => (
                    <ReprodCard
                        data={item}
                        type={type}
                        key={index} />
                )) : result)}
                <div styleName="contentStyle.pagination">
                    <Pagination
                        showQuickJump
                        onChange={this.onPageChange}
                        total={total}
                        pageSize={pageSize}
                        current={currentPage} />
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        wemediaId: state.common.user.wemediaId,
        ...state.reproductionManager,
    }),
    dispatch => bindActionCreators({
        updateReprodManager: action.updateReprodManager,
    }, dispatch),
)(ReproductionManager);
