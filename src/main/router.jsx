/**
 * router.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/21 下午12:22
 */

import React from 'react';
import { Switch, Redirect } from 'react-router';
import { Route } from 'react-router-dom';

// containers
import App from './app/App';
import Notice from './notice/notice';
import ContentManager from './manager/contentManager';
import ReproductionManager from './manager/reproductionManager';
import SubscribeData from './data/subscribe-data';
import ContentData from './data/content-data';
import IndexStarLevel from './data/index-starLive';
import Message from './message';
import Fetch from './manager/fetch';
import Push from './func/push';
import Comment from './func/comment';
import LiveList from './func/liveList';
import NotFound from './errorPage/404';
import AskBar from './func/askbar';
import IncomeStat from './incomeSalary/income-stat';
import Transition from 'react-transition-group/Transition';

class Animate extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.duration = 600;
        this.state = {
            show: true,
            nextChildren: React.cloneElement(props.children),
        }
    }

    componentWillReceiveProps(nextProps) {
        const { switchPath } = this.props;
        if (switchPath !== nextProps.switchPath) {
            window.scrollTo(0, 0);
            this.setState({
                show: false,
            });
            setTimeout(() => {
                this.setState({
                    show: true,
                    nextChildren: React.cloneElement(nextProps.children),
                });
            }, this.duration);
        }
    }

    render() {
        return <Transition in={this.state.show} timeout={this.duration}>
            {
                (status) => (
                    <div className={`slide slide-${status}`}>
                        {this.state.nextChildren}
                    </div>
                )
            }
        </Transition>
    }
}

const RenderRoute = ({ component: Component, title, ...rest }) => {
    setTimeout(() => {
        // 设置title
        document.title = `${title} - 媒体开放平台 - 网易号`;
        window.neteaseTracker();
    }, 0);
    return <Route {...rest} render={props => (
        <Animate switchPath={rest.path}>
            <Component {...props} />
        </Animate>
    )} />
};

const MPRouter = (props) => {
    return <Switch>
        <Route exact path="/" render={() => <Redirect to="/index" /> } />
        <RenderRoute path="/index" exact component={Notice} title="首页" />
        <RenderRoute path="/manager" exact component={ContentManager} title="内容管理" />
        <RenderRoute path="/fetch" exact component={Fetch} title="内容同步" />
        <RenderRoute path="/reproduction" exact component={ReproductionManager} title="我的转载" />
        <RenderRoute path="/push" exact component={Push} title="PUSH中心" />
        <RenderRoute path="/comment" exact component={Comment} title="跟贴管理" />
        <RenderRoute path="/live" exact component={LiveList} title="我的直播" />
        <RenderRoute path="/askbar" exact component={AskBar} title="我的问吧" />
        <RenderRoute path="/app" component={App} title="app" />
        <RenderRoute path="/income-stat" component={IncomeStat} title="收益统计" />
        <RenderRoute path="/subscribe-data" component={SubscribeData} title="订阅数据" />
        <RenderRoute path="/content-data" component={ContentData} title="内容数据" />
        <RenderRoute path="/index-starLevel" component={IndexStarLevel} title="指数星级" />
        <RenderRoute path="/message" exact component={Message} title="通知中心" />
        <RenderRoute path="/404" exact component={NotFound} title="404" />
        <Redirect to="/404" />
    </Switch>
};

export default MPRouter;
