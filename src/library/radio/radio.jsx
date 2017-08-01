import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import RcCheckbox from './checkbox';
import classNames from 'classnames';

export default class Radio extends PureComponent {

    static defaultProps = {
        prefixCls: 'ne-radio',
        type: 'radio',
    };

    static contextTypes = {
        radioGroup: PropTypes.any,
    };

    render() {
        const { props, context } = this;
        const {
          prefixCls,
          className,
          children,
          style,
          ...other
        } = props;
        const { radioGroup } = context;
        const radioProps = { ...other };
        if (radioGroup) {
            radioProps.onChange = radioGroup.onChange;
            radioProps.checked = props.value === radioGroup.value;
            radioProps.disabled = props.disabled || radioGroup.disabled;
        }
        const wrapperClassString = classNames(className, {
            [`${prefixCls}-wrapper`]: true,
            [`${prefixCls}-wrapper-checked`]: radioProps.checked,
            [`${prefixCls}-wrapper-disabled`]: radioProps.disabled,
        });
        return (
            <label
                className={wrapperClassString}
                style={style}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave} >
                <RcCheckbox
                    {...radioProps}
                    prefixCls={prefixCls} />
                    {children !== undefined ? <span>{children}</span> : null}
            </label>
        );
    }
}
