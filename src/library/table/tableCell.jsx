import React from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';

class TD extends React.Component {
    static defaultProps = {};
    static propTypes = {
        content: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.array,
            PropTypes.bool,
            PropTypes.object,
        ]),
        render: PropTypes.func,
    };

    render() {
        let {content, render, ...other} = this.props;
        return (
            <td {...other}>{ isFunction(render) ? render(content) : content }</td>
        )
    }
}


export default TD;