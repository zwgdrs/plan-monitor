import React, { PureComponent, Children, isValidElement, cloneElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Tabs extends PureComponent {
    static propTypes = {
        defaultActiveKey: PropTypes.number,
        prefixCls: PropTypes.string,
        className: PropTypes.string,
        showInkbar: PropTypes.bool,
    };
    static defaultProps = {
        defaultActiveKey: 0,
        prefixCls: 'ne-tabs',
        showInkbar: true,
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            activeKey: 0,
        }
    }
    componentWillMount() {
        const {
            defaultActiveKey,
        } = this.props;
        this.setState({
            activeKey: defaultActiveKey,
        });
    }

    getTabs(props = this.props) {
        const tabs = [];
        Children.forEach(props.children, (tab) => {
            if (isValidElement(tab)) {
                tabs.push(tab);
            }
        });
        return tabs;
    }

    onClick = (e, tab, key) => {
        const {
            onChange,
        } = this.props;
        const {
            onActive,
            disabled,
            value,
        } = tab.props;
        const {
            activeKey,
        } = this.state;
        if (!disabled) {
            this.setState({activeKey: key});
            if (onChange && activeKey !== key) {
                onChange(e, tab, key, value);
            }
            if (onActive) {
                onActive(e, key, value)
            }

        }
    };

    render() {
        const {
            children,
            prefixCls,
            className,
            showInkbar,
            tabWidth,
            ...other
        } = this.props;
        const {
            activeKey,
        } = this.state;
        const classes = classNames(prefixCls, {
        }, className);
        const tabs = this.getTabs().map((tab, key) => {
            return cloneElement(tab, {
                index: key,
                actived: key === activeKey,
                onClick: e => this.onClick(e, tab, key),
                style: tabWidth && {maxWidth: tabWidth},
            });
        });
        const inkbarStyle = {
            width: tabWidth || `${(100 / tabs.length).toFixed(1)}%`,
            transform: `translateX(${activeKey*100}%)`,
        }
        delete other.defaultActiveKey;
        return (
            <div
                {...other}
                className={classes}>
                {showInkbar ? (
                    <div
                        style={inkbarStyle}
                        className={`${prefixCls}-inkbar`} />
                ): null}
                {tabs}
            </div>
        );
    }
}
export default Tabs;
