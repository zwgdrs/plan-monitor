/**
 * ModalHeader.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/7 下午10:02
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { hasChildren } from '../util/isType';
import Button from '../button';

const ModalHeader = (props) => {
    const {
        children, prefixCls = "ne-modal", className, onClose = () => {
        }, hasCloseBtnOnHeader,
    } = props;
    let classes = classNames(`${prefixCls}-header`, className);

    return <div className={classes}>
        <h4>
            { hasChildren(children) ? children : '' }
        </h4>
        {
            hasCloseBtnOnHeader &&
            <Button icon="cancel" className={`${prefixCls}-close`} onClick={onClose} size="small" />
        }
    </div>
};

ModalHeader.propTypes = {
    content: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
    onClose: PropTypes.func,
};

ModalHeader.displayName = 'ModalHeader';

export default ModalHeader;