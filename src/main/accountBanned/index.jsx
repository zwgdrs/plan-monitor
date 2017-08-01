/**
 * ContentManager.jsx
 *
 * @Author: wangyinan
 * @Date: 2017/7/24 下午1:40
 */
import React from 'react';
import { Button } from '../../library';
import banIcon from '../../assets/images/ban-icon.png';
import "./style.scss";

export default function AccountBanned(props) {
    return (
        <div styleName="paper">
            <img src={banIcon} styleName="icon" alt="封禁" />
            <p>抱歉，您的帐号“严肃八卦”已被封禁</p>
            <p>封禁原因：多次被举报抄袭</p>
            <p styleName="contact">如有问题请反馈到客服邮箱：wangyihao@163.com</p>
            <Button type="primary" styleName="quit">退出登录</Button>
        </div>
    );
};
