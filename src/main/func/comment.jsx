/**
 * Created by zhangce on 17/7/27.
 */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Row, Col, Table, DropDownMenu, MenuItem, Pagination, Input } from '../../library';
import { NoResult, Loading, SearchNoResult } from '../components';
import action from '../../redux-modules/action';
import ajax from '../../util/ajax';
import omit from '../../util/omit';
import formate from '../../util/tableColFormate';
import './func.scss';

const contentTypes = [
    { value: '', label: '全部类型' },
    { value: 1, label: '文章' },
    { value: 2, label: '图集' },
    { value: 3, label: '视频' },
];
const orderTypes = [
    { value: '', label: '跟贴更新时间排序' },
    { value: 1, label: '文章发布时间排序' },
    { value: 2, label: '跟贴数排序' },
];

class Comment extends React.PureComponent {
    static propTypes = {};

    static defaultProps = {};

    constructor(props, context) {
        super(props, context);
        this.state = {
            total: 0,
            pageNo: 1,
            size: 20,
            order: '',
            type: '',
            keyword: '',
            loading: true,
            isSearch: false,
        };
    };

    componentDidMount() {
        this.getDataList();
    }

    getDataList = () => {
        let { common, initCommentData } = this.props;
        const { pageNo, size , order, type, keyword} = this.state;
        const data = {
            wemediaId: common.user.wemediaId,
            pageNo,
            size,
            keyword,
            order,
            type,
        };
        ajax('/comment/list.do', {
            method: 'POST',
            data: omit(data, val => val === ''),
        }, rs => {
            if(rs.code === 1) {
                initCommentData([
                    { key: 'tableList', value: rs.data.list },
                    { key: 'total', value: rs.data.total },
                ]);
            }
            this.setState({
                total: rs.data.total || 0,
                loading: false,
            });
        });
    };

    onInput = (e, key, value = '') => {
        const { keyword } = this.state;
        let shoudUpdate = false;
        let isSearch = true;
        shoudUpdate = e.target.tagName !== 'INPUT' ? !shoudUpdate : shoudUpdate;
        isSearch = keyword === void 0 || keyword === '' ? !isSearch : isSearch;
        this.setState({
            [key]: e.target.value || value,
            pageNo: 1,
            isSearch: isSearch,
        }, () => {
            shoudUpdate && this.getDataList();
        });
    }

    search = () => {
        this.setState({
            pageNo: 1,
            isSearch: true,
        }, () => {
            this.getDataList();
        });
    }

    initLink = (index, isTitle) => {
        let { commentData, common } = this.props;
        const data = commentData.tableList[index];
        const newCount = data.unReadCommentCount > 999 ? '999+' : data.unReadCommentCount;
        return (
            <span className={isTitle ? 'table-fist-cell' : ''}>
                <a href={`/wemedia/comment/detail/${data.docId}.html?wemediaId=${common.user.wemediaId}`} className={isTitle ? 'article-title' : 'red-font'} styleName="tie-title">{isTitle ? data.title : '查看'}</a>
                {isTitle && newCount > 0 ? <span styleName="message-tip">{newCount}</span> : ''}
            </span>
        );
    };

    initTableData = () => {
        let { commentData } = this.props;
        const tableData = {
            columns: [
                { title: '标题', key: 'title', style: { width: '320px', minWidth: '261px' }, render: (index) => this.initLink(index, true) },
                { title: '类型', key: 'type', render: (index) => formate(commentData.tableList[index]['type'], contentTypes) },
                { title: '发布时间', key: 'publishTime', style: { width: '200px'} },
                { title: '跟贴数', key: 'totalCommentCount', render: (index) => { const data = commentData.tableList[index]['totalCommentCount']; return data > 9999 ? (data/10000).toFixed(1) + '万' : data } },
                { title: '操作', key: 'docId', style: { width: '100px'}, render: (index) => this.initLink(index) },
            ],
            dataSource: commentData.tableList,
            longTable: false,
            checkBox: false,
            allBorder: false,
            stripe: false,
            isHover: true,
            textCenter: true,
        };
        return tableData;
    }

    handlePageChange = (number) => {
        this.setState({
            pageNo: number,
        }, () => {
            this.getDataList();
        });
    }

    render() {
        const { pageNo, size , order, type, keyword, loading, total, isSearch } = this.state;
        return(
            <div>
                <h2 className="panel-heading">跟贴管理</h2>
                <div className="search-bar">
                    <Row>
                        <Col size="5">
                            <DropDownMenu
                                defaultValue={order}
                                className="global-selector"
                                onChange={(e, key, value) => this.onInput(e, 'order', value)}>
                                {orderTypes.map((item, index) => (
                                    <MenuItem
                                        value={item.value}
                                        className="item"
                                        key={index}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </DropDownMenu>
                        </Col>
                        <Col size="6">
                            <DropDownMenu
                                defaultValue={type}
                                className="global-selector ml-20"
                                onChange={(e, key, value) => this.onInput(e, 'type', value)}>
                                {contentTypes.map((item, index) => (
                                    <MenuItem
                                        value={item.value}
                                        className="item"
                                        key={index}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </DropDownMenu>
                        </Col>
                        <Col>
                            <div className="search-group">
                                <Input placeholder="请输入关键词进行搜索" className="input-normal input-search" value={keyword} onBlur={(e) => this.onInput(e, 'keyword')}/>
                                <Button hollow type="secondary" className="search-btn" onClick= {this.search}>搜索</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className="article-number">共<span>{total}</span>条内容</div>
                <div className="table-list">
                        {loading ? <Loading /> : (total > 0 ? <Table {...this.initTableData()} /> : ( isSearch ? <SearchNoResult/> : <NoResult/>))}
                    <Row>
                        <Col align="middle" className="page">
                            <Pagination total={ total } showQuickJump={true}
                                        pageSize={ size  } current={ pageNo } onChange={this.handlePageChange}/>
                        </Col>
                    </Row>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        commentData: state.commentData,
        common: state.common,
    }),
    dispatch => bindActionCreators({
        initCommentData: action.initCommentData,
    }, dispatch),
)(Comment);
