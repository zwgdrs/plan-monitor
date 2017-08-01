/**
 * col.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/4 下午8:59
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export default function Col(props) {
    const { prefixCls, size, offset, order, align, children, className, colStyle } = props;

    let classes = classNames(prefixCls, {
        [`${prefixCls}-${size}`]: size,
        [`${prefixCls}-offset-${offset}`]: offset,
        [`${prefixCls}-order-${order}`]: order,
        [`${prefixCls}-align-${align}`]: align,
    });

    return (
        <div className={classes} style={colStyle}>
            <div className={className}>{children}</div>
        </div>
    )
};

Col.propTypes = {
    offset: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    size: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    order: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
    ]),
    align: PropTypes.oneOf(['top', 'bottom', 'middle', 'stretch']),
    colStyle: PropTypes.object,
};

Col.defaultProps = {
    prefixCls: 'column',
};
