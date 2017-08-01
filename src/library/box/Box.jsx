/**
 * box.jsx
 *
 * 为 modal、poptip、tooltip 提供基础支持
 * @Author: jruif
 * @Date: 2017/7/10 上午10:48
 */
import '../util/closest';
import React from 'react';
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types';
import classnames from 'classnames';
import addEventListener from '../util/addEventListener';
import keyboardKey from '../util/keyboardKey';

class Box extends React.PureComponent {
    static propTypes = {
        /** 主要内容 */
        children: PropTypes.node.isRequired,

        /** 额外样式 */
        className: PropTypes.string,

        style: PropTypes.object,

        /** 点击document是否关闭 */
        isCloseOnDocumentClick: PropTypes.bool,

        /** 按ESC键是否关闭 */
        isCloseOnEscape: PropTypes.bool,

        /**
         * Controls whether or not the box should close when mousing out of the box.
         * NOTE: This will prevent `closeOnTriggerMouseLeave` when mousing over the
         * gap from the trigger to the box.
         */
        isCloseOnBoxMouseLeave: PropTypes.bool,

        /**
         * Controls whether or not the box should close on a click on the box background.
         * NOTE: This differs from closeOnDocumentClick:
         * - DocumentClick - any click not within the box
         * - RootNodeClick - a click not within the box but within the box's wrapper
         */
        isCloseOnRootNodeClick: PropTypes.bool,

        /** 在trigger上失焦是否关闭 */
        isCloseOnTriggerBlur: PropTypes.bool,

        /** 在trigger上点击是否关闭 */
        isCloseOnTriggerClick: PropTypes.bool,

        /** 在trigger上Mouse Leave是否关闭 */
        isCloseOnTriggerMouseLeave: PropTypes.bool,

        // defaultOpen: PropTypes.bool,

        /** 挂载节点 */
        mountNode: PropTypes.any,

        /** mouse over 时打开需要延迟时间（毫秒） */
        mouseEnterDelay: PropTypes.number,

        /** mouse leave 时打开需要延迟时间（毫秒）*/
        mouseLeaveDelay: PropTypes.number,

        /**
         * 关闭的时候回调
         *
         * @param {SyntheticEvent} event - React's original SyntheticEvent.
         * @param {object} data - 所有 props.
         */
        onClose: PropTypes.func,

        /**
         * 被挂载在DOM中时候回调
         *
         * @param {null}
         * @param {object} data - 所有 props.
         */
        onMount: PropTypes.func,

        /**
         * 当显示当时候回调
         *
         * @param {SyntheticEvent} event - React's original SyntheticEvent.
         * @param {object} data - 所有 props.
         */
        onOpen: PropTypes.func,

        /**
         * 从DOM中卸载的时候调用
         *
         * @param {null}
         * @param {object} data - 所有 props.
         */
        onUnmount: PropTypes.func,

        /** 是否显示 */
        isOpen: PropTypes.bool,

        /** 是否挂载在mountNode前 */
        isPrepend: PropTypes.bool,

        /** 当trigger被点击时，是否打开 */
        isOpenOnTriggerClick: PropTypes.bool,

        /** 当trigger被focus时，是否打开 */
        isOpenOnTriggerFocus: PropTypes.bool,

        /** 当trigger被Mouse Enter时，是否打开 */
        isOpenOnTriggerMouseEnter: PropTypes.bool,

        /** 是否卸载节点 */
        isCacheInNodeTree: PropTypes.bool,

        /** 提示框等会用 */
        trigger: PropTypes.node,
    };

    static defaultProps = {
        isOpen: false,
        isCloseOnDocumentClick: false,
        isCloseOnEscape: true,
        isCloseOnRootNodeClick: false,
        isCloseOnBoxMouseLeave: false,
        isCloseOnTriggerBlur: true,
        isCloseOnTriggerClick: true,
        isCloseOnTriggerMouseLeave: false,
        isPrepend: false,
        isOpenOnTriggerClick: false,
        isOpenOnTriggerFocus: false,
        isOpenOnTriggerMouseEnter: false,
        isCacheInNodeTree: false,
        mouseEnterDelay: 0,
        mouseLeaveDelay: 0,
        mountNode: document.body,
    };

    constructor(props, context) {
        super(props, context);
        this.portalNode = null;
        this.rootNode = null;
        this.state = {
            isOpen: props.isOpen,
            isPrepend: false,
        };

    }

