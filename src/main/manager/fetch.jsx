/**
 * notice.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/18 下午5:40
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Table, Modal, DropDownMenu, MenuItem, Input } from '../../library';
import { NoResult, Loading } from '../components';
import action from '../../redux-modules/action';
import ajax from '../../util/ajax';
import formate from '../../util/tableColFormate';
import './fetch.scss';

const selectDate = [{
    label: 'RSS或文章列表页',
    value: 0,
    url: '/fetch/rss/help.html',
    text: '点击查看->RSS格式标准',
},{
    label: '微信',
    value: 1,
    url: '/fetch/help.html',
    text: '点击查看->微信抓取方式',
}];

const stateList = [
    { value: 0, label: '已申请' },
    { value: 1, label: '待抓取' },
    { value: 2, label: '抓取成功' },
    { value: 3, label: '抓取失败' },
    { value: 4, label: '用户删除' },
    { value: 5, label: '管理员停抓' },
];

class Fetch extends React.PureComponent {
    static propTypes = {};

    static defaultProps = {};

    constructor(props, context) {
        super(props, context);
        this.state = {
            isOpen: false,
            linktype: 1,
            url: '',
            loading: true,
            linkDesc: {
                url: 'fetch/help.html',
                text: '点击查看->微信抓取方式',
            },
        };
    };

    componentDidMount() {
        this.getDataList();
    }

    deleteRow = (index) => {
        let { fetchData } = this.props;
        const data = fetchData.tableList[index];

        Modal.confirm({
            content: '同步源删除后，文章将不再进行同步，确定删除吗?',
            onOk: () => {
                const conform =  new Promise((resolve, reject) => {
                    ajax('/fetch/batchdel.do', {
                        method: 'POST',
                        data: {
                            ids: data.id,
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

    initLink = (index) => {
        let { fetchData } = this.props;
        const data = fetchData.tableList[index];
        return <span className="table-fist-cell"><a href={data.fetchUrl} target="_blank" className="article-title">{data.fetchUrl}</a></span>;
    }

    renderBtn = (index) => {
        let { fetchData } = this.props;
        const data = fetchData.tableList[index];
        return data.state !== 4 ? <button className="red-font" onClick={this.deleteRow.bind(this, index) }>删除</button> : '';
    }

    getDataList = () => {
        let { initFetchData, common } = this.props;
        ajax('/manage/fetch/list.do', {
            method: 'GET',
            params: {
                wemediaId: common.user.wemediaId,
            },
        }, rs => {
            if(rs.data){
                initFetchData([
                    { key: 'tableList', value: rs.data.list },
                    { key: 'total', value: rs.data.total },
                ]);
            }
            this.setState({
                loading: false,
            });
        });
    }

    initTableData = () => {
        let { fetchData } = this.props;
        const tableData = {
            columns: [
                { title: '同步链接', key: 'fetchUrl', style: { width: '261px', minWidth: '261px' }, render: (index) => {return this.initLink(index)} },
                { title: '同步类型', key: 'type', render: (index) => this.tableColFormate('type', fetchData.tableList[index]['type']) },
                { title: '创建时间', key: 'createTime' },
                { title: '状态', key: 'state', render: (index) => formate(fetchData.tableList[index]['state'], this.tableColFormate('state')) },
                { title: "操作", key: 'id', render: (index) => this.renderBtn(index) },
            ],
            dataSource: fetchData.tableList,
            longTable: false,
            checkBox: false,
            allBorder: false,
            stripe: false,
            isHover: true,
            textCenter: true,
        };
        return tableData;
    }

    initDialog = () => {
        this.setState({
            isOpen: true,
        });
    }

    initModal = () => {
        const { linktype, linkDesc, url } = this.state;
        return (
            <Modal isOpen={this.state.isOpen}
                   onClose={ () => this.setState({ isOpen: false })}
                   onOk = {this.submitForm}
                   title="新建同步" styleName="fetch-modal">
                <h4 styleName="label">请选择同步链接的类型</h4>
                <DropDownMenu
                    defaultValue={ linktype }
                    styleName="type-selector fetch-selector"
                    onChange={this.changeLinkType}>
                    {selectDate.map((item, index) => (
                        <MenuItem
                            styleName="item"
                            value={item.value}
                            key={index}>
                            {item.label}
                        </MenuItem>
                    ))}
                </DropDownMenu>
                <h4 styleName="label">请输入同步链接（<a href={linkDesc.url} target="_block" className="red-font">{linkDesc.text}</a>）：</h4>
                <Input placeholder="请您务必确保对提交的内容源拥有版权" className="input-normal" styleName="fetch-modal" value={ url } onChange={this.onInput} />
            </Modal>
        )
    }

    submitForm = () => {
        let { common } = this.props;
        const { linktype, url } = this.state;
        ajax('/fetch/add.do', {
            method: 'POST',
            data: {
                wemediaId: common.user.wemediaId,
                linktype: linktype,
                url: url,
            },
        }, rs => {
            if(rs.code === 1){
                this.setState({
                    isOpen: false,
                });
                Modal.info({
                    content: '同步申请提交成功,将在一周内生效。生效后内容将自动同步',
                }, this.getDataList());
            }
        });
    }

    onInput = e => {
        this.setState({
            url: e.target.value,
        });
    }

    changeLinkType = (e, key, value) => {
        const data = selectDate[key];
        this.setState({
            linktype: value,
            linkDesc: {
                text: data.text,
                url: data.url,
            },
        });
    }

    tableColFormate = (key, val) => {
        const dataList = {
            'state': stateList,
            'type': val === 1 ? '微信' : 'RSS或文章列表页',
        }

        return dataList[key];
    }

    render() {
        let { fetchData } = this.props;
        let { loading } = this.state;
        return (
            <div>
                <h2 styleName="title">内容源同步</h2>
                <Button type="primary" className="btn-top ne-btn-big" onClick={this.initDialog} >新建同步</Button>
                <div className="table-list">
                    {loading ? <Loading /> : (fetchData.tableList.length > 0 ? <Table {...this.initTableData()} /> : (<NoResult />))}
                </div>
                {this.initModal()}
            </div>
        )
    }
}
export default connect(
    state => ({
        fetchData: state.fetchData,
        common: state.common,
    }),
    dispatch => bindActionCreators({
        initFetchData: action.initFetchData,
    }, dispatch),
)(Fetch);
