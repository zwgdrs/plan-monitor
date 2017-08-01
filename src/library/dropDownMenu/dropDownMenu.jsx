import React, { PureComponent, Children, isValidElement } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Transition from 'react-transition-group/Transition';
import Menu from '../menu';
import ClickAwayListener from '../clickAwayListener';
import Icon from '../icon';

class DropDownMenu extends PureComponent {
    static propTypes = {
        prefixCls: PropTypes.string,
        className: PropTypes.string,
        defaultValue: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]),
        onChange: PropTypes.func,
    };
    static defaultProps = {
        prefixCls: 'ne-drop-down-menu',
    };

    constructor(props, context) {
        super(props, context);
        const {
            defaultValue,
        } = this.props;
        this.state = {
            showMenu: false,
            value: defaultValue,
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps.defaultValue !== this.props.defaultValue) {
            this.setState({
                value: newProps.defaultValue,
            });
        }
    }
    onChange = (e, item, key, value) => {
        const {
            onChange,
        } = this.props;
        this.setState({
            value,
        });
        this.onHideMenu();
        if (onChange) {
            onChange(e, key ,value);
        }
    }

    onShowMenu = () => {
        this.setState({
            showMenu: true,
        });
    }

    onHideMenu = () => {
        this.setState({
            showMenu: false,
        });
    }

    render() {
        const {
            prefixCls,
            className,
            placeholder,
            children,
            // ...other
        } = this.props;
        const {
            showMenu,
            value,
        } = this.state;
        const classes = classNames(prefixCls, {
        });
        const containerClasses = classNames('drop-down-container', {
        }, className);
        const valueMap = {};
        Children.forEach(children, item => {
            const {
                value,
                children,
            } = item.props
            if (isValidElement(item)) {
                valueMap[value] = children;
            }
        });
        return (
            <ClickAwayListener onClickAway={this.onHideMenu}>
                <div
                    className={containerClasses}>
                    <Icon type="right-arrow" className="select-arrow"/>
                    <div
                        onClick={this.onShowMenu}
                        className={classes} >
                        {valueMap[value] || placeholder}
                    </div>
                    <Transition timeout={100} in={showMenu}>
                        {(status) => (
                            <Menu
                                onChange={this.onChange}
                                className={classNames(
                                    'select',
                                    [`select-${status}`])}>
                                {children}
                            </Menu>
                        )}
                        </Transition>
                </div>
            </ClickAwayListener>
        );
    }
}
export default DropDownMenu;