    // --------------------
    // Document事件
    // ---------------------
    handleDocumentClick = (e) => {
        const { isCloseOnDocumentClick } = this.props;

        if (
            !this.rootNode  // not mounted
            || !this.BoxNode  // no portal
            || (this.triggerNode && this.triggerNode.contains(e.target)) // event happened in trigger (delegate to trigger handlers)
            || (this.BoxNode && this.BoxNode.contains(e.target))  // event happened in the box
        ) return;

        if (isCloseOnDocumentClick && !this.rootNode.contains(e.target)) {
            this.close(e);
        }
    };

    // 按击'Escape'键
    handleEscape = (e) => {
        if (!this.props.isCloseOnEscape) return;
        if (keyboardKey.getCode(e) !== keyboardKey.name.Escape) return;

        this.close(e);
    };

    // ---------------------
    // 事件回调
    // ---------------------
    handleBoxMouseLeave = (e) => {
        const { isCloseOnBoxMouseLeave, mouseLeaveDelay } = this.props;

        const didFocusTrigger = this.triggerNode && this.triggerNode.contains(e.relatedTarget);

        if (!isCloseOnBoxMouseLeave || didFocusTrigger) return;

        this.mouseLeaveTimer = this.closeWithTimeout(e, mouseLeaveDelay);
    };

    handleBoxMouseEnter = (e) => {
        const { isCloseOnBoxMouseLeave } = this.props;

        if (!isCloseOnBoxMouseLeave) return;

        clearTimeout(this.mouseLeaveTimer);
    };

    handleTriggerFocus = (e) => {
        const { trigger, isOpenOnTriggerFocus } = this.props;

        // 调用原生事件
        trigger.props.onFocus && trigger.props.onFocus(e);

        if (!isOpenOnTriggerFocus) return;

        // react销毁了事件对象的所有属性
        // 所以有些事件的属性(e.g currentTarget)请求到却是null，所有这里我们直接clone
        this.open({ ...e });
    };

    handleTriggerBlur = (e) => {
        const { trigger, isCloseOnTriggerBlur } = this.props;

        // 调用原生事件
        trigger.props.onBlur && trigger.props.onBlur(e);

        // 焦点是否在box中
        const didFocusBox = this.rootNode && this.rootNode.contains(e.relatedTarget);

        if (!isCloseOnTriggerBlur || didFocusBox) return;

        this.close(e);
    };

    handleTriggerClick = (e) => {
        const { trigger, isCloseOnTriggerClick, isOpenOnTriggerClick } = this.props;
        const { isOpen } = this.state;
        e.stopPropagation();
        // 调用原生事件
        trigger.props.onClick && trigger.props.onClick(e);

        if (isOpen && isCloseOnTriggerClick) {
            this.close(e);
        } else if (!isOpen && isOpenOnTriggerClick) {
            this.open({ ...e });
        }
    };

    handleTriggerMouseLeave = (e) => {
        clearTimeout(this.mouseEnterTimer);

        const { trigger, isCloseOnTriggerMouseLeave, mouseLeaveDelay } = this.props

        trigger.props.onMouseLeave && trigger.props.onMouseLeave(e);

        if (!isCloseOnTriggerMouseLeave) return;

        this.mouseLeaveTimer = this.closeWithTimeout(e, mouseLeaveDelay);
    };

    handleTriggerMouseEnter = (e) => {
        clearTimeout(this.mouseLeaveTimer);

        const { trigger, mouseEnterDelay, isOpenOnTriggerMouseEnter } = this.props;

        // Call original event handler
        trigger.props.onMouseEnter && trigger.props.onMouseEnter(this.handleTriggerMouseEnter);

        if (!isOpenOnTriggerMouseEnter) return;

        this.mouseEnterTimer = this.openWithTimeout(e, mouseEnterDelay);
    };

