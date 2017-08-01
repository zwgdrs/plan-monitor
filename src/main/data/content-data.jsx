import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Panel, DatePicker, Table, Pagination, Tabs } from '../../library';
import classNames from 'classnames';
import moment from 'moment';
// import the core library.
import ReactEcharts from 'echarts-for-react';
import action from '../../redux-modules/action';
import ajax from '../../util/ajax';
import { TopStatistics } from '../components';
import { paging } from './util';

const topStatisticsData = {
    url: '/datacenter/article/pv/view.do',
    showTitle: [{
        name: '总阅读数',
        key: 'total',
    }, {
        name: '昨日阅读数',
        key: 'pvCount',
    }, {
        name: '昨日推荐数',
        key: 'recommendCount',
    }],
}
const easySelectDate = [
    7, '|', 14, '|', 30,
]

class ContentData extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        user: PropTypes.object,
    };

    static defaultProps = {
        user: {},
        urls: {
            articles: {
                all: '/datacenter/article/pv/list.do',
                single: '/datacenter/article/list.do',
            },
            videos: {
                all: '/datacenter/video/pv/list.do',
                single: '/datacenter/video/list.do',
            },
            lives: {
                single: '/live/ranking.json',
            },
        },
    };

    constructor(props, context) {
        super(props, context);
        this.state = {
            dateRange: 7,
            beginDateValue: moment(new Date().getTime() - 1000 * 3600 * 24 * 7).format('YYYY-MM-DD'),
            endDateValue: moment().format('YYYY-MM-DD'),
            total: 7,
            pageNo: 1,
            pageSize: 7,
            type: '',
            panelTabType: 'all',
            realyToRender: false,
        }
    }

    componentDidMount() {
        this.getAllData('articles')
    }

    getAllData = (type) => {
        const { initContentData, common, urls } = this.props
        const { beginDateValue, endDateValue } = this.state
        ajax(urls[type].all, {
            method: 'GET',
            params: {
                start: beginDateValue,
                end: endDateValue,
                wemediaId: common.user.wemediaId,
            },
        }, rs => {
            initContentData(type, rs.data)
            // initContentData(type, {})
            this.setState({
                total: rs.data && rs.data.statDateList ? rs.data.statDateList.length : 0,
                pageNo: 1,
                type,
                // panelTabType: 'all',
            },)
        });
    }

    getSingleData = (type, tabType) => {
        const { initContentData, common, urls } = this.props
        const { beginDateValue, endDateValue, pageNo } = this.state
        ajax(urls[type].single, {
            method: 'GET',
            params: {
                wemediaId: common.user.wemediaId,
                orderBy: 'pvCount',
                order: 'desc',
                start: beginDateValue,
                end: endDateValue,
                pageSize: 10,
                pageNo: pageNo,
            },
        }, rs => {
            let key = 'singleArticle'
            if (type === 'videos') {
                key = 'singleVideo'
            } else if (type === 'lives') {
                key = 'lives'
            }
            initContentData(key, rs.data)
            rs.data && rs.data.list && this.setState({
                total: rs.data.list.length,
                pageNo: 1,
                type,
                // panelTabType: 'single',
            },)
        });
    }

    handleDateRange = (dateRange, index) => {
        if (index % 2 === 0) {
            this.setState({
                dateRange,
                beginDateValue: moment(new Date(this.state.endDateValue).getTime() - dateRange * 1000 * 3600 * 24).format('YYYY-MM-DD'),
            })
        }
    }

    changeDate = (timeObj) => {
        const { beginTime, endTime } = timeObj
        this.setState({
            beginDateValue: beginTime,
            endDateValue: endTime,
        }, () => {

            const { panelTabType, type } = this.state
            if (panelTabType === 'single') {
                this.getSingleData(type)
            } else {
                this.getAllData(this.state.type)
            }

        })
    }

    getOption = () => {
        const { pvCountList, statDateList, commentCountList, recommendCountList, shareCountList } = this.props.stone[this.state.type]
        const option = {
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: ['阅读数', '推荐数', '跟帖数', '分享数'],
                // top: '-5%',
                // right: '-5%',
            },
            grid: {
                containLabel: true,
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: statDateList,
                // offset: '50px',
                nameLocation: 'end',
            },
            yAxis: {
                axisLine: {
                    show: false,
                },
                type: 'value',
            },
            series: [],
        };

        if (this.state.type === 'articles') {
            option.series = [
                {
                    name: '阅读数',
                    type: 'line',
                    data: pvCountList,
                },
                {
                    name: '推荐数',
                    type: 'line',
                    data: recommendCountList,
                },
                {
                    name: '跟帖数',
                    type: 'line',
                    data: commentCountList,
                },
                {
                    name: '分享数',
                    type: 'line',
                    stack: '总量',
                    data: shareCountList,
                },
            ]
        } else {
            option.legend.data = ['播放量', '推荐量']
            option.series = [
                {
                    name: '播放量',
                    type: 'line',
                    data: pvCountList,
                },
                {
                    name: '推荐量',
                    type: 'line',
                    data: recommendCountList,
                },
            ]
        }

        return option;
    }

    panelVideoRender = () => {
        const self = this
        const dateRange = this.state.dateRange
        const datePicker = {
            type: 'date-range',
            placeholder: '说点啥好',
            format: 'YYYY-MM-DD',
            beginDateValue: this.state.beginDateValue,
            endDateValue: this.state.endDateValue,
            onChange: this.changeDate,
            selectType: 'select-day', // select-day, select-month, select-year
            // readOnly: true,
            disabled: false,
            inputClass: 'date-wh',
            separator: '至',
        }

        const tableStyle = {
            minWidth: '197.5px',
            height: '55px',
        }

        let tableDataList = []
        const { pageNo, pageSize, type, panelTabType } = this.state

        const { pvCountList = [], statDateList = [], recommendCountList = [] } = this.props.stone[type]
        if (!pvCountList) {
            return
        }
        const tableDataStart = (pageNo - 1) * pageSize
        let tableDataEnd = pageNo * pageSize
        const arrayLen = statDateList.length
        tableDataEnd = tableDataEnd <= arrayLen ? tableDataEnd : arrayLen
        let tableData = {
            columns: [
                { title: '日期', key: 'statDate', style: tableStyle },
                { title: '播放量', key: 'pvCount', style: tableStyle },
                { title: '推荐量', key: 'recommendCount', style: tableStyle },
            ],
            dataSource: tableDataList,
            isHover: true,
            textCenter: true,
            rowHeight: '55px',
        }
        let sumPv = 0
        let averagePv = 0
        if (this.state.panelTabType === 'all') {
            for (let i = tableDataStart; i < tableDataEnd; i++) {
                tableDataList[i] = {
                    pvCount: pvCountList[i],
                    statDate: statDateList[i],
                    recommendCount: recommendCountList[i],
                }
            }
            pvCountList.forEach((item) => sumPv += item)
            averagePv = sumPv ? Math.floor(sumPv / statDateList.length) : 0
        } else {
            const tempArrayList = this.props.stone.singleVideo.list || []
            const { pageStart, pageEnd } = paging(pageSize, pageNo, tempArrayList.length)
            tableDataList = []
            for (let i = pageStart; i < pageEnd; i++) {
                tableDataList.push(tempArrayList[i])
            }
            tableData = {
                columns: [
                    { title: '文章标题', key: 'title', style: { minWidth: '350px' } },
                    { title: '发布日期', key: 'publishTime', style: { minWidth: '150px' } },
                    { title: '累计播放量', key: 'pvCount', style: tableStyle },
                    { title: "推荐量", key: "recommendCount", style: tableStyle },
                    { title: '平均播放时长', key: 'processRate', style: tableStyle },
                ],
                dataSource: tableDataList,
                isHover: true,
                textCenter: true,
                rowHeight: '55px',
            }
        }
        const panelData = {
            tabHeader: true,
            normalHeader: false,
            title: [
                { desc: '整体统计', type: 'videos' },
                { desc: '单视频统计', type: 'single' },
            ],
            onTitleClick: this.onActiveTab,
            header: () => {
                return (
                    <div className="data-header">
                        <div className="time">
                            <div className="date-range">
                                {easySelectDate.map((item, index) => (
                                    <span key={`${item}-${index}`}
                                          className={classNames({ cursor: !(index % 2), redColor: dateRange === item })}
                                          onClick={() => self.handleDateRange(item, index)}>{index % 2 === 0 ? `${item}天` : item}</span>
                                ))}
                            </div>
                            <div className="data-date-search">
                                <DatePicker {...datePicker} />
                            </div>
                        </div>
                    </div>
                )
            },
            body: panelTabType === 'all' ? () => {
                return (
                    <div className="sd-body">
                        <div className="sdb-charts">
                            <div className="header">
                                <div>
                                    <span className="title">数据趋势</span>
                                    <span className="desc">
                                        {`累计: ${sumPv} 日均: ${averagePv}`}
                                    </span>
                                </div>
                                {/*<div className="icon">*/}
                                {/*<span className="icon-item read">阅读数</span>*/}
                                {/*<span className="icon-item recommend">推荐数</span>*/}
                                {/*</div>*/}
                            </div>
                            <ReactEcharts option={this.getOption()}/>
                        </div>
                        <div className="sdb-table">
                            <div className="header">
                                <span className="title">数据明细</span>
                                <span className="download"
                                      onClick={() => this.handleGetExcel('/wemedia/video/export.do')}>
                                    <Icon type=""/>
                                    <span>导出Excel</span>
                                </span>
                            </div>
                            <Table {...tableData} />
                        </div>
                        <div className="sdb-page">
                            <Pagination total={this.state.total} showQuickJump={true}
                                        pageSize={this.state.pageSize}
                                        current={this.state.current} onChange={this.handlePageChange}/>
                        </div>
                    </div>
                )
            } : () => {
                return (
                    <div className="sd-body">
                        <div className="sdb-table">
                            <div className="header">
                                <span className="title">数据明细</span>
                            </div>
                            <Table {...tableData} />
                        </div>
                        <div className="sdb-page">
                            <Pagination total={this.state.total} showQuickJump={true}
                                        pageSize={this.state.pageSize}
                                        current={this.state.current} onChange={this.handlePageChange}
                                        scrollToTop={false}/>
                        </div>
                    </div>
                )
            },
        }
        return panelData
    }

    panelArticlesRender = () => {
        const self = this
        const dateRange = this.state.dateRange
        const datePicker = {
            type: 'date-range',
            placeholder: '说点啥好',
            format: 'YYYY-MM-DD',
            beginDateValue: this.state.beginDateValue,
            endDateValue: this.state.endDateValue,
            onChange: this.changeDate,
            selectType: 'select-day', // select-day, select-month, select-year
            readOnly: true,
            disabled: false,
            inputClass: 'date-wh',
            separator: '至',
        }

        const tableStyle = {
            minWidth: '120px',
            height: '55px',
        }
        let tableDataList = []
        const { pageNo, pageSize, panelTabType, type } = this.state

        const { pvCountList = [], statDateList = [], commentCountList = [], recommendCountList = [], shareCountList = [] } = this.props.stone[type]
        const tableDataStart = (pageNo - 1) * pageSize
        let tableDataEnd = pageNo * pageSize
        const arrayLen = statDateList ? statDateList.length : 0
        tableDataEnd = tableDataEnd <= arrayLen ? tableDataEnd : arrayLen
        let tableData = {
            columns: [
                { title: '发布日期', key: 'statDate', style: { minWidth: '150px' } },
                { title: '阅读数', key: 'pvCount', style: tableStyle },
                { title: "推荐数", key: "recommendCount", style: tableStyle },
                { title: '跟帖数', key: 'commentCount', style: tableStyle },
                { title: '分享数', key: 'shareCount', style: tableStyle },
            ],
            dataSource: tableDataList,
            isHover: true,
            textCenter: true,
            rowHeight: '55px',
        }
        let sumPv = 0
        let averagePv = 0

        if (this.state.panelTabType === 'all') {
            for (let i = tableDataStart; i < tableDataEnd; i++) {
                tableDataList[i] = {
                    pvCount: pvCountList[i],
                    statDate: statDateList[i],
                    commentCount: commentCountList[i],
                    recommendCount: recommendCountList[i],
                    shareCount: shareCountList[i],
                }
                sumPv += pvCountList[i]

            }
            pvCountList.forEach((item) => sumPv += item)
            averagePv = sumPv ? Math.floor(sumPv / statDateList.length) : 0
        } else {
            const tempArrayList = this.props.stone.singleArticle.list || []
            const { pageStart, pageEnd } = paging(pageSize, pageNo, tempArrayList.length)
            tableDataList = []
            for (let i = pageStart; i < pageEnd; i++) {
                tableDataList.push(tempArrayList[i])
            }
            tableData = {
                columns: [
                    { title: '文章标题', key: 'title', style: { minWidth: '300px' } },
                    { title: '发布日期', key: 'publishTime', style: { minWidth: '150px' } },
                    { title: '阅读数', key: 'pvCount', style: tableStyle },
                    { title: "推荐数", key: "recommendCount", style: tableStyle },
                    { title: '跟帖数', key: 'commentCount', style: tableStyle },
                    { title: '分享数', key: 'shareCount', style: tableStyle },
                    {
                        title: '平均阅读进度',
                        key: 'processRate',
                        style: tableStyle,
                        render: (process) => `${(process / 10)}%`,
                    },
                ],
                dataSource: tableDataList,
                isHover: true,
                textCenter: true,
                rowHeight: '55px',
                longTable: true,
            }
        }


        const panelData = {
            tabHeader: true,
            normalHeader: false,
            title: [
                { desc: '整体统计', type: 'all' },
                { desc: '单篇统计', type: 'single' },
            ],
            onTitleClick: this.onActiveTab,
            header: () => {
                return (
                    <div className="data-header">
                        <div className="time">
                            <div className="date-range">
                                {easySelectDate.map((item, index) => (
                                    <span key={`${item}-${index}`}
                                          className={classNames({ cursor: !(index % 2), redColor: dateRange === item })}
                                          onClick={() => self.handleDateRange(item, index)}>{index % 2 === 0 ? `${item}天` : item}</span>
                                ))}
                            </div>
                            <div className="data-date-search">
                                <DatePicker {...datePicker} />
                            </div>
                        </div>
                    </div>)
            },
            body: panelTabType === 'all' ? () => {
                return (
                    <div className="sd-body">
                        <div className="sdb-charts">
                            <div className="header">
                                <div>
                                    <span className="title">数据趋势</span>
                                    <span className="desc">{`累计: ${sumPv} 日均: ${averagePv}`}</span>
                                </div>
                                {/*<div className="icon">*/}
                                {/*<span className="icon-item read">阅读数</span>*/}
                                {/*<span className="icon-item recommend">推荐数</span>*/}
                                {/*<span className="icon-item comment">跟帖数</span>*/}
                                {/*<span className="icon-item share">分享数</span>*/}
                                {/*</div>*/}
                            </div>
                            <ReactEcharts option={this.getOption()} style={{ height: '350px' }}/>
                        </div>
                        <div className="sdb-table">
                            <div className="header">
                                <span className="title">数据明细</span>
                                <span className="download"
                                      onClick={() => this.handleGetExcel('/wemedia/pvs/export.do')}>
                                    <Icon type=""/>
                                    <span>导出Excel</span>
                                </span>
                            </div>
                            <Table {...tableData} />
                        </div>
                        <div className="sdb-page">
                            <Pagination total={this.state.total} showQuickJump={true}
                                        pageSize={this.state.pageSize}
                                        current={this.state.pageNo}
                                        onChange={this.handlePageChange} scrollToTop={false}/>
                        </div>
                    </div>
                )
            } : () => {
                return (
                    <div className="sd-body">
                        <div className="sdb-table">
                            <Table {...tableData} />
                        </div>
                        <div className="sdb-page">
                            <Pagination total={this.state.total} showQuickJump={true}
                                        pageSize={this.state.pageSize}
                                        current={this.state.pageNo}
                                        onChange={this.handlePageChange} scrollToTop={false}/>
                        </div>
                    </div>
                )
            },
        }
        return panelData
    }

    panelLiveRender = () => {
        const self = this
        const dateRange = this.state.dateRange
        const datePicker = {
            type: 'date-range',
            placeholder: '说点啥好',
            format: 'YYYY-MM-DD',
            beginDateValue: this.state.beginDateValue,
            endDateValue: this.state.endDateValue,
            onChange: this.changeDate,
            selectType: 'select-day', // select-day, select-month, select-year
            // readOnly: true,
            disabled: false,
            inputClass: 'date-wh',
            separator: '至',
        }

        const tableStyle = {
            minWidth: '197.5px',
            height: '55px',
        }
        const { pageSize, pageNo } = this.state
        let tableSource = []
        const tableDataList = this.props.stone.lives.list
        const { pageStart, pageEnd } = paging(pageSize, pageNo, tableDataList.length)
        for (let i = pageStart; i < pageEnd; i++) {
            tableSource.push(tableDataList[i])
        }

        const tableData = {
            columns: [
                { title: '文章标题', key: 'roomName', style: tableStyle },
                { title: '直播类型', key: 'type', style: tableStyle },
                { title: '直播开始时间', key: 'startDate', style: tableStyle },
                { title: "累计参与人数", key: "viewCount", style: tableStyle },
            ],
            dataSource: tableSource,
            isHover: true,
            textCenter: true,
            rowHeight: '55px',
        }
        const panelData = {
            normalHeader: true,
            title: '直播排行',
            header: () => {
                return (
                    <div className="data-header">
                        <div className="time">
                            <div className="date-range">
                                {easySelectDate.map((item, index) => (
                                    <span key={`${item}-${index}`}
                                          className={classNames({ cursor: !(index % 2), redColor: dateRange === item })}
                                          onClick={() => self.handleDateRange(item, index)}>{index % 2 === 0 ? `${item}天` : item}</span>
                                ))}
                            </div>
                            <div className="data-date-search">
                                <DatePicker {...datePicker} />
                            </div>
                        </div>
                    </div>
                )
            },
            body: () => {
                return (
                    <div className="sd-body">
                        <div className="sdb-table">
                            <div className="header">
                                <span className="title">数据明细</span>
                            </div>
                            <Table {...tableData} />
                        </div>
                        <div className="sdb-page">
                            <Pagination total={this.state.total} showQuickJump={true}
                                        pageSize={this.state.pageSize}
                                        current={this.state.current}
                                        onChange={this.handlePageChange} scrollToTop={false}/>
                        </div>
                    </div>
                )
            },
        }
        return panelData
    }

    onChangeTab = (type) => {
        setTimeout(() => {
            if (type === 'lives') {
                this.getSingleData(type)
            } else {
                this.getAllData(type)
            }
        }, 180)
    }

    onActiveTab = (type) => {
        this.setState({
            panelTabType: type,
        })
        if (type === 'single') {
            this.getSingleData(this.state.type)
        } else {
            this.getAllData(this.state.type)
        }
    }

    handlePageChange = (number) => {
        this.setState({
            pageNo: number,
        }, () => {

        });
    }

    handleGetExcel = (url) => {
        // /wemedia/pvs/export.do
        const { beginDateValue, endDateValue } = this.state
        const wemediaId = this.props.common.user.wemediaId
        window.location.href = `${url}?start=${beginDateValue}&end=${endDateValue}&wemediaId=${wemediaId}`
    }

    render() {
        const tabsData = [
            { type: 'articles', title: '图文' },
            { type: 'videos', title: '视频' },
            { type: 'lives', title: '直播' },
        ]
        const { type } = this.state
        return (
            <div className="content-data">
                <div style={{ width: '100%', borderBottom: '1px solid #eeeeee', height: '36px', marginBottom: '25px' }}>
                    <Tabs
                        defaultActiveKey={0}
                        className={'cd-tabs'}
                        tabWidth={'80px'}>
                        {
                            tabsData.map((item) => {
                                return (
                                    <Tabs.Tab onActive={() => this.onChangeTab(item.type)}
                                              key={item.type}>{item.title}</Tabs.Tab>
                                )
                            })
                        }
                    </Tabs>
                </div>
                <div>
                    <TopStatistics {...topStatisticsData} />
                    {type === 'articles' && <Panel {...this.panelArticlesRender()} />}
                    {type === 'videos' && <Panel {...this.panelVideoRender()} />}
                    {type === 'lives' && <Panel {...this.panelLiveRender()} />}
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        stone: state.contentData,
        common: state.common,
    }),
    dispatch => bindActionCreators({
        initContentData: action.initContentData,
    }, dispatch),
)(ContentData);