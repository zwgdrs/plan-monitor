import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Radio from './radio';

function getCheckedValue(children) {
    let value = null;
    let matched = false;
    React.Children.forEach(children, (radio: any) => {
        if (radio && radio.props && radio.props.checked) {
            value = radio.props.value;
            matched = true;
        }
    });
    return matched ? { value } : undefined;
}


export default class RadioGroup extends PureComponent {
    static defaultProps = {
        disabled: false,
    };

    static childContextTypes = {
        radioGroup: PropTypes.any,
    };

    constructor(props) {
        super(props);
        let value;
        if ('value' in props) {
            value = props.value;
        } else if ('defaultValue' in props) {
            value = props.defaultValue;
        } else {
            const checkedValue = getCheckedValue(props.children);
            value = checkedValue && checkedValue.value;
        }
        this.state = {
            value,
        };
    }

    getChildContext() {
        return {
            radioGroup: {
                onChange: this.onRadioChange,
                value: this.state.value,
                disabled: this.props.disabled,
            },
        };
    }

    componentWillReceiveProps(nextProps) {
        if ('value' in nextProps) {
            this.setState({
                value: nextProps.value,
            });
        } else {
            const checkedValue = getCheckedValue(nextProps.children);
            if (checkedValue) {
                this.setState({
                    value: checkedValue.value,
                });
            }
        }
    }

    onRadioChange = e => {
        const lastValue = this.state.value;
        const { value } = e.target;
        if (!('value' in this.props)) {
            this.setState({
                value,
            });
        }
        const onChange = this.props.onChange;
        if (onChange && value !== lastValue) {
            onChange(e);
        }
    }

    render() {
        const {
            value,
        } = this.state;
        const props = this.props;
        const { prefixCls = 'ne-radio-group', className = '' } = props;
        const classString = classNames(prefixCls, {
            [`${prefixCls}-${props.size}`]: props.size,
        }, className);
        let children = props.children;
    // 如果存在 options, 优先使用
        if (props.options && props.options.length > 0) {
            children = props.options.map((option, index) => {
                if (typeof option === 'string') {
                    return (
                        <Radio
                            key={index}
                            disabled={this.props.disabled}
                            value={option}
                            onChange={this.onRadioChange}
                            checked={value === option} >
                            {option}
                        </Radio>
                    );
                } else {
                    return (
                        <Radio
                            key={index}
                            disabled={option.disabled || this.props.disabled}
                            value={option.value}
                            onChange={this.onRadioChange}
                            checked={value === option.value} >
                            {option.label}
                        </Radio>
                    );
                }
            });
        }
        return (
            <div
                className={classString}
                style={props.style}
                onMouseEnter={props.onMouseEnter}
                onMouseLeave={props.onMouseLeave} >
                {children}
            </div>
        );
    }
}
