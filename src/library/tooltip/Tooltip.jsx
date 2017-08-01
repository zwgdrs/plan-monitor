/**
 * Tooltip.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/14 下午3:18
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Box from '../box';
import omit from '../util/omit';
import extend from 'object-assign';
import addEventListener from '../util/addEventListener';

export const POSITIONS = [
    "top", "topLeft", "topRight",
    "bottom", "bottomLeft", "bottomRight",
    "left", "leftTop", "leftBottom",
    "right", "rightTop", "rightBottom",
];

export const defaultProps = {
    prefixCls: 'ne-tooltip',
    position: POSITIONS[0],
    isOpen: false,
    isOpenOnTriggerClick: false,
    isCloseOnTriggerClick: false,
    isOpenOnTriggerFocus: false,
    isCloseOnTriggerBlur: false,
    isOpenOnTriggerMouseEnter: false,
    isCloseOnTriggerMouseLeave: false,
    isCloseOnBoxMouseLeave: true,
    isCloseOnDocumentClick: true,
    isCacheInNodeTree: true,
    mouseEnterDelay: 50,
    mouseLeaveDelay: 100,
    trigger: 'hover',
    translate: 5,
    animationTime: 300, //ms
};

class Tooltip extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        trigger: PropTypes.oneOf(['click', 'hover', 'focus']),
        title: PropTypes.string,
        content: PropTypes.node,
        isOpen: PropTypes.bool,
        style: PropTypes.object,
        className: PropTypes.string,
        position: PropTypes.oneOf(POSITIONS),
        translate: PropTypes.number,
        animationTime: PropTypes.number,
    };

    static defaultProps = defaultProps;

    constructor(props, context) {
        super(props, context);
        this.hasPosition = false;

        this.state = {
            isOpen: props.isOpen,
            style: {
                top: null,
                left: null,
                width: null,
                transform: null,
                opacity: 0,
            },
            arrow: {
                left: null,
                top: null,
            },
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.isOpen !== this.props.isOpen) {
            this.setState({
                isOpen: newProps.isOpen,
            });
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.state.isOpen || nextState.isOpen;
    }

    setPosition = () => {
        if (this.hasPosition || !(this.triggerNodeClientRect && this.tooltipClientRect)) {
            return;
        }
        const tooltipClientRect = this.tooltipClientRect;
        const arrowClientRect = this.arrowClientRect;
        const clientRect = this.triggerNodeClientRect;
        const { pageYOffset, pageXOffset } = window;
        // const { clientWidth, clientHeight, offsetHeight } = document.documentElement;
        const { position, translate } = this.props;
        // 计算坐标
        const index = POSITIONS.indexOf(position);
        const nowStyle = { left: null, top: null, right: null, bottom: null, opacity: 1 };
        let arrow = { top: null, left: null }, transformX = 0, transformY = 0;

        // todo
        // bug: 在特殊情况下trigger的MouseEnter会 先于 box的MouseLeave 触发，
        // 导致鼠标即使进入trigger, tooltip也会被关闭
        switch (index) {
            case -1:
            case 0: // top
                transformX = -(tooltipClientRect.width - clientRect.width) / 2;
                transformY = -tooltipClientRect.height + translate;
                nowStyle.transform = `translate(0, -${translate}px)`;
                break;
            case 1: // topLeft
                transformY = -tooltipClientRect.height + translate;
                nowStyle.transform = `translate(0, -${translate}px)`;
                arrow.left = Math.round((clientRect.width - arrowClientRect.width) / 2);
                break;
            case 2: // topRight
                transformX = -tooltipClientRect.width + clientRect.width;
                transformY = -tooltipClientRect.height + translate;
                nowStyle.transform = `translate(0, -${translate}px)`;
                arrow.left = Math.round(tooltipClientRect.width - (clientRect.width + arrowClientRect.width) / 2);
                break;
            case 3: // bottom
                transformX = (-tooltipClientRect.width + clientRect.width) / 2;
                transformY = clientRect.height - translate;
                nowStyle.transform = `translate(0, ${translate}px)`;
                break;
            case 4: // bottomLeft
                transformY = clientRect.height - translate;
                nowStyle.transform = `translate(0, ${translate}px)`;
                arrow.left = Math.round((clientRect.width - arrowClientRect.width) / 2);
                break;
            case 5:// bottomRight
                transformX = (-tooltipClientRect.width + clientRect.width);
                transformY = clientRect.height - translate;
                nowStyle.transform = `translate(0, ${translate}px)`;
                arrow.left = Math.round(tooltipClientRect.width - (clientRect.width + arrowClientRect.width) / 2);
                break;
            case 6: // left
                transformX = -tooltipClientRect.width + translate;
                transformY = -(tooltipClientRect.height - clientRect.height) / 2;
                nowStyle.transform = `translate(-${translate}px, 0)`;
                break;
            case 7: // leftTop
                transformX = -tooltipClientRect.width + translate;
                nowStyle.transform = `translate(-${translate}px, 0)`;
                arrow.top = Math.round((clientRect.height - arrowClientRect.height) / 2);
                break;
            case 8: // leftBottom
                transformY = -tooltipClientRect.height + clientRect.height;
                transformX = -tooltipClientRect.width + translate;
                nowStyle.transform = `translate(-${translate}px, 0)`;
                arrow.top = Math.round(tooltipClientRect.height - (clientRect.height + arrowClientRect.height) / 2);
                break;
            case 9: // right
                transformY = -(tooltipClientRect.height - clientRect.height) / 2;
                nowStyle.transform = `translate(${translate}px, 0)`;
                transformX = clientRect.width - translate;
                break;
            case 10: // rightTop
                transformX = clientRect.width - translate;
                nowStyle.transform = `translate(${translate}px, 0)`;
                arrow.top = Math.round((clientRect.height - arrowClientRect.height) / 2);
                break;
            case 11: // rightBottom
                transformY = -tooltipClientRect.height + clientRect.height;
                transformX = clientRect.width - translate;
                nowStyle.transform = `translate(${translate}px, 0)`;
                arrow.top = Math.round(tooltipClientRect.height - (clientRect.height + arrowClientRect.height) / 2);
                break;
            default:
                return;
        }

        // todo
        // bug: 在特殊情况（加载图片等）下会出现定位错误，原因是使用左上角定位的缺陷
        // 优化方式: 根据定位使用四个角来完成定位。
        nowStyle.top = Math.round(pageYOffset + clientRect.top + transformY);
        nowStyle.left = Math.round(pageXOffset + clientRect.left + transformX);

        // bug fixed: 在ReactDOM.unstable_renderSubtreeIntoContainer挂载的时候
        // tooltip窗口内文字会莫名其妙的换行，导致首次定位出现错误
        nowStyle.width = tooltipClientRect.width;

        this.setState({
            style: nowStyle,
            arrow,
        });
        this.hasPosition = true;
    };

    handleOpen = (e) => {
        const { onOpen } = this.props;
        this.triggerNodeClientRect = e.currentTarget.getBoundingClientRect();

        Promise.resolve(e)
            .then(e => {
                if (onOpen) {
                    return onOpen(e, this.props);
                }
            })
            .then(() => {
                if (!this.state.isOpen) {
                    this.setState({ isOpen: true });
                }
            })
            .then(() => {
                this.setPosition();
            });
    };

    handleResize = () => {
        this.onResize = addEventListener(window, 'resize', e => {
            this.onResize.remove();
            setTimeout(() => this.handleClose(e), 50);
        });
    };

    handleClose = (e) => {
        const { onClose, animationTime } = this.props;

        let prom = new Promise((reslove) => {
            this.setState({
                style: extend(this.state.style, {
                    transform: `translate(0, 0)`,
                    opacity: 0,
                }),
            });
            setTimeout(() => reslove('close'), animationTime || 0);
        });

        return prom
            .then(() => {
                if (onClose) {
                    return onClose(e, this.props);
                }
            })
            .then(() => {
                this.hasPosition = false;
                if (this.state.isOpen) {
                    this.setState({
                        isOpen: false,
                    });
                }
            });
    };

    handleMount = (e) => {
        const { onMount } = this.props;
        if (onMount) onMount(e, this.props);
        this.handleResize();
    };

    handleUnmount = (e) => {
        const { onUnmount } = this.props;
        this.hasPosition = false;
        this.triggerNodeClientRect = null;
        this.tooltipClientRect = null;
        this.arrowClientRect = null;
        this.setState({
            style: {},
        });
        if (onUnmount) onUnmount(e, this.props);
    };

    handleRef = (tooltip) => {
        const { prefixCls } = this.props;
        this.tooltipClientRect = tooltip ? tooltip.getBoundingClientRect() : null;
        this.arrowClientRect = tooltip ? tooltip.querySelector(`.${prefixCls}-arrow`).getBoundingClientRect() : null;
    };

    render() {
        const {
            content, trigger, prefixCls, children, className,
            position, title, style, animationTime, ...other
        } = this.props;

        let triggerEvent = {
            /** 当trigger被点击时，是否打开 */
            isOpenOnTriggerClick: trigger === 'click',

            /** 在trigger上点击是否关闭 */
            isCloseOnTriggerClick: trigger === 'click',

            /** 当trigger被focus时，是否打开 */
            isOpenOnTriggerFocus: trigger === 'focus',

            /** 在trigger上失焦是否关闭 */
            isCloseOnTriggerBlur: trigger === 'focus',

            /** 当trigger被Mouse Enter时，是否打开 */
            isOpenOnTriggerMouseEnter: trigger === 'hover',

            /** 在trigger上Mouse Leave是否关闭 */
            isCloseOnTriggerMouseLeave: trigger === 'hover',

            /** 在box上Mouse Leave是否关闭 */
            isCloseOnBoxMouseLeave: trigger === 'hover',
        };

        let classes = classNames(prefixCls, {
            [`${prefixCls}-position-${position}`]: position,
        }, className);

        const tooltip = (
            <div className={classes} style={extend({
                transition: `all ${animationTime / 1000}s`,
            }, this.state.style, style)} ref={this.handleRef}>
                <div className={`${prefixCls}-arrow`}
                    style={ this.state.arrow } />
                <div className={`${prefixCls}-inner`}>
                    { title && <div className={`${prefixCls}-header`}>{title}</div>}
                    { children && <div className={`${prefixCls}-content`}>{children}</div>}
                </div>
            </div>
        );

        return (
            <Box {...omit(other, ['children', 'className', 'prefixCls', 'trigger', 'isOpen', 'style'])}
                trigger={content} {...omit(triggerEvent, [])} className={`${prefixCls}-box`}
                isOpen={this.state.isOpen}
                onOpen={this.handleOpen}
                onClose={this.handleClose}
                onMount={this.handleMount}
                onUnmount={this.handleUnmount}>
                {tooltip}
            </Box>
        )
    }
}

export default Tooltip;
