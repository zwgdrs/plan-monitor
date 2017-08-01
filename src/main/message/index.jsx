/**
 * index.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/26 下午3:46
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import classNames from 'classnames';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import action from '../../redux-modules/action';
import ajax from '../../util/ajax';
import { Pagination, Row, Col } from '../../library';
import './style.scss';

class Message extends React.PureComponent {
    static propTypes = {};

    static defaultProps = {};

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
            pageNo: 1,
            pageSize: 20,
        }
    }

    componentDidMount() {
        this.getMessage();
    }

    getMessage = () => {
        const { updateMsg } = this.props;
        this.setState({
            loading: true,
        });
        ajax('/msg/list.do', {
            params: {
                pageNo: this.state.pageNo,
                size: this.state.pageSize,
            },
        }, rs => {
            updateMsg([
                { key: 'list', value: rs.data.list },
                { key: 'total', value: rs.data.total },
            ]);
        }).then(() => {
            this.setState({
                loading: false,
            });
        });
    };

    handlePageChange = (number) => {
        this.setState({
            pageNo: number,
        }, () => {
            this.getMessage();
        });
    };

    render() {
        let { message } = this.props;
        return (
            <div className="news-list" styleName="msg-list">
                <h2>消息通知</h2>
                {message.list.length > 0 && message.list.map((item, i) => (
                    <Row key={item.createTime + '-' + i} justify="between">
                        <Col align="middle">{item.body}</Col>
                        <Col align="middle" size={6} className="time">{item.createTime}</Col>
                    </Row>
                ))}
                <Row>
                    <Col align="middle" className="page">
                        <Pagination total={ message.total } pageSize={ this.state.pageSize }
                            current={ this.state.pageNo } showQuickJump={true}
                            onChange={this.handlePageChange} />
                    </Col>
                </Row>
            </div>
        )
    }
}

export default connect(
    state => ({
        message: state.message,
    }),
    dispatch => bindActionCreators({
        updateMsg: action.updateMsg,
    }, dispatch)
)(Message);