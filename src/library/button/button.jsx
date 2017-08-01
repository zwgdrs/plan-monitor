/**
 * index.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/1 下午2:14
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../icon';
import omit from '../util/omit';
import { isString } from '../util/isType';

const rxTwoCNChar = /^[\u4e00-\u9fa5]{2}$/;
const isTwoCNChar = rxTwoCNChar.test.bind(rxTwoCNChar);

// Insert one space between two chinese characters automatically.
function insertSpace(child, needInserted) {
    // Check the child if is undefined or null.
    if (child === null) {
        return;
    }
    const SPACE = needInserted ? ' ' : '';
    // strictNullChecks oops.
    if (!isString(child) && typeof child !== 'number' &&
        isString(child.type) && isTwoCNChar(child.props.children)) {
        return React.cloneElement(child, {},
            child.props.children.split('').join(SPACE));
    }
    if (isString(child)) {
        if (isTwoCNChar(child)) {
            child = child.split('').join(SPACE);
        }

        return <span>{child}</span>;
    }
    return child;
}

class Button extends React.PureComponent {

    static defaultProps = {
        loading: false,
        hollow: false,
        disabled: false,
        size: 'default',
        prefixCls: 'ne-btn',
        clicked: false,
        autoFocus: false,
    };

    static propTypes = {
        type: PropTypes.string, // 设置按钮类型，可选值为 primary dashed danger
        icon: PropTypes.string,
        prefixCls: PropTypes.string,
        className: PropTypes.string,
        shape: PropTypes.oneOf(['circle', 'dashed']), // 设置按钮形状，可选值为 circle 或者不设
        size: PropTypes.oneOf(['large', 'default', 'small']),
        htmlType: PropTypes.oneOf(['submit', 'button', 'reset']),  //设置 button 原生的 type 值
        onClick: PropTypes.func,
        loading: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]), // 设置按钮载入状态 boolean | { delay: number }
        hollow: PropTypes.bool,
        disabled: PropTypes.bool,
        autoFocus: PropTypes.bool,
    };

    constructor(props) {
        super(props);
        this.state = {
            loading: props.loading,
        };
    }

    componentWillReceiveProps(nextProps) {
        const currentLoading = this.props.loading;
        const loading = nextProps.loading;

        if (currentLoading) {
            clearTimeout(this.delayTimeout);
        }

        if (typeof loading !== 'boolean' && loading && loading.delay) {
            this.delayTimeout = setTimeout(() => this.setState({ loading }), loading.delay);
        } else {
            this.setState({ loading });
        }
    }

    handleClick = (e) => {
        // 添加点击效果
        this.setState({ clicked: true });
        // 消除多次点击影响
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => this.setState({ clicked: false }), 500);

        const onClick = this.props.onClick;
        if (onClick) {
            onClick(e);
        }
    };

    // Handle auto focus when click button in Chrome
    handleMouseUp = (e) => {
        if (this.props.onMouseUp) {
            this.props.onMouseUp(e);
        }
    };

    componentWillUnmount() {
        clearTimeout(this.timeout);
    }

    render() {
        const {
            type, shape, size = '', className, htmlType,
            children, icon, prefixCls, hollow, ...others
        } = this.props;

        const { loading, clicked } = this.state;

        let sizeCls = '';
        switch (size) {
            case 'large':
                sizeCls = 'lg';
                break;
            case 'small':
                sizeCls = 'sm';
                break;
            default:
                break;
        }

        let _hollow = hollow;
        if (shape === 'dashed') {
            _hollow = true;
        }

        const classes = classNames(prefixCls, {
            [`${prefixCls}-${type}`]: type,
            [`${prefixCls}-${shape}`]: shape,
            [`${prefixCls}-${sizeCls}`]: sizeCls,
            [`${prefixCls}-icon-only`]: !children && icon,
            [`${prefixCls}-loading`]: loading,
            [`${prefixCls}-clicked`]: clicked,
            [`${prefixCls}-hollow`]: _hollow,
        }, className);

        const iconType = loading ? 'loading' : icon;
        const iconNode = iconType ? <Icon type={iconType} className="" /> : null;
        const needInserted = React.Children.count(children) === 1 && !iconType;
        const kids = React.Children.map(children, child => insertSpace(child, needInserted));

        return (
            <button {...omit(others, ['loading', 'clicked'])}
                type={htmlType || 'button'}
                className={classes}
                onMouseUp={this.handleMouseUp}
                onClick={this.handleClick}>
                {iconNode}{kids}
            </button>
        )
    }
}

export default Button;
