/**
 * Created by zhangce on 17/7/26.
 */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Table, Modal, DropDownMenu, MenuItem, Pagination, Input, Row, Col } from '../../library';
import { NoResult, Loading } from '../components';
import action from '../../redux-modules/action';
import ajax from '../../util/ajax';
import formate from '../../util/tableColFormate';
import getContentUrl from '../../util/getUrl';
import './func.scss';


const stateList = [
    { value: 0, label: '审核中' },
    { value: 1, label: '已Push' },
    { value: 2, label: '审核未通过' },
    { value: 3, label: '可再次提交' },
];

class Push extends React.PureComponent {
    static propTypes = {};

    static defaultProps = {};

    constructor(props, context) {
        super(props, context);
        this.state = {
            isOpen: false,
            total: 0,
            pageNo: 1,
            size: 20,
            articleIndex: 0,
            title: '',
            alias: '',
            loading: true,
        };
    };

    componentDidMount() {
        this.getDataList();
    }

    getDataList = () => {
        let { initPushData, common } = this.props;
        const { pageNo, size } = this.state;
        ajax('/push/list.do', {
            method: 'GET',
            params: {
                wemediaId: common.user.wemediaId,
                pageNo,
                size,
            },
        }, rs => {
            initPushData([
                { key: 'tableList', value: rs.data.list },
                { key: 'canApply', value: rs.data.isPush },
            ]);
            this.setState({
                total: rs.data.total,
                loading: false,
            });
        });
    };

    initTableData = () => {
        let { pushData } = this.props;
        const tableData = {
            columns: [
                { title: '标题', key: 'title', style: { width: '261px', minWidth: '261px' }, render: (index) => {return this.initLink(index)} },
                { title: '修改时间', key: 'updateTime' },
                { title: '状态', key: 'state', render: (index) => formate(pushData.tableList[index]['state'], stateList) },
                { title: '操作', key: 'docid', render: (index) => this.renderBtn(index) },
            ],
            dataSource: pushData.tableList,
            longTable: false,
            checkBox: false,
            allBorder: false,
            stripe: false,
            isHover: true,
            textCenter: true,
        };
        return tableData;
    }

    rePublish = (index) => {
        let { pushData, common } = this.props;
        const data = pushData.tableList[index];
        ajax('/article/push/api/reapply.do', {
            method: 'POST',
            data: {
                id: data.pushId,
                wemediaId: common.user.wemediaId,
            },
        }, rs => {
            if(rs.code === 1) {
                Modal.success({
                    title: false,
                    content: '操作成功',
                }, this.getDataList());
            }
        });
    };

    renderBtn = (index) => {
        let { pushData } = this.props;
        const data = pushData.tableList[index];
        return data.state === 3 ? <button className="red-font" onClick={this.rePublish.bind(this, index) }>重新提交</button> : '';
    }

    initLink = (index) => {
        let { pushData } = this.props;
        const data = pushData.tableList[index];
        return <span className="table-fist-cell"><a href={getContentUrl(2, 1, data.docid)} target="_blank" className="article-title">{data.title}</a></span>;
    };

    initDialog = () => {
        let { initPushData, common, pushData } = this.props;
        const isPush = pushData.canApply;
        if(isPush === 0) {
            return Modal.info({
                content: '一天内只能申请Push一篇文章',
            });
        }
        this.setState({
            isOpen: true,
        });
        ajax('/article/push/api/list/article.do', {
            method: 'POST',
            data: {
                wemediaId: common.user.wemediaId,
            },
        }, rs => {
            initPushData([
                { key: 'articleList', value: rs.data },
            ]);
        });
    }

    initModal = () => {
        const { pushData } = this.props;
        const { alias, title, articleIndex } = this.state;
        const selectList = pushData.articleList.slice(0)
        selectList.unshift({ id: '', title: '请选择文章' });
        return (
            <Modal isOpen={this.state.isOpen}
                   onClose={ () => this.setState({ isOpen: false })}
                   onOk={this.submitForm}
                   title="发送定向Push">
                <h4>请选择需要push的文章:</h4>
                <DropDownMenu
                    defaultValue={articleIndex}
                    styleName="push-selector"
                    className="global-selector"
                    onChange={(e, key, value) => this.onInput(e, 'articleIndex', value)}>
                    {selectList.map((item, index) => (
                        <MenuItem
                            value={index}
                            className="item"
                            key={index}>
                            {item.title}
                        </MenuItem>
                    ))}
                </DropDownMenu>
                <div className={articleIndex === 0 ? 'hidden' : ''}>
                    <h4>请填写PUSH信息:</h4>
                    <h4>标题:</h4>
                    <Input className="input-normal" value={ title } onChange={(e) => this.onInput(e, 'title')} />
                    <h4>摘要:</h4>
                    <textarea cols="30" rows="10" value={ alias } className="textarea-normal" onChange={(e) => this.onInput(e, 'alias')}></textarea>
                </div>
            </Modal>
        )
    }

    submitForm = () => {
        let { pushData, common } = this.props;
        const { alias, title, articleIndex } = this.state;
        const dataItem = pushData.articleList[articleIndex-1];
        ajax('/article/push/api/apply.do', {
            method: 'POST',
            data: {
                wemediaId: common.user.wemediaId,
                docid: dataItem.docid,
                url: dataItem.newArticleUrl,
                doctitle: dataItem.title,
                alias,
                title,
            },
        }, rs => {
            if(rs.code === 1){
                this.setState({
                    isOpen: false,
                });
                Modal.success({
                    title: false,
                    content: '操作成功',
                }, () => {
                    this.getDataList();
                });
            }
        });
    }

    onInput = (e, key, value) => {
        this.setState({
            [key]: e.target.value || value,
        });
    }

    handlePageChange = (number) => {
        this.setState({
            pageNo: number,
        }, () => {
            this.getDataList();
        });
    };

    render() {
        const { size, pageNo, total, loading } = this.state;
        return (
            <div>
                <h2 className="panel-heading">定向PUSH</h2>
                <Button type="primary" className="btn-top ne-btn-big" onClick={this.initDialog} >申请PUSH</Button>
                <div className="table-list">
                    {loading ? <Loading /> :
                        (total > 0 ? <Table {...this.initTableData()} /> : <NoResult />
                        )}
                    <Row>
                        <Col align="middle" className="page">
                            <Pagination total={ total } showQuickJump={true}
                                        pageSize={ size  } current={ pageNo } onChange={this.handlePageChange}/>
                        </Col>
                    </Row>
                </div>
                {this.initModal()}
            </div>
        )
    }
}
export default connect(
    state => ({
        pushData: state.pushData,
        common: state.common,
    }),
    dispatch => bindActionCreators({
        initPushData: action.initPushData,
    }, dispatch),
)(Push);
