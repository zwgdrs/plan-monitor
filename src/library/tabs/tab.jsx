import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const propTypes = {
    prefixCls: PropTypes.string,
    className: PropTypes.string,
};

Tab.propTypes = propTypes;
export default function Tab({
    className,
    index,
    actived = false,
    disabled = false,
    prefixCls = 'ne-tab',
    value,
    ...other
}) {
    const classes = classNames(prefixCls, {
        [`${prefixCls}-actived`]: actived,
        [`${prefixCls}-disabled`]: disabled,
    }, className);
    delete other.onActive;
    delete other.value;
    return (
        <div
            {...other}
            role="tab"
            className={classes}/>
    );
};
