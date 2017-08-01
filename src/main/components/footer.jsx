/**
 * footer.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/20 下午5:53
 */

import React from 'react';

const Footer = (props) => {
    return (
        <footer>
            <div className={`footer-main ${props.className || ''}`}>
                <span className="footer-copyright">
                    <span className="footer-copyright-icon">&copy;</span>
                     1997-{(new Date()).getFullYear()} 网易公司版权所有
                </span>
                <a href="http://corp.163.com/">About NetEase</a>
                <div className="footer-link">
                    <a target="_blank" rel="noopener noreferrer" href="http://gb.corp.163.com/gb/about/overview.html">公司简介</a>
                    <a target="_blank" rel="noopener noreferrer"
                        href="http://gb.corp.163.com/gb/contactus.html">联系方法</a>
                    <a target="_blank" rel="noopener noreferrer" href="http://corp.163.com/gb/job/job.html">招聘信息</a>
                    <a target="_blank" rel="noopener noreferrer" href="http://help.163.com/ ">客户服务</a>
                    <a target="_blank" rel="noopener noreferrer" href="http://gb.corp.163.com/gb/legal.html">隐私政策</a>
                    <a target="_blank" rel="noopener noreferrer" href="http://emarketing.biz.163.com/">广告服务</a>
                    <a target="_blank" rel="noopener noreferrer" href="http://sitemap.163.com/">网站地图</a>
                    <a target="_blank" rel="noopener noreferrer" href="http://t.163.com/zt/feedback">意见反馈</a>
                    <a target="_blank" rel="noopener noreferrer" href="http://www.bjjubao.org/index.htm">不良信息举报</a>
                </div>
            </div>
        </footer>
    )
};
export default Footer;