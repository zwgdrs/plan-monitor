import React from 'react';
import { Tab } from '../tabs';

export default function MenuItem(props) {
    return (
        <Tab
            {...props}
            prefixCls="ne-menu-item"
            role="menu"/>
    )
}
