/**
 * icon.jsx
 *
 * @Author: jruif
 * @Date: 2017/6/30 下午4:26
 */

import React from 'react';
import classNames from 'classnames';

const Icon = (props) => {
    let {
        prefixCls = 'ne-icon', type,
        spin = false, style,
        loading = 'spin2', className,
    } = props;

    const classes = classNames(prefixCls, {
        [`${prefixCls}-${ type === 'loading' ? loading : type }`]: true,
        'animate-spin': spin || type === 'loading',
    }, className);

    return <i className={classes} style={style} />

};

export default Icon;