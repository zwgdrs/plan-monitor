/**
 * Created by zhangce on 17/7/27.
 */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Row, Col, Table, DropDownMenu, MenuItem, Pagination, Input, Modal } from '../../library';
import { NoResult, Loading, SearchNoResult } from '../components';
import action from '../../redux-modules/action';
import ajax from '../../util/ajax';
import omit from '../../util/omit';
import formate from '../../util/tableColFormate';
import './func.scss';

const stateTypes = [
    { value: '', label: '全部直播' },
    { value: 0, label: '已提交' },
    { value: 1, label: '审核不通过' },
    { value: 2, label: '已上线' },
    { value: 3, label: '已下线' },
    { value: 4, label: '管理员下线' },
];
const finishedTypes = [
    { value: '', label: '全部状态' },
    { value: 0, label: '未结束' },
    { value: 1, label: '已结束' },
];

class LiveList extends React.PureComponent {
    static propTypes = {};

    static defaultProps = {};

    constructor(props, context) {
        super(props, context);
        this.state = {
            total: 0,
            pageNo: 1,
            size: 20,
            state: '',
            finished: '',
            keyword: '',
            loading: true,
            isSearch: false,
        };
    };

    componentDidMount() {
        this.getDataList();
    }

    getDataList = () => {
        let { common, initLiveData  } = this.props;
        const { pageNo, size , finished, state, keyword} = this.state;
        const data = {
            wemediaId: common.user.wemediaId,
            finished,
            size,
            pageNo,
            state,
            keyword,
        }
        ajax('/live/list.do', {
            method: 'POST',
            data: omit(data, val => val === ''),
        }, rs => {
            if (rs.code === 1) {
                initLiveData([
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

    initLink = (index) => {
        let { liveData } = this.props;
        const data = liveData.tableList[index];
        return (
            <span className="table-fist-cell">
                {data.type !== 3 ? <a href={`http://c.m.163.com/news/l/${data.id}.html?spss=newsapp&spsw=1`} target="_blank">{data.title}</a> : <span>{data.title}</span> }
                {data.type === 3 ? <span className="tag">萝卜</span> : ''}
            </span>
        );
    };

    offlineAction = (index, state) => {
        let { liveData, common } = this.props;
        const data = liveData.tableList[index];
        const text = `您确定要对您的直播："${data.title}"进行${state === 3 ? '下线': '上线'}操作 ?`

        Modal.confirm({
            content: text,
            onOk: () => {
                const conform =  new Promise((resolve, reject) => {
                    ajax('/live/state/update.do', {
                        method: 'POST',
                        data: {
                            wemediaId: common.user.wemediaId,
                            id: data.id,
                            state: state,
                        },
                    }, rs => {
                        setTimeout(() => rs.code !== 1 ? reject() : resolve(), 200);
                    });
                }).then(() => {
                    Modal.success({
                        title: false,
                        content: '操作成功',
                    }, this.getDataList());
                }).catch(() => conform.close);
            },
        });
    }

    renderBtn = (index) => {
        let { liveData, common } = this.props;
        const data = liveData.tableList[index];
        const edit = <a key="edit" href={`/wemedia/live/toModify/${common.user.wemediaId}/${data.id}.html`} styleName="operate-btn">修改</a>;
        const startLive = <a key="startLive" href={`/wemedia/live/login/${common.user.wemediaId}/${data.id}.html`} target="_blank" styleName="operate-btn">开始直播</a>;
        const offline = <button  key="offline" onClick={this.offlineAction.bind(this, index, 3)} styleName="operate-btn" className="red-font">下线</button>;

        const action = {
            luobo: [edit, offline],
            1: [edit],
            2: [startLive, edit, offline],
        }
        return data.state === 1 ? edit : (data.isFinish === 1 ? (data.state === 0 ? edit : data.state === 2 ? offline : '') :
            action[data.state] !== void 0 && (data.type !== 3 || (data.type === 3 && data.state !== 2)) ? action[data.state] : data.type === 3 && data.state === 2 ? action['luobo'] : '') ;
    }

    initTableData = () => {
        let { liveData } = this.props;
        const tableData = {
            columns: [
                { title: '直播室标题', key: 'title', style: { width: '320px', minWidth: '261px' }, render: (index) => this.initLink(index) },
                { title: '开始时间', key: 'startTime', style: { width: '200px'} },
                { title: '结束时间', key: 'endTime', style: { width: '200px'} },
                { title: '状态', key: 'isFinish', render: (index) => formate(liveData.tableList[index]['isFinish'], finishedTypes) },
                { title: '操作', key: 'id', style: { width: '100px'}, render: (index) => this.renderBtn(index) },
            ],
            dataSource: liveData.tableList,
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
        let { common } = this.props;
        const { pageNo, size , finished, state, keyword, loading, total, isSearch} = this.state;
        return(
            <div>
                <h2 className="panel-heading">我的直播</h2>
                <div className="search-bar">
                    <Row>
                        <Col size="3">
                            <a href={`/wemedia/live/toCreate/${common.user.wemediaId}.html`} className="ne-btn ne-btn-primary" styleName="create-btn">创建直播室</a>
                        </Col>
                        <Col size="4">
                            <DropDownMenu
                                defaultValue={state}
                                className="global-selector"
                                styleName="live-selector"
                                onChange={(e, key, value) => this.onInput(e, 'state', value)}>
                                {stateTypes.map((item, index) => (
                                    <MenuItem
                                        value={item.value}
                                        className="item"
                                        key={index}>
                                        {item.label}
                                    </MenuItem>
                                ))}
                            </DropDownMenu>
                        </Col>
                        <Col size="4">
                            <DropDownMenu
                                defaultValue={finished}
                                className="global-selector ml-10"
                                styleName="live-selector"
                                onChange={(e, key, value) => this.onInput(e, 'finished', value)}>
                                {finishedTypes.map((item, index) => (
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
                    {loading ? <Loading /> :
                        (total > 0 ? <Table {...this.initTableData()} /> : ( isSearch ? <SearchNoResult/> : <NoResult/> )
                        )}
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
        liveData: state.liveData,
        common: state.common,
    }),
    dispatch => bindActionCreators({
        initLiveData: action.initLiveData,
    }, dispatch),
)(LiveList);
