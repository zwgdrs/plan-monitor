/**
 * index.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/7 下午6:14
 */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { HashRouter } from 'react-router-dom';
import { Row, Col/*, Icon*/ } from './../library';
import Transition from 'react-transition-group/Transition';
import { Header, Menu as SlideMenu, Footer, Loading } from './components';
// import Faq from './faq';
import UserTools from './userTools';
import action from '../redux-modules/action';
import ajax from '../util/ajax';

import App from './app/App';
import Notice from './notice/notice';
import ContentManager from './manager/contentManager';
import { TopStatistics } from './components';
import SubscribeData from './data/subscribe-data';
import PlanMonitor from './plan-monitor/js/app';

import MPRouter from './router'

import './index.scss';
class Index extends React.PureComponent {
    static propTypes = {
        stone: PropTypes.object,
    };
    static defaultProps = {};

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: true,
            show: false,
        };
    }

    componentDidMount() {
        this.getNavinfo();
    }

    getNavinfo = () => {
        const { filterMenu, updateCommon } = this.props;
        ajax('/navinfo.do', rs => {
            updateCommon('user', rs.data);
            this.setState({
                loading: true,
            });
        }).then(() => {
            const { stone } = this.props;
            filterMenu('menu', stone.user);
        });
    };

    render() {
        return <HashRouter>
            <Transition timeout={500} in={this.state.loading}>
                {(status) => (
                    <div className="main-body">
                        <Header className={`header slideDown slideDown-${status}`} updateState={this.getNavinfo} />
                        <div className={`content slide slide-${status}`}>
                            <Row>
                                <Col size="5">
                                    <SlideMenu />
                                </Col>
                                <Col size="19">
                                    {
                                        this.state.loading ? <MPRouter /> : <Loading />
                                    }
                                </Col>
                            </Row>
                        </div>
                        <Footer/>
                        <UserTools />
                    </div>
                )}
            </Transition>
        </HashRouter>
    }
}
export default connect(
    state => ({
        stone: state.common,
    }),
    dispatch => bindActionCreators({
        updateCommon: action.updateCommon,
        filterMenu: action.filterMenu,
    }, dispatch),
)(Index);
