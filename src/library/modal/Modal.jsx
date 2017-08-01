/**
 * Modal.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/7 下午9:07
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import addEventListener from '../util/addEventListener';
import { isObject } from '../util/isType';
import omit from '../util/omit';
import Button from '../button';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';
import ModalContent from './ModalContent';
import Box from '../box';
import extend from 'object-assign';

export let defaultProps = {
    prefixCls: 'ne-modal',
    size: 'md',
    cancelText: '取消',
    okText: '确定',
    isOpen: false,
    maskType: 'default',
    vertical: 'middle',
    mountNode: document.body,
    isScrollOnBody: false,
    isCloseOnDocumentClick: false,
    isCloseOnMaskClick: false,
    isConfirmLoading: false,
    hasCloseBtnOnHeader: true,
};

let mousePositionEventBinded = null;

class Modal extends React.Component {

    static propTypes = {
        prefixCls: PropTypes.string,

        isOpen: PropTypes.bool,
        /**
         * 触发打开事件的时候调用
         *
         * @param {SyntheticEvent} event - React's original SyntheticEvent.
         * @param {object} data - 所有 props.
         */
        onOpen: PropTypes.func,
        /**
         * 触发打开事件的时候调用
         *
         * @param {SyntheticEvent} event - React's original SyntheticEvent.
         * @param {object} data - 所有 props.
         */
        onClose: PropTypes.func,
        /**
         * modal被挂载的时候调用
         *
         * @param {null}
         * @param {object} data - 所有 props.
         */
        onMount: PropTypes.func,
        /**
         * modal被卸载的时候调用
         *
         * @param {null}
         * @param {object} data - 所有 props.
         */
        onUnmount: PropTypes.func,

        /** modal挂载的节点. 预设定为 document.body 节点下 */
        mountNode: PropTypes.any,

        isScrollOnBody: PropTypes.bool,

        size: PropTypes.oneOf(['fullScreen', 'lg', 'sm', 'md']),

        style: PropTypes.object,

        className: PropTypes.string,

        vertical: PropTypes.oneOf(['middle', 'top', 'bottom']),

        maskType: PropTypes.oneOf(['default', 'none']),

        children: PropTypes.node,
        /** Icon. */
        // closeIcon: PropTypes.oneOfType([
        //     PropTypes.node,
        //     PropTypes.object,
        //     PropTypes.bool,
        // ]),
        /** 点击遮幕是否关闭 */
        isCloseOnMaskClick: PropTypes.bool,

        isCloseOnDocumentClick: PropTypes.bool,

        hasCloseBtnOnHeader: PropTypes.bool,
        /** 确认按钮文字*/
        okText: PropTypes.string,
        /** 取消按钮文字*/
        cancelText: PropTypes.string,
        /** 确定按钮 loading*/
        isConfirmLoading: PropTypes.bool,

        title: PropTypes.string,

        content: PropTypes.any,

        onOk: PropTypes.func,

        onCancel: PropTypes.func,
    };

    static defaultProps = extend({}, defaultProps);

    constructor(props, context) {
        super(props, context);
        this.mousePosition = null;
        this.state = {
            isOpen: props.isOpen,
            confirmLoading: props.confirmLoading,
        };
    }

    componentWillMount(e) {
        //this.setPosition();
        const { onMount } = this.props;
        if (onMount) onMount(e, this.props);
    }

    componentDidMount() {
        if (mousePositionEventBinded) {
            return;
        }
        // 只有点击事件支持从鼠标位置动画展开
        addEventListener(document.documentElement, 'click', (e) => {
            this.mousePosition = {
                x: e.pageX,
                y: e.pageY,
            };
            // 100ms 内发生过点击事件，则从点击位置动画展示
            // 否则直接 zoom 展示
            // 这样可以兼容非点击方式展开
            console.log(this.mousePosition);
            setTimeout(() => this.mousePosition = null, 100);
        });
        mousePositionEventBinded = true;
    }

    componentWillReceiveProps(nextProps) {
        let newState = {};
        if (nextProps.isOpen !== this.props.isOpen) {
            newState.isOpen = nextProps.isOpen;
        }
        if (nextProps.confirmLoading !== this.props.confirmLoading) {
            newState.confirmLoading = nextProps.confirmLoading;
        }
        if (Object.keys(newState).length > 0) {
            this.setState(newState);
        }
    }

    componentWillUpdate(nextProps, nextState) {
        const state = this.state;
        const { mountNode, isScrollOnBody } = this.props;
        if (state.isOpen !== nextState.isOpen && !nextState.isOpen) {  // 关闭
            this.handleClose()
        }
        if (!isScrollOnBody) {
            if (nextState.isOpen || nextProps.isOpen) {
                mountNode.classList.add('is-modal-open');
            } else {
                mountNode.classList.remove('is-modal-open');
            }
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        // 当 isOpen 是 true 时，再更新
        return this.state.isOpen || nextState.isOpen;
    }

    componentWillUnmount(e) {
        cancelAnimationFrame(this.animationRequestId);

        const { onUnmount } = this.props;
        if (onUnmount) onUnmount(e, this.props);
    }

    setPosition = () => {
        if (this.ref) {
            const mountNode = this.props.mountNode;
            const { height } = this.ref.getBoundingClientRect();

            const marginTop = -Math.round(height / 2);
            const scrolling = height >= window.innerHeight;

            const newState = {};

            if (this.state.marginTop !== marginTop) {
                newState.marginTop = marginTop;
            }

            if (this.state.scrolling !== scrolling) {
                newState.scrolling = scrolling;

                if (scrolling) {
                    mountNode.classList.add('scrolling');
                } else {
                    mountNode.classList.remove('scrolling');
                }
            }

            if (Object.keys(newState).length > 0) {
                this.setState(newState);
            }
        }

        this.animationRequestId = requestAnimationFrame(this.setPosition);
    };

    handleClose = (e) => {
        const { onClose } = this.props;
        Promise.resolve(e)
            .then(e => {
                if (onClose) {
                    return onClose(e, this.props);
                }
            })
            .then(() => {
                if (this.state.isOpen) {
                    this.setState({ isOpen: false });
                }
            });
    };

    handleOpen = (e) => {
        const { onOpen } = this.props;
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
            });
    };

    handleOk = (e) => {
        const { onOk } = this.props;
        if (onOk) {
            onOk(e);
        }
    };

    handleCancel = (e) => {
        this.handleClose(e);
        const { onCancel } = this.props;
        if (onCancel) {
            onCancel(e);
        }
    };

    handleRef = c => this.ref = c;

    renderContent() {
        const {
            prefixCls, className, okText, cancelText, title,
            children, size, style, hasCloseBtnOnHeader,
        } = this.props;
        let { content = [] } = this.props;

        let classes = classNames(`${prefixCls}-plane`, {
            [`${prefixCls}-${size}`]: size,
        }, className);

        const defaultFooter = [(
            <Button
                key="cancel"
                size="large"
                onClick={this.handleCancel}>
                {cancelText || '取消'}
            </Button>
        ), (
            <Button
                key="confirm"
                type="primary"
                size="large"
                loading={this.state.isConfirmLoading}
                onClick={this.handleOk}>
                {okText || '确定'}
            </Button>
        )];

        let header = null;
        let body = null;
        let footer = null;

        if (!Array.isArray(content)) {
            content = [content];
        }

        React.Children.forEach(children, child => {
            const childType = child && (isObject(child.type) || typeof child.type === 'function' ) ?
                (child.type.displayName || child.type.name) :
                child.type;
            if (childType === 'ModalHeader') {
                header = child;
            } else if (childType === 'ModalContent') {
                body = child;
            } else if (childType === 'ModalFooter') {
                footer = child;
            } else {
                content.push(child);
            }
        });

        return (
            <div className={classes} style={style} ref={this.handleRef}>
                {
                    header ? header : title && <ModalHeader onClose={this.handleCancel}
                            hasCloseBtnOnHeader={hasCloseBtnOnHeader}>{ title }</ModalHeader>
                }
                {
                    body ? body : <ModalContent>{ content }</ModalContent>
                }
                {
                    footer ? footer : <ModalFooter>{ defaultFooter }</ModalFooter>
                }
            </div>
        );
    }

    render() {
        const {
            prefixCls, maskType, mountNode, vertical, ...other
        } = this.props;

        let classes = classNames(prefixCls, {
            [`${prefixCls}-maskType-${maskType}`]: maskType,
            [`${prefixCls}-vertical-${vertical}`]: vertical,
        });

        return (
            <Box className={ classes } position={ this.mousePosition } onOpen={this.handleOpen}
                mountNode={ mountNode } isOpen={ this.state.isOpen } onClose={this.handleClose}
                {...omit(other, ['prefixCls', 'className', 'okText', 'cancelText', 'title', 'isOpen',
                    'isConfirmLoading', 'children', 'content', 'size', 'style', 'vertical', 'onClose'])}>
                { this.renderContent() }
            </Box>
        )
    }
}

export default Modal;