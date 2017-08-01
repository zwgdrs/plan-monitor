/**
 * Created by zhangce on 17/7/27.
 */
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Row, Col, Modal } from '../../library';
import { Loading } from '../components';
import action from '../../redux-modules/action';
import ajax from '../../util/ajax';
import formate from '../../util/tableColFormate';
import './func.scss';

const stateMap = [
    { value: 0, label: '审核中' },
    { value: 1, label: '已上线' },
    { value: 2, label: '审核未通过' },
    { value: 3, label: '已下线' },
];

class AskBar extends React.PureComponent {
    static propTypes = {};

    static defaultProps = {};

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: true,
            total: 0,
        };
    };

    componentDidMount() {
        this.getDataList();
    }

    getDataList = () => {
        let { common, initAskData } = this.props;
        ajax('/ask/detail.do', {
            method: 'GET',
            params: {
                wemediaId: common.user.wemediaId,
            },
        }, rs => {
            if(rs.code === 1) {
                initAskData([
                    { key: 'data', value: rs.data },
                    { key: 'total', value: (rs.data ? 1 : 0) },
                ]);
            }
            this.setState({
                loading: false,
                total: rs.data ? 1 : 0,
            });
        });
    }

    initCreateAskBar = () => {
        let { common } = this.props;
        return (
            <div styleName="create-bar">
                <div styleName="askBar-icon"></div>
                <div styleName="info">您还没有创建问吧，快来创建开始互动吧</div>
                <a href={`/wemedia/askbar/toCreate/${common.user.wemediaId}.html`} type="primary" className="ne-btn ne-btn-primary ne-btn-big">创建问吧</a>
            </div>
        )
    }
    renderImg = (url) => {
        return (
            <img src={url} className="avatar" />
        )
    }

    lineAction = (state) => {
        let { askData, common } = this.props;
        const data = askData.data;
        const text = `您确定要对您的问吧："${data.title}"进行${state === 1 ? '上线': '下线'}操作 ?`
        Modal.confirm({
            content: text,
            onOk: () => {
                const conform =  new Promise((resolve, reject) => {
                    ajax('/ask/state/update.do', {
                        method: 'GET',
                        params: {
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

    initOperate = (state, map) => {
        let { askData, common } = this.props;
        const data = askData.data;
        const edit = <a key="edit" href={`/wemedia/askbar/toModify/${common.user.wemediaId}/${data.id}.html`} className="red-border-btn" styleName="operate-btn">修改</a>;
        const online = <button  key="offline" onClick={this.lineAction.bind(this, 1)} className="red-border-btn">上线</button>;
        const offline = <button  key="offline" onClick={this.lineAction.bind(this, 3)} className="red-border-btn">下线</button>;
        const action = {
            1: offline,
            2: edit,
            3: online,
        }
        return (
            <span>
                {formate(state, map)} {action[state]}
            </span>
        )
    }


    initAskBarInfo = () => {
        let { askData } = this.props;
        const infoMap = [
            { key: 'name', label: '专家名称'},
            { key: 'occupation', label: '专家职业'},
            { key: 'description', label: '专家介绍'},
            { key: 'cname', label: '问吧类型'},
            { key: 'title', label: '问吧名称'},
            { key: 'createTime', label: '创建时间'},
            { key: 'state', label: '问吧状态', render: (state) => this.initOperate(state, stateMap)},
            { key: 'icon', label: '专家头像', render: (url) => this.renderImg(url)},
            { key: 'headFigure', label: '问吧头像', render: (url) => this.renderImg(url)},
        ];
        return (
            <div className="form-contain">
                {infoMap.map( item => {
                    return (
                        <div key={item.key} className="form-item">
                            <Row>
                                <Col size="3">
                                    <div className="item-label">{item.label}</div>
                                </Col>
                                <Col>
                                    <div className="item-val">{item.render ? item.render(askData.data[item.key]) : askData.data[item.key]}</div>
                                </Col>
                            </Row>
                        </div>)
                } )}
            </div>
        )

    }

    render() {
        let { askData } = this.props;
        const { loading, total } = this.state;
        return (
            <div>
                <div styleName="panel-title"><h2 className="panel-heading">我的问吧</h2>{total > 0 && askData.data.state === 1 ? <a href="http://m.163.com/wenba/admin/specialist/index.html" target="_blank" className="blue-font">进入问吧></a> : ''}</div>
                {loading ? <Loading /> : total > 0 ? this.initAskBarInfo() : this.initCreateAskBar()}
            </div>
        )
    }
}

export default connect(
    state => ({
        askData: state.askData,
        common: state.common,
    }),
    dispatch => bindActionCreators({
        initAskData: action.initAskData,
    }, dispatch),
)(AskBar);
