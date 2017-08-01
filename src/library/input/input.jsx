import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

class Input extends React.PureComponent {
    static propTypes = {
        error: PropTypes.bool,
        disabled: PropTypes.bool,
        prefixCls: PropTypes.string,
        type: PropTypes.string,
        className: PropTypes.string,
        value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    };
    static defaultProps = {
        prefixCls: 'ne-input',
        error: false,
        disabled: false,
        type: 'text',
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            value: this.props.value,
        };
    }

    // componentWillMount() {
    //     const {
    //         value,
    //     } = this.props;
    //     this.setState({
    //         value,
    //     });
    // }
    //
    componentWillReceiveProps(nextProps) {
        const {
            value,
        } = nextProps;
        if (value !== this.props.value) {
            this.setState({
                value,
            });
        }
    }

    onChange = e => {
        const {
            onChange,
        } = this.props;
        this.setState({ value: e.target.value });
        if (onChange) {
            onChange(e);
        }
    }

    onFocus = e => {
        const { onFocus } = this.props
        onFocus && onFocus(e);
    }

    onBlur = e => {
        const { onBlur } = this.props
        onBlur && onBlur(e);
    }

    render() {
        const {
            error,
            type,
            className,
            prefixCls,
            ...other
        } = this.props;
        const {
            value,
        } = this.state;
        const classes = classNames(prefixCls, {
            [`${prefixCls}-error`]: error,
        }, className);
        return (
            <input
                {...other}
                type={type}
                value={value}
                className={classes}
                onChange={this.onChange}
                onFocus={this.onFocus}
                onBlur={this.onBlur} />

        );
    }
}
export default Input;
