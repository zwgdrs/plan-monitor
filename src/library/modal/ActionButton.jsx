/**
 * ActionButton.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/11 下午11:35
 */

import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import Button from '../button';

class ActionButton extends React.PureComponent {
    static propTypes = {
        onClick: PropTypes.func,
        closeModal: PropTypes.func,
        autoFocus: PropTypes.bool,
    };

    static defaultProps = {};

    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
        }
    }

    componentDidMount() {
        if (this.props.autoFocus) {
            const $this = ReactDOM.findDOMNode(this);
            if ($this) {
                this.timeoutId = setTimeout(() => $this.focus());
            }
        }
    }

    componentWillUnmount() {
        clearTimeout(this.timeoutId);
    }

    onClick = () => {
        const { onClick, closeModal } = this.props;
        if (onClick) {
            let ret = onClick();
            if (!ret) {
                closeModal();
            }
            if (ret && ret.then) {
                this.setState({ loading: true });
                ret.then((...args) => {
                    closeModal(...args);
                }, () => {
                    this.setState({ loading: false });
                });
            }
        } else {
            closeModal();
        }
    };

    render() {
        let { onClick, closeModal, children, ...other } = this.props;
        return (
            <Button onClick={this.onClick} loading={this.state.loading} {...other}>{children}</Button>
        )
    }
}

export default ActionButton;