    // ---------------------
    // 行为
    // ---------------------
    open = (e) => {
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

    openWithTimeout = (e, delay) => {
        // react销毁了事件对象的所有属性，并且如果你需要异步使用事件建议使用e.persist()，
        // 所以有些事件的属性(e.g currentTarget)请求到却是null，所有这里我们直接clone
        const eventClone = { ...e };
        return setTimeout(() => this.open(eventClone), delay || 0);
    };

    close = (e) => {
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

    closeWithTimeout = (e, delay) => {
        // react消除了所有的事件对象，并且如果你需要异步使用事件建议使用e.persist()，
        // 然而有些事件属性(e.g. currentTarget)请求到却是null，所有这里我们直接clone
        const eventClone = { ...e };
        return setTimeout(() => {
            this.close(eventClone);
        }, delay || 0);
    };

    // ---------------------
    // 组件生命周期
    // ---------------------
    componentDidMount() {
        const { onMount } = this.props;
        this.renderBox();
        if (onMount) {
            onMount(null, this.props);
        }
    }

    componentWillReceiveProps(nextProps) {
        let newState = {};
        if (nextProps.isOpen !== this.props.isOpen) {
            newState.isOpen = nextProps.isOpen;
        }
        this.setState(newState);
    }

    componentDidUpdate(prevProps, prevState) {
        this.renderBox();
        if (prevProps.isOpen && !this.state.isOpen) {
            this.unmountBox();
        }
    }

    componentWillUnmount() {
        const { onUnmount } = this.props;

        this.unmountBox(true);
        if (onUnmount) {
            onUnmount(null, this.props);
        }
    }

    // ---------------------
    // Box渲染／卸载
    // ---------------------
    mountBox = () => {
        if (this.rootNode) return;

        const { prepend, mountNode, onMount } = this.props;

        this.rootNode = document.createElement('div');

        if (prepend) {
            mountNode.insertBefore(this.rootNode, mountNode.firstElementChild);
        } else {
            mountNode.appendChild(this.rootNode);
        }

        // 添加事件监听
        this.handleDocumentClickListener = addEventListener(document.body, 'click', this.handleDocumentClick);
        this.handleEscapeListener = addEventListener(document.body, 'keydown', this.handleEscape);

        if (onMount) onMount(null, this.props);
    };

    renderBox() {
        if (!this.state.isOpen) return;

        const { children, className, style } = this.props;

        this.mountBox();

        this.rootNode.className = className || '';
        this.rootNode.style = style || '';

        // 每次重新渲染的时候，在添加新新节点之前移除事件监听
        if (this.BoxNode && this.handleBoxMouseEnterListener && this.handleBoxMouseLeaveListener) {
            this.handleBoxMouseEnterListener.remove();
            this.handleBoxMouseLeaveListener.remove();
        }

        ReactDOM.unstable_renderSubtreeIntoContainer(
            this,
            React.Children.only(children),
            this.rootNode,
            () => {
                this.BoxNode = this.rootNode.firstElementChild;

                this.handleBoxMouseEnterListener = addEventListener(this.BoxNode, 'mouseenter', this.handleBoxMouseEnter);
                this.handleBoxMouseLeaveListener = addEventListener(this.BoxNode, 'mouseleave', this.handleBoxMouseLeave);
            }
        )
    }

    unmountBox() {
        if (!this.rootNode) return;

        ReactDOM.unmountComponentAtNode(this.rootNode);
        this.rootNode.parentNode.removeChild(this.rootNode);

        // 移除事件监听
        this.handleDocumentClickListener.remove();
        this.handleEscapeListener.remove();
        this.handleDocumentClickListener = null;
        this.handleEscapeListener = null;

        // Clean up timers
        clearTimeout(this.mouseEnterTimer);
        clearTimeout(this.mouseLeaveTimer);

        this.handleBoxMouseEnterListener.remove();
        this.handleBoxMouseLeaveListener.remove();
        this.handleBoxMouseEnterListener = null;
        this.handleBoxMouseLeaveListener = null;

        this.rootNode = null;
        this.BoxNode = null;

        const { onUnmount } = this.props;
        if (onUnmount) onUnmount(null, this.props);
    }

    handleRef = c => {
        this.triggerNode = ReactDOM.findDOMNode(c)
    };

    render() {
        const { trigger } = this.props;

        if (!trigger) return null;

        // poptip/tooltip 使用
        return React.cloneElement(trigger, {
            ref: this.handleRef,
            onBlur: this.handleTriggerBlur,
            onClick: this.handleTriggerClick,
            onFocus: this.handleTriggerFocus,
            onMouseLeave: this.handleTriggerMouseLeave,
            onMouseEnter: this.handleTriggerMouseEnter,
            className: classnames('box-trigger', trigger.props.className),
        });
    }
}

export default Box;
