import React from 'react';
import Tabs from '../tabs';

export default function Menu(props) {
    return (
        <Tabs
            {...props}
            defaultActiveKey={-1}
            showInkbar={false}
            prefixCls="ne-menu"
            role="menu"/>
    )
}
