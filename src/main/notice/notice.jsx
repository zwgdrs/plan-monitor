/**
 * notice.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/18 下午5:40
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Button, Carousel, Row, Col, Pagination } from '../../library';
import { TopStatistics } from '../components';
import action from '../../redux-modules/action';
import ajax from '../../util/ajax';
import './style.scss';


const carouselData = {
    imgWidth: 930,
    imgHeight: 140,
    // unit: 10,
    time: 400,
    interval: 5000,
    dots: 'dots',
    arrow: true,
    // autoPlay: true,
};

const spliceStr = (str, total) => {
    const hanReg = /[\u4e00-\u9fa5]/g;
    const len = str.replace(hanReg, '**').length;
    if (len > total) {
        return str.substr(0, Math.ceil(total / 2)) + '...';

    }
    return str;
};

class Notice extends React.PureComponent {
    static propTypes = {
        wemediaId: PropTypes.string,
    };

    static defaultProps = {};

    constructor(props, context) {
        super(props, context);
        this.state = {
            pageNo: 1,
            pageSize: 15,
        };
    }

    componentDidMount() {
        this.getNoticeList();
    }

    getNoticeList = () => {
        const { updateNotice } = this.props;
        // 列表
        ajax('/index/list.do', {
            params: {
                pageNo: this.state.pageNo,
                pageSize: this.state.pageSize,
            },
        }, rs => {
            if (rs.data) {
                updateNotice([
                    { key: 'list', value: rs.data.list },
                    { key: 'total', value: rs.data.total },
                ]);
            }
        });
        // banner
        ajax('/index/banners.do', rs => {
            if(rs.data){
                updateNotice('banner', rs.data.list.map(item => ({ img: item.pic, ...item })));
            }
        });
    };

    handlePageChange = (number) => {
        this.setState({
            pageNo: number,
        }, () => {
            this.getNoticeList();
        });
    };

    render() {
        let { stone } = this.props;
        return (
            <div>
                <div className="page-top">
                    <TopStatistics url="/general.json" />
                    <Button type="primary" className="release-btn" icon="edit-o">发布</Button>
                </div>
                {
                    stone.banner.length > 0 && <Carousel {...carouselData} imgList={stone.banner} />
                }
                <div className="panel">
                    <div className="panel-header">平台公告</div>
                    <div className="panel-body news-list">
                        {
                            stone.list.map((item, i) => (
                                <Row key={item.id + '-list-' + i}>
                                    <Col>
                                        <a href={`//dy.163.com/v2/article/detail/${item.id}.html`}
                                            target="_blank" rel="noopener noreferrer">
                                            { spliceStr(item.title + item.title, 70) }
                                        </a>
                                        {
                                            i < 4 && this.state.pageNo === 1 && <span className="tag">NEW</span>
                                        }
                                    </Col>
                                    <Col size="5" className="time">{item.createTime}</Col>
                                </Row>
                            ))
                        }
                        <Row>
                            <Col align="middle" className="page">
                                <Pagination total={ stone.total } pageSize={ this.state.pageSize }
                                    current={ this.state.pageNo } showQuickJump={true}
                                    onChange={this.handlePageChange} />
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        stone: state.notice,
    }),
    dispatch => bindActionCreators({
        updateNotice: action.updateNotice,
    }, dispatch),
)(Notice);
