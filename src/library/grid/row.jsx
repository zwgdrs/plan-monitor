/**
 * row.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/5 下午4:38
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
    justify: PropTypes.oneOf(['left', 'right', 'center', 'between', 'around']),
    align: PropTypes.oneOf(['top', 'bottom', 'middle', 'stretch']),
    gutter: PropTypes.number, //栅格间隔 20
    number: PropTypes.number, //个数 24
    prefixCls: PropTypes.string,
    expanded: PropTypes.bool,
    collapse: PropTypes.bool,
};

const defaultProps = {
    prefixCls: 'row',
    gutter: 20,
    number: 24,
    expanded: false,
    collapse: false,
};

export default function Row(props) {
    const { prefixCls, children, expanded, collapse, justify, align, className } = props;

    let classes = classNames(prefixCls, {
        [`${prefixCls}-justify-${justify}`]: justify,
        [`${prefixCls}-align-${align}`]: align,
        expanded,
        collapse,
    },className);

    return <div className={classes}>{children}</div>;
};

Row.propTypes = propTypes;
Row.defaultProps = defaultProps;
