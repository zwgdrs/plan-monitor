/**
 * menu.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/20 下午6:13
 */

import React from 'react';
import { connect } from 'react-redux';
import { Icon } from '../../library';
import { NavLink } from 'react-router-dom';
import { withRouter } from 'react-router';

class Menu extends React.Component {
    static propTypes = {};

    static defaultProps = {};

    constructor(props, context) {
        super(props, context);
        this.state = {
            current: '/index',
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.location !== this.props.location) {
            this.setState({
                current: nextProps.location.pathname,
            });
        }
    }

    render() {
        const { stone } = this.props;
        return (
            <ul className="menu">
                {
                    stone.map(item => (
                        <li key={item.id} className="menu-item">
                            {
                                item.target !== void 0 ?
                                    <a href={item.url} target={item.target}><Icon type={item.icon} /> {item.name}</a> :
                                    item.url ?
                                        <NavLink to={item.url} activeClassName="isActive"
                                            className={item.new && 'red-dot'}>
                                            <Icon type={item.icon} /> {item.name}
                                        </NavLink> :
                                        <span className="menu-sub-title"><Icon type={item.icon} />{item.name}</span>
                            }
                            {
                                item.submenu && item.submenu.length > 0 && (
                                    <ul>
                                        {item.submenu.map(sub =>
                                            <li key={sub.id} className="menu-item-sub">
                                                {
                                                    sub.target !== void 0 ?
                                                        <a href={sub.url} target={sub.target}>{sub.name}</a> :
                                                        <NavLink to={sub.url} activeClassName="isActive"
                                                            className={sub.new && 'red-dot'}>{sub.name}</NavLink>
                                                }
                                            </li>
                                        )}
                                    </ul>
                                )
                            }
                        </li>
                    ))
                }
            </ul>
        )
    }
}

export default connect(
    state => ({
        stone: state.menu,
        routing: state.routing,
    }),
)(withRouter(Menu));