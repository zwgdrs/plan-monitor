/**
 * Confirm.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/11 下午5:28
 */

import React from 'react';
import ReactDOM from 'react-dom';
import extend from 'object-assign';
import classNames from 'classnames';
import Modal, { defaultProps } from './Modal';
import ActionButton from './ActionButton';
import {Row, Col} from '../grid';
import Icon from '../icon';
import omit from '../util/omit';

// type有info,success,error,warning,confirm
// props 与 Modal.jsx 中属性大致一致
const Confirm = (config) => {
    const props = extend({}, defaultProps, {
        iconType: 'attention',
        isOpen: true,
        prefixCls: 'ne-confirm',
        size: 'sm',
    }, config);
    const prefixCls = props.prefixCls || 'ne-confirm';
    let rootNode = document.createElement('div');

    document.body.appendChild(rootNode);

    function close(...args) {
        const unmountResult = ReactDOM.unmountComponentAtNode(rootNode);
        if (unmountResult && rootNode.parentNode) {
            rootNode.parentNode.removeChild(rootNode);
        }
        const triggerCancel = args && args.length &&
            args.some(param => param && param.triggerCancel);
        if (props.onClose && triggerCancel) {
            props.onClose(...args);
        }
    }

    let footer = [
        <ActionButton type="primary" onClick={props.onOk} autoFocus key={`${prefixCls}-ok`} closeModal={close}>
            {props.okText}
        </ActionButton>,
    ];

    if (props.onCancel) {
        footer.push(
            <ActionButton hollow onClick={props.onCancel} key={`${prefixCls}-cancel`} closeModal={close}>
                {props.cancelText}
            </ActionButton>
        );
    }

    const classString = classNames({
        [`${prefixCls}-${props.type}`]: true,
    }, props.className);

    ReactDOM.render(
        <Modal className={classString} mountNode={rootNode}
            onClose={(e) => close({ triggerCancel: true })}
            {...omit(props, ['className', 'type', 'iconType', 'title'])}>
            <Modal.Content>
                {props.title && <div className={`${prefixCls}-icon ${prefixCls}-icon-${props.type}`}><Icon type={props.iconType} /></div>}
                <div className={`${prefixCls}-content`}>
                    {props.title && <span className={`${prefixCls}-content-title`}>{props.title}</span>}
                    <div className={`${prefixCls}-content-desc`}>{props.content}</div>
                </div>
            </Modal.Content>
            <Modal.Footer>{footer}</Modal.Footer>
        </Modal>
        , rootNode
    );

    return {
        close,
    };
};

export default Confirm;