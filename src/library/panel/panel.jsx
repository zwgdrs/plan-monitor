import React from 'react'
import isFunction from 'lodash/isFunction'
import PropTypes from 'prop-types'

class Panel extends React.PureComponent {
    static propTypes = {
        prefixCls: PropTypes.string,
        header: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.func,
        ]),
        body: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.func,
        ]),
        footer: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.func,
        ]),
    };

    static defaultProps = {
        prefixCls: '',
        // tabHeader: [],
        body: '',
        footer: '',
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            tabActive: 0,
        }
    }

    componentDidMount() {
        const {title} = this.props
        this.setState({
            tabActive: title && title[0] ? title[0].type : '',
        })
    }

    handleTabClick = (type) => {
        const {onTitleClick} = this.props
        onTitleClick(type)
        this.setState({
            tabActive: type,
        })
    }
    render() {
        const {prefixCls, header, body, footer, tabHeader, normalHeader, title, onTitleClick, ...other} = this.props
        return (
            <div className={`${prefixCls}panel`} {...other}>
                {
                normalHeader &&
                <div className="panel-normal-header">
                    <div className="panel-normal-title">{title}</div>
                    {isFunction(header) ? header() : header}
                </div>
            }
                {
                    tabHeader &&
                    <div className="panel-tab-header">
                        <div className="panel-tab-title">
                            {
                                title.map((item, index) => {
                                    const {type, desc} = item
                                    if (type === this.state.tabActive) {
                                        const tabWidth = index ? '126px' : '125px'
                                        const borderStyle = {
                                            width: tabWidth,
                                            borderLeft: index ? '1px solid #DDDDDD' : 'none',
                                            borderRight: '1px solid #DDDDDD',
                                        }
                                        return (
                                            <div className="panel-tab-item" key={item.type} style={borderStyle} onClick={() => this.handleTabClick(type)}>
                                                {desc}
                                                <div className="activeTab" />
                                            </div>
                                        )
                                    } else {
                                        return (
                                            <div className="panel-tab-item" key={item.type} onClick={() => this.handleTabClick(type)}>{desc}</div>
                                        )
                                    }

                                })
                            }
                        </div>
                        {isFunction(header) ? header() : header}
                    </div>
                }
                <div className="panel-body">{isFunction(body) ? body() : body}</div>
                {footer && <div className="panel-foot">{isFunction(footer) ? footer() : footer}</div>}
            </div>
        )
    }
}

export default Panel;