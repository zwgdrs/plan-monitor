/**
 * header.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/17 下午5:14
 */

import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'react-router-dom';
import { Row, Col, Icon } from '../../library';
import logo from '../../assets/images/logo.png';
import { Tooltip, Modal } from '../../library';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import action from '../../redux-modules/action';
import ajax from '../../util/ajax';

class Header extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        user: PropTypes.object,
        updateState: PropTypes.func,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            openMsg: false,
        }
    }

    getMessage = () => {
        const { updateMsg, updateState } = this.props;
        this.setState({
            loading: true,
            openMsg: true,
        });
        ajax('/msg/list.do', {
            params: {
                state: 0,
                pageNo: 1,
                size: 3,
            },
        }, rs => {
            updateMsg('unRead', rs.data.list);
            updateState();
        }).then(() => {
            this.setState({
                loading: false,
            });
        });
    };

    applyOnline = () => {
        const { user, updateState } = this.props;
        ajax('/online/apply.do', {
            method: 'post',
            data: {
                wemediaId: user.wemediaId,
            },
        }, rs => {
            Modal.success({
                content: '您的上线申请已提交成功，审核将在24小时内完成，记得回来哟！',
            });
            updateState();
        });
    };

    render() {
        const { className, user, message } = this.props;
        let makeStar = [];
        for (let i = 0; i < 5; i++) {
            makeStar.push(<Icon type="star" key={`star-${i}`} className={i < user.star ? 'light' : ''} />);
        }

        let applyOnline, onlineBtn = (<span className="apply-ok" onClick={this.applyOnline}>申请上线</span>);

        if (user.auditState === 0) {
            applyOnline = (<Tooltip content={<span className="apply-warning">帐号审核中</span>}
                title="帐号正在审核中，请耐心等待" position="bottomRight" />);
        } else if (user.auditState === 1) {
            switch (user.onlineState) {
                case 0:
                case 3:
                    if (user.articleCount < user.thresh && user.local === 1) {
                        applyOnline = (
                            <Tooltip content={<span className="apply-warning">申请上线</span>}
                                title={`您还需要发布${user.thresh - user.articleCount}篇文章才可以申请上线`}
                                position="bottomRight" />
                        );
                    } else if (user.onlineState === 0) {
                        applyOnline = onlineBtn;
                    } else if (user.onlineState === 3) {
                        applyOnline = (<Tooltip content={onlineBtn} position="bottomRight"
                            title="未通过上线审核，请修改信息后重新申请上线" />);
                    }
                    break;
                case 1:
                    applyOnline = (<Tooltip content={<span className="apply-warning">上线审核中</span>}
                        title="您的申请已提交，请耐心等待审核" position="bottomRight" />);
                    break;
                case 2:
                    applyOnline = (<span className="apply-warning">已上线</span>);
                    break;
                case 4:
                    applyOnline = (<Tooltip content={onlineBtn} position="bottomRight"
                        title="你的帐号已被管理员下线，请按要求修改后重新申请上线" />);
                    break;
                case 7:
                    applyOnline = (<Tooltip content={<span className="apply-warning">已封禁</span>}
                        title="你的帐号已被管理员封禁，请联系管理员" position="bottomRight" />);
                    break;
                case 9:
                    applyOnline = (<Tooltip content={<span className="apply-warning">已拒绝</span>}
                        title="您的账号不符合上线条件，已被永久拒绝" position="bottomRight" />);
                    break;
                default:
                    break;
            }
        } else if (user.auditState === 2) {
            applyOnline = (<span className="apply-warning">未通过帐号审核</span>);
        } else {
            applyOnline = (<span className="apply-warning">已封禁</span>);
        }

        return (
            <div className={className}>
                <Row className="header-content" justify="between" align="middle">
                    <Col>
                        <img src={logo} alt="有态度 不独行" title="网易号媒体开放平台" />
                    </Col>
                    <Col>
                        <div className="user">
                            <div className="user-photo">
                                {
                                    user.icon && <img src={user.icon} alt={user.tname} />
                                }
                            </div>
                            <div className="user-info">
                                <div className="user-info-name">{user.tname}</div>
                                <div className="user-info-func">
                                    { user.star > 0 ? makeStar : applyOnline }
                                    { user.star > 0 && !!user.newProminent && <span className="tag">特色</span>}
                                    { user.star > 0 && user.original === 5 && <span className="tag">专家</span>}
                                    {
                                        user.wemediaId ? (
                                            <Tooltip trigger="click" position="bottomRight"
                                                title={`${user.unreadCnt}条未读消息`} className="unreadCnt"
                                                content={ <span> <Icon type="mail" />{user.unreadCnt}</span> }
                                                onOpen={this.getMessage} isOpen={this.state.openMsg}>
                                                {
                                                    this.state.loading ? <div className="loading-box"><Icon
                                                        type="loading" /><span>载入中...</span></div> : (
                                                        <ul className="message">
                                                            {
                                                                message.length > 0 ? message.slice(0, 3).map((item, i) => (
                                                                    <li key={i}>
                                                                        <p>{item.body}</p>
                                                                        <p className="time">{item.createTime}</p>
                                                                    </li>
                                                                )) : (<li><span>无未读消息</span></li>)
                                                            }
                                                        </ul>
                                                    )
                                                }
                                                <p className="read-more">
                                                    <NavLink to="/message"
                                                        onClick={() => this.setState({ openMsg: false })}>
                                                        查看全部消息
                                                    </NavLink>
                                                </p>
                                            </Tooltip>
                                        ) : (<span> <Icon type="mail" />{user.unreadCnt}</span> )
                                    }
                                    <a href="http://">退出</a>
                                </div>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect(
    state => ({
        user: state.common.user,
        message: state.message.unRead,
    }),
    dispatch => bindActionCreators({
        updateMsg: action.updateMsg,
    }, dispatch)
)(Header);