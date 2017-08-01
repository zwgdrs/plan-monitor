/**
 * ContentManager.jsx
 *
 * @Author: wangyinan
 * @Date: 2017/7/25 下午2:10
 */
import React, { PureComponent } from 'react';
import { Tabs } from '../../library';
import "./style.scss";

export default class Faq extends PureComponent {
    state = {
        page: 'account',
    };

    onTabChange = (e, tab, key, value) => {
        this.setState({
            page: value,
        });
    };

    render() {
        const {
            page,
        } = this.state;
        const account = (
            <ul styleName="content">
                <li>
                    <span styleName="question">如何修改网易号类型？</span>
                    <p>
                        网易号目前不支持媒体、自媒体、组织机构和企业账号类型之间的修改，如果因为注册失误造成要修改账号类型，请准备一个未注册入驻网易号的网易通行证或网易邮箱重新申请正确的网易号类型。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        提交了网易号申请后，审核需要多久？
                    </span>
                    <p>
                        提交申请后，平台会在一个工作日内给出审核结果。
                    </p>
                </li>
                <li>
                    <span styleName="question">一个身份证能否注册多个网易号？</span>
                    <p>
                        一个身份证目前可以注册4个网易号。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        帐号审核申请可以提交几次？
                    </span>
                    <p>
                        为了不影响其他账号的审核，一个账号24h内最多提交2次审核申请。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        如果出现网易号名称重复怎么办？
                    </span>
                    <p>
                        如果您的账号被冒名，您可以：
                    </p>
                    <ul>
                        <li>
                            1. 账号同名，并盗用账号的图标、简介、文章，请发送相关证据（其他平台后台截图、抄袭文章链接、营业执照等）到wangyihao@service.netease.com，网易号运营负责清理冒名账号。
                        </li>
                        <li>
                            2. 只是账号同名，并未抄袭文章，账号有注册商标，发送注册商标扫描照片至wangyihao@service.netease.com，网易号运营负责清理同名账号；没有注册商标，不算侵权，原则上无法处理。
                        </li>
                    </ul>
                </li>
                <li>
                    <span styleName="question">
                        账号被假冒怎么办？
                    </span>
                    <p>
                        请发邮件到网易号客服邮箱（wangyihao@service.netease.com）申诉，提供自己对被假冒账号的所有权证明，例如被假冒账号的管理后台截图，平台确认后会对假冒账号做封禁处理。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        为什么帐号申请上线会被拒绝？
                    </span>
                    <p>请核查您是否符合入驻网易号相关要求，详细入驻要求见以下链接:</p>
                    <p>
                        <a href="http://dy.163.com/media_static/html/handbook.html#account">
                            http://dy.163.com/media_static/html/handbook.html#account
                        </a>
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        不同类型的帐号如何选择，有什么不一样？
                    </span>
                    <p>
                        自媒体：适合垂直领域专家、意见领袖、评论家等个人创作者或以内容生产为主的自媒体公司/机构申请；自媒体公司类型为可以提供营业执照的以内容生产为主的公司；自媒体机构类型为可提供组织机构代码的相关机构。
                    </p>
                    <p>
                        组织机构：适合党政机关、事业单位和各类公共场馆、公益机构、学校/培训机构、民间组织等申请。
                    </p>
                    <p>
                        企业：适合企业、公司及其分支机构、旗下品牌等申请，主要用于商业推广目的。
                    </p>
                </li>
            </ul>
        );
        const platform = (
            <ul styleName="content">
                <li>
                    <span styleName="question">可以申请增加网易号每天的发文篇数吗？</span>
                    <p>
                        平台暂未放开发文篇数限制，请注意关注平台最新公告。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        可以申请修改更改网易号的登录方式吗？
                    </span>
                    <p>
                        可以的！目前网易号暂不支持用户自己修改登录邮箱，如需修改登录邮箱，请发邮件到网易号客服邮箱wangyihao@service.netease.com申请，提供可证明账号为个人所有的截图，并提供正当、充分的理由，如果是公司账号需提供公司营业执照及授权文件，通过后由平台修改。
                    </p>
                </li>
                <li>
                    <span styleName="question">我可以在发文后台设置内容样式吗？</span>
                    <p>
                        目前网易号后台仅支持平台提供的内容样式，暂不支持第三方排版工具。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        我的内容源同步为什么没法抓取/暂停抓取？
                    </span>
                    <p>
                        如果出现没法抓取/暂停抓取的情况，可能原因有：
                    </p>
                    <ul>
                        <li>
                            1. 填写的同步链接有误或已失效；
                        </li>
                        <li>
                            2. 填写的同步链接暂未通过审核；
                        </li>
                        <li>
                            3. 抓取有一定的延时，同步链接审核通过后24小时内生效，请耐心等待。
                        </li>
                    </ul>
                    <p>
                        （注：如无以上情况，请及时联系客服邮箱，寻求技术支持）
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        抓取内容源，可以同步视频音频么？
                    </span>
                    <p>
                        暂不支持视频音频同步。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        抓取内容可以不改变原排版吗？
                    </span>
                    <p>
                        不可以，为了平台阅读体验的一致性，网易号暂时不支持第三方排版工具。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        阅读量为什么是0，能实时统计吗？
                    </span>
                    <p>
                        可能是如下原因：
                    </p>
                    <ul>
                        <li>
                            数据延迟，一般在中午前更新前一天的数据，数据不会实时更新；
                        </li>
                        <li>
                            数据统计无误，文章未能引起读者兴趣，具体请参见文章推荐部分内容。
                        </li>
                    </ul>
                </li>
                <li>
                    <span styleName="question">
                        能增加单篇文章阅读量、曝光量、用户分析等维度的数据吗？
                    </span>
                    <p>感谢您的建议，数据正在完善中，请耐心等待。</p>

                </li>
            </ul>
        );
        const recommend = (
            <ul styleName="content">
                <li>
                    <span styleName="question">文章审核为什么不通过？</span>
                    <p>
                        请参照《网易号运营手册》文章审核标准部分内容。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        文章如何能被推荐，小编决定我能否上头条吗？
                    </span>
                    <p>
                        每篇文章都有推荐机会，网易号采取智能推荐方式，由系统根据用户的兴趣点与文章的匹配程度进行推荐，编辑无权决定能否上头条。
                    </p>
                </li>
                <li>
                    <span styleName="question">为什么我的文章阅读量这么低？</span>
                    <p>
                        可能是如下原因：
                    </p>
                    <ul>
                        <li>
                            和该篇文章兴趣点匹配的用户数量少；
                        </li>
                        <li>
                            同内容或兴趣点的文章数量过多;
                        </li>
                        <li>
                            文章质量差，被投诉过多。
                        </li>
                    </ul>
                    <p>
                        详细可参考推荐规则。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        如何提高网易号的曝光量和阅读量？
                    </span>
                    <p>
                        保证内容原创和优质，优化好标题，选择匹配的分类，选择优质封面图，有助于提升曝光量和阅读量。详细可参考推荐规则。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        为什么我的文章/视频被下线了？
                    </span>
                    <p>
                        被下线有以下几种可能：
                    </p>
                    <ul>
                        <li>
                            存在抄袭、侵权、非授权转载等情况;
                        </li>
                        <li>
                            存在涉黄涉暴涉恐信息;
                        </li>
                        <li>
                            存在严重推广营销行为;
                        </li>
                        <li>
                            存在虚假信息;
                        </li>
                        <li>
                            违反互联网相关规定。
                        </li>
                    </ul>
                </li>
            </ul>
        );
        const income = (
            <ul styleName="content">
                <li>
                    <span styleName="question">
                        我能获得多少收益，这些收益是如何计算的？
                    </span>
                    <p>
                        账号每月的补贴奖励是根据每月流量数据、跟贴数据、分享数据综合计算以后得出。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        为何我的收益这么少？
                    </span>
                    <p>
                        账号收益一般和每月流量数据、跟贴数据、分享数据呈正相关关系，您的收益取决于相关的数据表现。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        网易号会开通广告分成和自营广告吗？
                    </span>
                    <p>
                        目前网易号暂无广告分成和自营广告的计划，请关注最新的平台通知。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        网易号同时发布视频和文章数据怎么算？
                    </span>
                    <p>
                        收益和指数，会考虑所有内容数据，参考平台显示数字即可。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        为什么收益显示不正常？
                    </span>
                    <p>
                        账号收益统计周期为每月26日-次月25日，请确定您在该时段内的收益。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        企业号没收益？
                    </span>
                    <p>
                        如果您是企业号适合企业、公司及其分支机构、旗下品牌等申请，主要用于商业推广目的，所以不会有收益。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        汽车类账号没收益？
                    </span>
                    <p>
                        如果您是汽车类的账号，目前网易号整体规则正在调整，汽车类网易号会优先推出合伙计划，对于合伙的网易号会有更多的收获，例如在内容获得更大推荐力度、内容优先获得推荐、优先参与网易汽车内容协同营销项目及获得项目分成、以及获得网易汽车2017年度新车总评榜评委资格。为了加大对优质汽车号的宣传，网易号还将推出“车态度影响力TOP20榜单”，有助于优质号在商业化变现上获得更多收益。所以目前汽车类账号暂时不享有收益。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        如何提取收益？
                    </span>
                    <p>
                        每月收益发放方式为线上发放，在每月奖金出炉后，账号可进入自己的收益后台进行提现：收益提现后，钱可由平台直接打进账号所绑定的网易宝，具体绑定的网易宝账号在收益提现页面中会显示（一般为该账号的网易通行证，即登录邮箱，网易宝账号与网易通行证应该是一致的）。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        可提现金额为什么会和我统计的不一样？
                    </span>
                    <p>
                        由于我们需要对收益进行核算，所以提现数额会在提现日期到达后的1-3个工作日内进行同步，在此之前您可以通过“时间段内收益统计”对您的收益进行查看。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        网易宝ID被占用怎么办？
                    </span>
                    <p>
                        网易宝ID就是账号登陆ID，如果您的网易宝ID被占用，这种情况网易号平台无权操作；大多是用户的通行证密码泄露，被别人激活了自己网易宝，应向联系网易宝团队进行咨询或投诉；网易宝服务邮箱：wybsupport@service.netease.com。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        怎样激活网易宝？
                    </span>
                    <p>
                        具体方法登录网易号后台，在左侧【我的收益】-【收益结算】下有详细攻略：<a href="http://dy.163.com/v2/article/detail/BOLIITKL0521879B.html">http://dy.163.com/v2/article/detail/BOLIITKL0521879B.html</a>。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        如何更换网易宝账号？
                    </span>
                    <p>
                        如果现有账号由于自身原因更换运营者，需要说明更换原因，并提供原有运营者手持身份证的清晰照片、更换后的新运营者手持身份证的清晰照片、该账号的网易号后台截图，企业还需提供营业执照扫描件，并将上述材料发邮件至：wangyihao@service.netease.com申请处理；处理成功更换运营者后，新的运营者登录后进入收益后台，账号对应的网易宝会自动更换成新运营者的网易宝（如新运营者网易宝未激活，可按激活指引操作激活）。
                    </p>
                </li>
            </ul>
        )
        const original = (
            <ul styleName="content">
                <li>
                    <span styleName="question">
                        申请开通“原创”功能需要符合哪些条件？
                    </span>
                    <p>
                        媒体和自媒体类型账号，须是二星及以上账号才可申请开通“原创”功能。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        开通“原创”功能有哪些步骤？
                    </span>
                    <p>
                        二星及以上账号登录后台，在左侧【账号设置】-【账号特权】下选择“原创资质”的申请，待平台审核通过后，“原创”功能即开通。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        提交完申请后，多久才能知道结果？
                    </span>
                    <p>
                        收到原创功能申请后一周内平台会给出审核结果。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        开通“原创”功能能享有哪些权益？
                    </span>
                    <p>
                        开通“原创”功能后，内容将会有更多被推荐的机会；也会影响到网易号指数。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        如果“原创”申请未通过，多久后可再次提交？
                    </span>
                    <p>
                        目前“原创”申请未通过的，须30天以后才能再次提交。
                    </p>
                </li>
                <li>
                    <span styleName="question">
                        如何使用“原创”功能？
                    </span>
                    <p>
                        可在后台对手发文章添加原创标签，以提高被推荐的机会。如滥用原创功能，一经证实平台将严肃处理。
                    </p>
                </li>
            </ul>
        );
        const content = {
            account,
            platform,
            recommend,
            income,
            original,
        };
        return (
            <div styleName="paper">
                <Tabs
                    tabWidth="140px"
                    onChange={this.onTabChange}
                    styleName="tabs">
                    <Tabs.Tab key="account" value="account">账号相关</Tabs.Tab>
                    <Tabs.Tab key="platform" value="platform">平台使用</Tabs.Tab>
                    <Tabs.Tab key="recommend" value="recommend">内容推荐</Tabs.Tab>
                    <Tabs.Tab key="income" value="income">收益分成</Tabs.Tab>
                    <Tabs.Tab key="original" value="original">原创功能</Tabs.Tab>
                </Tabs>
                {content[page]}
            </div>
        );
    }
};
