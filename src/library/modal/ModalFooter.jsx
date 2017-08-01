/**
 * ModalFooter.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/7 下午10:02
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { hasChildren } from '../util/isType';

const ModalFooter = (props) => {
    const { prefixCls = 'ne-modal-footer', className, children } = props;
    let classes = classNames(prefixCls, className);

    return (
        <div className={classes}>
            { hasChildren(children) ? children : '' }
        </div>
    )
};

ModalFooter.propTypes = {
    content: PropTypes.string,
    children: PropTypes.node,
    className: PropTypes.string,
};

ModalFooter.displayName = 'ModalFooter';

export default ModalFooter;