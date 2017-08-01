/*
 * App.js
 *
 * */
import React, { Component } from 'react';

import {
    Icon, Button, Carousel, Progress, Modal, Radio,
    Input, Row, Col, Tabs, /*Menu, MenuItem, DropDownMenu, Panel,*/
    Table, Tooltip, DatePicker, Pagination,
} from '../../library';

import CSSTransition from 'react-transition-group/CSSTransition';
import Transition from 'react-transition-group/Transition';

import './App.scss';

const carouselData = {
    imgList: [
        {
            img: 'http://t1.niutuku.com/960/24/24-617747.jpg',
            alt: 'banner',
        },
        { img: 'http://img06.tooopen.com/images/20160712/tooopen_sy_170083325566.jpg', alt: 'banner' },
        { img: 'http://pic51.nipic.com/file/20141023/2531170_115622554000_2.jpg', alt: 'banner' },
    ],
    imgWidth: 600,
    imgHeight: 500,
    time: 400, // 滑动一张图片所需要的时间
    interval: 3000, // 自动播放的时间间隔
    dots: 'dots',
    arrow: true, // 是否显示箭头
    autoPlay: true, // 是否自动播放
    onClick: (obj) => {
        console.log(obj)
    }, // 点击图片的回调，参数是当前的数据

};
// const tableData = {
//     columns: [
//         { title: 'id', key: 'id', style: { width: '200px', minWidth: '200px' } },
//         { title: 'title', key: 'title', style: { width: '200px', minWidth: '200px' } },
//         { title: 'desc', key: 'desc', style: { width: '200px', minWidth: '200px' } },
//         { title: "key", key: "key", style: { width: '200px', minWidth: '200px' } },
//         { title: "why", key: "why", style: { width: '200px', minWidth: '200px' } },
//         { title: "what", key: "what", style: { width: '200px', minWidth: '200px' } },
//         { title: "操作", key: "operation", style: { width: '200px', minWidth: '200px' } },
//     ],
//     dataSource: [
//         { id: 'first', title: '111', desc: '描述', key: '1' },
//         { id: 'second', title: '111', desc: '描述', key: '2' },
//         { id: 'third', title: '111', desc: '描述', key: '3' },
//         { id: 'forth', title: '111', desc: '描述', key: '4' },
//         { id: 'forth', title: '111', desc: '描述', key: '5' },
//         { id: 'forth', title: '111', desc: '描述123', key: '6' },
//     ],
//     longTable: true,
//     checkBox: true,
//     allBorder: false,
//     stripe: false,
//     isHover: true,
//     expandColumns: [
//         { title: 'id', key: 'id', style: { width: '200px', minWidth: '200px' } },
//     ],
// };

const tableData = {
    columns: [
        { title: '同步链接', key: 'fetchUrl', style: { width: '261px', minWidth: '261px' } },
        { title: '同步类型', key: 'type' },
        { title: "创建时间", key: 'createTime' },
        { title: "状态", key: 'state' },
        { title: "操作", key: 'id', render: (id) => <a href="#">删除</a> },
    ],
    checkbox: true,
    dataSource: [
        {
            id: 68094,
            wemediaId: '68357',
            fetchUrl: 'http://dpn.amwzuwrfiapvwo.dyr',
            type: '47678',
            createTime: '1500882924183',
            state: '58683',
        },
        {
            id: 68094,
            wemediaId: '68357',
            fetchUrl: 'http://dpn.amwzuwrfiapvwo.dyr',
            type: '47678',
            createTime: '1500882924183',
            state: '58683',
        },
        {
            id: 68094,
            wemediaId: '68357',
            fetchUrl: 'http://dpn.amwzuwrfiapvwo.dyr',
            type: '47678',
            createTime: '1500882924183',
            state: '58683',
        },
        {
            id: 68094,
            wemediaId: '68357',
            fetchUrl: 'http://dpn.amwzuwrfiapvwo.dyr',
            type: '47678',
            createTime: '1500882924183',
            state: '58683',
        },
        {
            id: 68094,
            wemediaId: '68357',
            fetchUrl: 'http://dpn.amwzuwrfiapvwo.dyr',
            type: '47678',
            createTime: '1500882924183',
            state: '58683',
        },
        {
            id: 68094,
            wemediaId: '68357',
            fetchUrl: 'http://dpn.amwzuwrfiapvwo.dyr',
            type: '47678',
            createTime: '1500882924183',
            state: '58683',
        },
    ],
    longTable: false,
    checkBox: true,
    allBorder: false,
    stripe: false,
    isHover: true,
    textCenter: true,
};
const datePicker = {
    type: 'date',
    placeholder: '说点啥好',
    format: 'YYYY-MM-DD HH:mm:ss',
    defaultValue: '2017-07-01 00:00:00',
    beginDateValue: '2017-07-01 00:00:00',
    endDateValue: '2017-07-01 00:00:00',
    onChange: (time) => console.log(time),
    selectType: 'select-day',
    readOnly: true,
    // disabled: true,
    showTime: true,
    disabled: false,
};

