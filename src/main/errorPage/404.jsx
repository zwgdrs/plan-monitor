import React from 'react'
import {Link} from 'react-router-dom'
import "./style.scss";
export default class NotFound extends React.PureComponent {
    render() {
        return (
            <Link to="index" ><div styleName="not-found"/></Link>
        )
    }
}