const Animation = ({ children, ...props }) => (
    <CSSTransition
        {...props}
        timeout={500}
        classNames="fade"
        onEntered={(node) => node.classList.add('fade-out')}
        onExited={(node) => node.classList.remove('fade-out')}>
        {children}
    </CSSTransition>
);

class App extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            isOpen: false,
            isOpen1: false,
            total: 200,
            current: 10,
            pageSize: 10,
            show: false,
        };
    }

    openModal = () => {
        this.setState({
            isOpen: true,
        });
    };

    openModal1 = () => {
        this.setState({
            isOpen1: true,
        })
    };

    handleAnimation = () => {
        this.setState({
            show: !this.state.show,
        });

        // this.timeout = setTimeout(() => {
        //     this.setState({
        //         show: false,
        //     });
        // }, 400);
    };

    openConfirm = () => {
        let confirm = Modal.confirm({
            title: false,
            content: <span>确定删除<b>《asda》</b>该视频？</span>,

            onOk: () => {
                // setTimeout(() => info.close(), 5000);
                return new Promise((resolve, reject) => {
                    let rs = Math.random() > 0.5;
                    console.log(rs);
                    setTimeout(() => rs ? reject() : resolve(), 2000);
                }).catch(() => {
                    confirm.close();
                });
            },
        });
    };

    render() {
        let tooltipContent = (
            <div>
                <p>错的事就是坐标错的事就是坐标</p>
                <p>错的事就是坐标</p>
                <p>
                    <Button size="small">取消</Button>
                    <Button size="small" type="primary">确定</Button>
                </p>
            </div>
        );
        return (
            <div className="App">
                <div className="app-btn-list">
                    <h3>按钮</h3>
                    <p>
                        主按钮：
                        <Button type="primary">确定</Button>
                        次按钮：
                        <Button>取消</Button>
                        仅边框：
                        <Button hollow>发布</Button>
                        <Button hollow type="secondary">发布</Button>
                        <Button shape="dashed">确定</Button>
                        <Button shape="dashed" type="success">确定</Button><br />
                        长按钮：
                        <Button size="large">下一页</Button>
                        小按钮：
                        <Button size="small">下一页</Button><br />
                        loading状态：
                        <Button loading>发布中</Button>
                        <Button loading type="primary">发布中</Button>
                        禁止状态：
                        <Button type="primary" disabled>发布</Button>
                        <Button loading type="primary" disabled>发布中</Button><br />
                        success:
                        <Button type="success">发布</Button>
                        warning:
                        <Button type="warning">发布</Button>
                        danger:
                        <Button type="danger">发布</Button><br />
                        icon:
                        <Button icon="right-arrow" size="small" />
                        <Button icon="edit-o" type="primary" size="small">编辑</Button>
                        <Button icon="ok" type="primary" size="small" shape="circle" />
                        <Button icon="ok-1" type="primary" size="small" shape="circle" hollow />
                    </p>
                    <h3>ICON</h3>
                    <p>
                        <Icon className="demo" type="check" />
                        <Icon className="demo" type="edit" />
                        <Icon className="demo" type="edit-o" />
                        <Icon className="demo" type="file" />
                        <Icon className="demo" type="chart" />
                        <Icon className="demo" type="mail" />
                        <Icon className="demo" type="star" />
                        <Icon className="demo" type="income" />
                        <Icon className="demo" type="home" />
                        <Icon className="demo" type="copyright" />
                        <Icon className="demo" type="function" />
                        <Icon className="demo" type="setting" />
                        <Icon className="demo" type="left-arrow" />
                        <Icon className="demo" type="up-arrow" />
                        <Icon className="demo" type="right-arrow" />
                        <Icon className="demo" type="down-arrow" />
                        <Icon className="demo" type="up" />
                        <Icon className="demo" type="left" />
                        <Icon className="demo" type="down" />
                        <Icon className="demo" type="right" />
                        <Icon className="demo" type="qrcode" />
                    </p>
                    <h3>简单动画示例</h3>
                    <div>
                        <Button onClick={this.handleAnimation}>点我</Button>
                        <Transition timeout={1000} in={this.state.show}>
                            {(status) => (
                                <Button onClick={this.handleAnimation} className={`fade fade-${status}`}
                                    type="primary">也可以点我</Button>
                            )}
                        </Transition>
                        <Animation in={this.state.show}>
                            <div>Hello world</div>
                        </Animation>
                    </div>
                    <h3>分页</h3>
                    <div>
                        <Pagination total={ this.state.total } showQuickJump={true}
                            pageSize={ this.state.pageSize  } showTotal={true}
                            current={ this.state.current } showSelectPageSize={true} />
                    </div>
                    <h3>Modal</h3>
                    <p>
                        <Button onClick={this.openModal}>Modal</Button>
                        <Modal isOpen={this.state.isOpen}
                            onClose={ () => this.setState({ isOpen: false }) }
                            title="头部" content="123123">
                            <p>
                                测试内容<br />
                                测试内容<br />
                                测试内容<br />
                                测试内容<br />
                                测试内容
                            </p>
                            <p>
                                测试内容<br />
                                测试内容<br />
                                测试内容
                                测试内容<br />
                                测试内容<br />
                            </p>
                        </Modal>
                        <Button onClick={this.openModal1}>Modal</Button>
                        <Modal isOpen={this.state.isOpen1} hasCloseBtnOnHeader={false}
                            onClose={ () => this.setState({ isOpen1: false }) }
                            onCancel={ () => console.log('cancel') }
                            onOk={ () => console.log('sure, but don\'t close') }
                            title="1" vertical="top">
                            <Modal.Content>
                                <p>
                                    测试内容<br />
                                </p>
                            </Modal.Content>
                        </Modal>
                    </p>
                    <h3>Confirm</h3>
                    <p><Button onClick={this.openConfirm}>confirm</Button></p>
                    <h3>Tooltip</h3>
                    <div>
                        <table className="tooltip-dome">
                            <tbody>
                            <tr>
                                <td />
                                <td>
                                    <Tooltip content={<Button type="warning">topLeft</Button>} title="什么鬼"
                                        position="topLeft">
                                        {tooltipContent}
                                    </Tooltip>
                                </td>
                                <td><Tooltip content={<Button type="warning">top</Button>} title="什么鬼" position="top">
                                    {tooltipContent}
                                </Tooltip></td>
                                <td><Tooltip content={<Button type="warning">topRight</Button>} title="什么鬼"
                                    position="topRight">
                                    {tooltipContent}
                                </Tooltip></td>
                                <td />
                            </tr>
                            <tr>
                                <td>
                                    <Tooltip content={<Button type="warning">leftTop</Button>} title="什么鬼"
                                        position="leftTop">
                                        {tooltipContent}
                                    </Tooltip></td>
                                <td />
                                <td />
                                <td />
                                <td>
                                    <Tooltip content={<Button type="warning">rightTop</Button>} title="什么鬼"
                                        position="rightTop">
                                        {tooltipContent}
                                    </Tooltip></td>
                            </tr>
                            <tr>
                                <td><Tooltip content={<Button type="warning">left</Button>} title="什么鬼" position="left">
                                    {tooltipContent}
                                </Tooltip></td>
                                <td />
                                <td />
                                <td />
                                <td>
                                    <Tooltip content={<Button type="warning">right</Button>} title="什么鬼"
                                        position="right">
                                        {tooltipContent}
                                    </Tooltip></td>
                            </tr>
                            <tr>
                                <td><Tooltip content={<Button type="warning">leftBottom</Button>} title="什么鬼"
                                    position="leftBottom">
                                    {tooltipContent}
                                </Tooltip></td>
                                <td />
                                <td />
                                <td />
                                <td>
                                    <Tooltip content={<Button type="warning">rightBottom</Button>} title="什么鬼"
                                        position="rightBottom">
                                        {tooltipContent}
                                    </Tooltip></td>
                            </tr>
                            <tr>
                                <td />
                                <td>
                                    <Tooltip content={<Button type="warning">bottomLeft</Button>} title="什么鬼"
                                        position="bottomLeft">
                                        {tooltipContent}
                                    </Tooltip></td>
                                <td><Tooltip content={<Button type="warning">bottom</Button>} title="什么鬼"
                                    position="bottom">
                                    {tooltipContent}
                                </Tooltip></td>
                                <td><Tooltip content={<Button type="warning">bottomRight</Button>}
                                    position="bottomRight">
                                    {tooltipContent}
                                </Tooltip></td>
                                <td />
                            </tr>
                            </tbody>
                        </table>

                        click:
                        <Tooltip content={<Button icon="star" type="primary" size="small" shape="circle" hollow />}
                            trigger="click" title="什么鬼" position="bottomLeft">
                            <p>错的事就是坐标<Tooltip content={<span><Icon type="safari" /></span>} position="topLeft">
                                仅支持你
                            </Tooltip>错的事就是坐标</p>
                            <p>这是：
                                <Tooltip content={<abbr title="">PRC</abbr>} position="topLeft"> People's Republic of
                                    China </Tooltip>
                                就是坐标</p>
                        </Tooltip>
                        hover(默认):
                        <Tooltip content={<span><Icon type="qrcode" /></span>}
                            trigger="hover" position="bottomLeft">
                            提示，就是本额额额额
                        </Tooltip>
                        only title:
                        <Tooltip content={<span><Icon type="qrcode" /></span>}
                            trigger="click" position="bottomLeft" title="提示，就是本额额额额撒打算打算大">
                        </Tooltip>
                        only child:
                        <Tooltip content={<span><Icon type="qrcode" /></span>} position="bottomLeft">
                            提示，就是本额额额额
                        </Tooltip>
                        <br />
                        <Input defaultValue="先聚焦我，然后用tab键切换焦点" style={{ width: 300 }} />
                        <Tooltip content={<Input placeholder="focus" />} title="什么鬼"
                            position="top" trigger="focus" isCloseOnBoxMouseLeave={true}>
                            {tooltipContent}
                        </Tooltip>
                    </div>
                    <h3>PROGRESS</h3>
                    <div>
                        <Progress percent={50} status="active" />
                        <Progress percent={70} status="exception" />
                        <Progress percent={100} />
                        <Progress percent={50} showInfo={false} />
                        <Progress type="circle" percent={75} />
                        <Progress type="circle" percent={70} status="exception">
                            <Icon type="home" />
                        </Progress>
                        <Progress type="circle" percent={100} />
                        <Progress type="circle" percent={75} format={percent => `${percent} Days`} />
                        <Progress type="circle" percent={100} format={() => 'Done'} />
                        <Progress type="dashboard" percent={75} />
                    </div>
                    <h3>RADIO</h3>
                    <div>
                        <Radio>Radio</Radio>
                        <Radio.Group defaultValue="a">
                            <Radio.Button value="a">Hangzhou</Radio.Button>
                            <Radio.Button value="b" disabled>Shanghai</Radio.Button>
                            <Radio.Button value="c">Beijing</Radio.Button>
                            <Radio.Button value="d">Chengdu</Radio.Button>
                        </Radio.Group>
                    </div>

                    <h3>CAROUSEL</h3>
                    <Carousel {...carouselData} />

                    <h3>Input</h3>
                    <div>
                        <Input placeholder="test" />
                        <Input error />
                        <Input disabled />
                    </div>
                    <h3>Tabs</h3>
                    <Tabs
                        defaultActiveKey={1}
                        onChange={() => {
                            console.log('Change tab!')
                        }}>
                        <Tabs.Tab key="1">tab1</Tabs.Tab>
                        <Tabs.Tab key="2" disabled>tab2</Tabs.Tab>
                        <Tabs.Tab key="3"><Icon type="chrome" />tab3</Tabs.Tab>
                        <Tabs.Tab
                            key="4"
                            onActive={() => alert('This is tab4!')}>
                            tab4
                        </Tabs.Tab>
                    </Tabs>
                    <h3>栅格系统</h3>
                    <div className="grid">
                        <Row>
                            {
                                Array.from(new Array(15), (v, i) =>
                                    <Col size="2" key={i}>
                                        <div>2</div>
                                    </Col>
                                )
                            }
                        </Row>
                        <Row>
                            <Col>
                                <div>25%</div>
                            </Col>
                            <Col>
                                <div>25%</div>
                            </Col>
                            <Col>
                                <div>25%</div>
                            </Col>
                            <Col>
                                <div>25%</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col offset={4}>
                                <Row>
                                    <Col offset="1" size="3">
                                        <div>嵌套</div>
                                    </Col>
                                    <Col offset="1" size="3">
                                        <div>嵌套</div>
                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                        <Row><Col offset={4} size="5">
                            <div>定位,offset:4</div>
                        </Col></Row>
                        排序这个看源码：
                        <Row>
                            <Col order={3}>
                                <div>1</div>
                            </Col>
                            <Col order={2}>
                                <div>2</div>
                            </Col>
                            <Col order={1}>
                                <div>3</div>
                            </Col>
                        </Row>
                        <Row className="height150">
                            <Col align="top">
                                <div>top</div>
                            </Col>
                            <Col align="middle">
                                <div>middle</div>
                            </Col>
                            <Col align="bottom">
                                <div>bottom</div>
                            </Col>
                            <Col align="stretch">
                                <div>stretch</div>
                            </Col>
                        </Row>
                        <Row justify="right"><Col size="3">
                            <div>居右</div>
                        </Col></Row>
                        <Row justify="center"><Col size="3">
                            <div>居中</div>
                        </Col></Row>
                        <Row justify="left"><Col size="3">
                            <div>居左</div>
                        </Col></Row>
                        <Row justify="between">
                            <Col size="3">
                                <div>between</div>
                            </Col>
                            <Col size="3">
                                <div>between</div>
                            </Col>
                            <Col size="3">
                                <div>between</div>
                            </Col>
                        </Row>
                        <Row justify="around">
                            <Col size="3">
                                <div>around</div>
                            </Col>
                            <Col size="3">
                                <div>around</div>
                            </Col>
                            <Col size="3">
                                <div>around</div>
                            </Col>
                        </Row>
                        首页部分排版示例：
                        <Row>
                            <Col size="5">
                                <div>230px</div>
                            </Col>
                            <Col>
                                <div>780px</div>
                            </Col>
                            <Col size="3">
                                <div>130px</div>
                            </Col>
                        </Row>
                        <Row>
                            <Col size="5">
                                <div>菜单宽: 230px;</div>
                            </Col>
                            <Col>
                                <div>正文: 930px</div>
                            </Col>
                        </Row>
                    </div>
                </div>
                <div className="app-table">
                    <h3>表格</h3>
                    <Table {...tableData} />
                </div>
                <div className="app-date-picker">
                    <h3>时间组件</h3>
                    <DatePicker {...datePicker} />
                </div>
            </div>
        );
    }
}

export default App;
