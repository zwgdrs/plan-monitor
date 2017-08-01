import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Tabs, Progress, DatePicker, Icon, Pagination, Table } from '../../library';
import ReactEcharts from 'echarts-for-react';
import classNames from 'classnames';
import moment from 'moment';
// import the core library.
import action from '../../redux-modules/action';
import ajax from '../../util/ajax';
import { paging } from './util';

const easySelectDate = [
    7, '|', 14, '|', 30,
]
/**
 网易号指数≤100               无积分
 网易号指数101~200           +1分
 网易号指数201~300           +2分
 网易号指数301~400           +3分
 网易号指数401~500           +4分
 网易号指数501~600           +5分
 网易号指数601~700           +6分
 网易号指数701~800           +7分
 网易号指数801~900           +8分
 网易号指数901~950           +9分
 网易号指数≥951               +10分
 * */
const ruleJson = [
    {
        title: '如何获得积分?',
        desc: '根据每日网易号指数计算积分，具体如下:',
        list: [
            { range: '网易号指数≤100', result: '无积分' },
            { range: '网易号指数101~200', result: '+1分' },
            { range: '网易号指数201~300', result: '+2分' },
            { range: '网易号指数301~400', result: '+3分' },
            { range: '网易号指数401~500', result: '+4分' },
            { range: '网易号指数501~600', result: '+5分' },
            { range: '网易号指数601~700', result: '+6分' },
            { range: '网易号指数701~800', result: '+7分' },
            { range: '网易号指数801~900', result: '+8分' },
            { range: '网易号指数901~950', result: '+9分' },
            { range: '网易号指数≥951', result: '+10分' },
        ],
    },
    {
        title: '为什么扣分?',
        desc: '每个自然月定期对违规内容进行扣分，具体如下:',
        list: [
            { range: '被投诉内容有错别字', result: '-1分' },
            { range: '被投诉标题党/标题有错别字', result: '-2分' },
            { range: '被投诉内容有误', result: '-2分' },
            { range: '被投诉发布老旧内容', result: '-2分' },
            { range: '发布第三方广告', result: '-5分' },
            { range: '被举报文章抄袭', result: '-20分' },
            { range: '发布低俗、暴力、色情内容', result: '-20分' },
            { range: '发布虚假宣传或欺诈消费者的内容', result: '-20分' },
            { range: '发布恶意攻击他人内容', result: '-20分' },
            { range: '停更一个月(30天计算)', result: '下降一个星级' },
            { range: '原创文章被举报抄袭', result: '降至0星' },
        ],
    },
]

class IndexStarLevel extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        user: PropTypes.object,
    };

    static defaultProps = {
        user: {},
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
            type: 'index',
            bottomTab: 'what',
            starLevel: 3,
        }
    }

    componentDidMount() {
        this.onFetchIndexProgress()
        this.onFetchIndexList()
        this.onFetchStarList()
        this.onFetchMyIndexNumber()
    }

    onFetchIndexProgress = () => {
        const { initIndexStarData } = this.props
        ajax('/datacenter/indexnumber/view.do', rs => {
            initIndexStarData('indexData progressData', rs.data)
        });
    }

    onFetchMyIndexNumber = () => {
        const { initIndexStarData, common } = this.props
        ajax('/data/starIntegral/score.do?', {
            method: 'GET',
            params: { wemediaId: common.user.wemediaId },
        }, (rs) => {
            rs.data && initIndexStarData('indexData integralScore', rs.data.integral)
        })
    }

    // 获取charts图信息
    onFetchIndexList = () => {
        const { initIndexStarData, common } = this.props
        const { beginDateValue, endDateValue } = this.state
        ajax('/data/indexnumber/list.do', {
            method: 'GET',
            params: {
                wemediaId: common.user.wemediaId,
                start: beginDateValue,
                end: endDateValue,
            },
        }, rs => {
            initIndexStarData('indexData chartsData', rs.data)
        });
    }

    onFetchStarList = () => {
        const { initIndexStarData, common } = this.props
        const { beginDateValue, endDateValue } = this.state
        ajax('http://t2.dy.163.com/wemedia/datacenter/starintegral/list.do', {
            method: 'GET',
            params: {
                wemediaId: common.user.wemediaId,
                start: beginDateValue,
                end: endDateValue,
                pageNo: 1,
                size: 30,
            },
        }, rs => {
            this.setState({
                total: rs.data && rs.data.list ? rs.data.list.length : 0,
            })
            initIndexStarData('starData', rs.data)
        });
    }
    handlePageChange = (number) => {
        this.setState({
            pageNo: number,
        });
    }
    onChangeTab = (type) => {
        this.setState({
            type,
        })
    }
    onChangeBottomTab = (type) => {
        this.setState({
            bottomTab: type,
        })
    }

    changeDate = (timeObj) => {
        const { beginTime, endTime, type } = timeObj
        this.setState({
            beginDateValue: beginTime,
            endDateValue: endTime,
        }, () => {
            if (this.state.type === 'index') {
                this.onFetchIndexList()
            } else {
                this.onFetchStarList()
            }

        })
    }
    getOption = () => {
        // const {activeIndexList, healthIndexList, interactionIndexList, originalIndexList, professionalIndexList, statDateList, totalIndexList} = this.props.stone.indexData.chartsData
        // statDateList && statDateList.forEach((item, index) => {
        //     xAxisData.push(moment(item).format('YYYY-MM-DD'))
        // })
        const chartsData = this.props.stone.indexData.chartsData.list || []
        const activeIndexList = []
        const healthIndexList = []
        const interactionIndexList = []
        const originalIndexList = []
        const professionalIndexList = []
        const statDateList = []
        const totalIndexList = []
        const xAxisData = []
        chartsData.forEach((item) => {
            const { activeIndex, healthIndex, interactionIndex, originalIndex, professionalIndex, statDate, totalIndex } = item
            activeIndexList.push(activeIndex)
            healthIndexList.push(healthIndex)
            interactionIndexList.push(interactionIndex)
            originalIndexList.push(originalIndex)
            professionalIndexList.push(professionalIndex)
            statDateList.push(statDate)
            totalIndexList.push(totalIndex)
            xAxisData.push(statDate)
        })
        const option = {
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: ['网易号指数', '健康度', '原创度', '活跃度', '专业度', '吸粉度'],
                // height: '500px',
            },
            grid: {
                // left: '3%',
                // right: '4%',
                // bottom: '3%',
                // top: '3%',
                // containLabel: true,
            },
            toolbox: {
                feature: {
                    // saveAsImage: {},
                },
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxisData,
                // offset: '50px',
                nameLocation: 'end',
            },
            yAxis: {
                axisLine: {
                    show: false,
                },
                type: 'value',
            },
            series: [
                {
                    name: '网易号指数',
                    type: 'line',
                    data: totalIndexList,
                },
                {
                    name: '健康度',
                    type: 'line',
                    data: healthIndexList,
                },
                {
                    name: '原创度',
                    type: 'line',
                    data: originalIndexList,
                },
                {
                    name: '活跃度',
                    type: 'line',
                    data: activeIndexList,
                },
                {
                    name: '专业度',
                    type: 'line',
                    data: professionalIndexList,
                },
                {
                    name: '吸粉度',
                    type: 'line',
                    data: interactionIndexList,
                },

            ],
        };

        return option;
    }

    handleTriggerTab = (type) => {
        document.getElementById(type).click()
    }
    handleDateRange = (dateRange, index) => {
        if (index % 2 === 0) {
            this.setState({
                dateRange,
                beginDateValue: moment(new Date(this.state.endDateValue).getTime() - dateRange * 1000 * 3600 * 24).format('YYYY-MM-DD'),
            })
        }
    }

    panelIndexRender = () => {
        const { healthIndex, originalIndex, activeIndex, professionalIndex, interactionIndex, totalIndex } = this.props.stone.indexData.progressData
        const mockIndexData = [
            { title: '健康度', index: healthIndex, color: '#88EBA9' },
            { title: '原创度', index: originalIndex, color: '#FF849D' },
            { title: '活跃度', index: activeIndex, color: '#7DDFF2' },
            { title: '专业度', index: professionalIndex, color: '#B79BEC' },
            { title: '吸粉度', index: interactionIndex, color: '#F7D77E' },
        ]
        const dialNum = [0, 20, 40, 60, 80, 100]
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
        const tabsData = [
            { type: 'what', title: '什么是网易号指数?' },
            { type: 'why', title: '网易号指数有什么作用?' },
            { type: 'how', title: '如何提升网易号指数?' },
        ]
        const tabsContent = {
            what: [
                '• 你可以将网易号指数理解为「你的内容有多值得被推荐」，这一指数是机器通过对作者创作的内容和读者阅读行为的记录和分析得出的帐号价值评分，包括健康度、原创度、活跃度、垂直度、互动度等5个维度。',
                '• 其中，健康度和互动度评分源自机器对读者阅读行为的分析，体现的是读者的意志。读者的每一次点击、停留、点赞、评论、收藏等都是在为帐号加分，机器只是忠实地反映读者的态度。',
                '• 你可以将网易号指数理解为「你的内容有多值得被推荐」，这一指数是机器通过对作者创作的内容和读者阅读行为的记录和分析得出的帐号价值评分，包括健康度、原创度、活跃度、垂直度、互动度等5个维度。',
                '• 其中，健康度和互动度评分源自机器对读者阅读行为的分析，体现的是读者的意志。读者的每一次点击、停留、点赞、评论、收藏等都是在为帐号加分，机器只是忠实地反映读者的态度。',
                '• 而原创度、活跃度、垂直度三项评分则与作者生产的内容有关，是机器对作者的发文质量、勤奋度、内容垂直度做出的客观评价，对作者的努力程度做出的客观衡量。',
            ],
            why: [
                '• 健康度：提高文章可读性（标题、正文内容、配图美观合理）；避免标题党、营销推广及垃圾违规内容；提升读者点击意愿，并引导读者读完内容。',
                '• 原创度：保证内容为原创，避免抄袭；手动发表，减少使用链接抓取；获取网易号原创资质。',
                '• 活跃度：保持正常更新提高发文频率。',
                '• 专业度：发文内容与账号分类高度相符，增强垂直深耕能力；获取网易号专家号资质。',
                '• 互动度：提高文章可互动性，引发读者兴趣，从而增加订阅、跟贴、分享等。',
            ],
            how: [
                '网易号指数越高，推荐机会越大，曝光频次越高，越有利于星级提升。',
            ],
        }
        const dateRange = this.state.dateRange
        return (
            <div className="ii-container">
                <div className="iic-dayIndex">
                    <div className="iicd-charts">
                        <div className="header">
                            <span className="title">今日指数</span>
                        </div>
                        <div className="body">
                            <div className="body-desc">
                                <span className="index-count">{`网易号指数:  ${totalIndex || ' '}`}</span>
                                <span className="star-count">{`星级积分:  +${1234}`}</span>
                                <a onClick={() => this.handleTriggerTab('starIntegral')}>查看明细></a>
                            </div>
                            <div className="body-charts">
                                {
                                    mockIndexData.map((item, index) => {
                                        return (
                                            <div className="charts-item" key={`${item}-${index}`}>
                                                <div className="title">{item.title}</div>
                                                <Progress percent={item.index} showInfo={false} strokeWidth={20}
                                                          lineColor={item.color}/>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <div className="body-dial">
                                <div className="line-dial">
                                    {dialNum.map((item, index) => {
                                        const style = {
                                            left: `${117 * index - 3}px`,
                                        }
                                        return (
                                            <span className="line-dial-item" key={item} style={style}>{item}</span>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="iic-trend iic-2">
                    <div className="iict-header">
                        <div className="title">历史趋势</div>
                        <div className="time">
                            <div className="date-range">
                                {easySelectDate.map((item, index) => (
                                    <span key={`${item}-${index}`}
                                          className={classNames({ cursor: !(index % 2), redColor: dateRange === item })}
                                          onClick={() => this.handleDateRange(item, index)}>{index % 2 === 0 ? `${item}天` : item}</span>
                                ))}
                            </div>
                            <div className="data-date-search">
                                <DatePicker {...datePicker} />
                            </div>
                        </div>
                    </div>
                    <ReactEcharts option={this.getOption()} style={{ height: '400px' }}/>
                </div>
                <div className="iic-tab iic-3">
                    <div style={{
                        width: '100%',
                        borderBottom: '1px solid #eeeeee',
                        height: '36px',
                        marginBottom: '40px',
                    }}>
                        <Tabs
                            defaultActiveKey={0}
                            className={'iict-tabs'}
                            tabWidth={'200px'}>

                            {
                                tabsData.map((item) => {
                                    return (
                                        <Tabs.Tab onActive={() => this.onChangeBottomTab(item.type)}
                                                  key={item.type}>{item.title}</Tabs.Tab>
                                    )
                                })
                            }
                        </Tabs>
                    </div>
                    <div className="bottom-tabs-content">
                        {
                            tabsContent[this.state.bottomTab].map((item, index) => {
                                return (
                                    <div key={`content-${index}`}>{item}</div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }

    panelStarIntegralRender = () => {
        const self = this
        const { stone } = this.props
        const integralDial = [100, 180, 300, 550, 1000]
        const tempArrayList = stone.starData.list || []
        const { integralScore = 0 } = stone
        const { pageSize, pageNo, dateRange } = this.state
        const { pageStart, pageEnd } = paging(pageSize, pageNo, tempArrayList.length)
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
            minWidth: '120px',
            height: '55px',
        }
        const tableDataList = []
        for (let i = pageStart; i < pageEnd; i++) {
            tableDataList.push(tempArrayList[i])
        }
        let tableData = {
            columns: [
                { title: '日期', key: 'sdate', style: tableStyle },
                { title: '积分', key: 'integral', style: tableStyle },
                { title: '详情', key: 'source', style: tableStyle },
            ],
            dataSource: tableDataList,
            isHover: true,
            textCenter: true,
            rowHeight: '55px',
        }
        let myStarLevel = 1
        let lackScore = 0
        let percent = 0
        integralDial.forEach((item, index) => {
            if (index + 1 < integralDial.length) {
                if (integralScore >= item && integralScore < integralDial[index + 1]) {
                    myStarLevel = index + 2
                    lackScore = integralDial[index + 1] - integralScore
                    percent = (index + 1) * 20
                    if (integralScore !== item) {
                        percent += Math.floor(((integralScore - item) / (integralDial[index + 1] - item)) * 20)
                    }

                }
            } else if (integralDial[index - 1] <= integralScore && integralScore <= item) {
                myStarLevel = index + 1
                lackScore = item - integralScore
                percent = index * 20
                if (integralDial[index - 1] !== integralScore) {
                    console.log((integralScore - integralDial[index - 1]), (item - integralScore))
                    percent += Math.floor(((integralScore - integralDial[index - 1]) / (item - integralDial[index - 1])) * 20)
                }
            }
        })
        myStarLevel = myStarLevel > 5 ? 5 : myStarLevel
        return (
            <div className="star-level">
                <div className="sl-star-state">
                    <span className="title">星级状态</span>
                    <div className="my-integral">
                        <span>{`我的积分：${integralScore || 0}`}</span>
                        <span className="tip">{`+${lackScore}积分 升级到${myStarLevel}星，加油！`}</span>
                    </div>
                    <div className="progress-view">
                        <div className="icons-star">
                            {
                                integralDial.map((item) => {
                                    let color = '#DDDDDD'
                                    if (integralScore >= item) {
                                        color = '#E25050'
                                    }
                                    return (
                                        <Icon type="star" key={`star-${item}`} style={{ color }}/>
                                    )
                                })
                            }
                        </div>
                        <div className="progress">
                            <Progress percent={percent} showInfo={false}/>
                        </div>
                        <div className="integral-dial">
                            {integralDial.map((item, index) => {
                                let color = '#666666'
                                if (integralScore >= item) {
                                    color = '#E25050'
                                }
                                return (
                                    <div key={`dial-${index}`} style={{ color }}>{item}积分</div>
                                )
                            })}
                        </div>
                    </div>
                </div>
                <div className="sl-star-table">
                    <div className="data-header">
                        <span className="title">积分明细</span>
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
                    <div className="sd-body">
                        <div className="sdb-table">
                            <Table {...tableData} />
                        </div>
                        <div className="sdb-page">
                            <Pagination total={this.state.total} showQuickJump={true}
                                        pageSize={this.state.pageSize}
                                        current={this.state.pageNo}
                                        onChange={this.handlePageChange}/>
                        </div>
                    </div>
                </div>
                <div className="sl-star-rule">
                    <div className="title">积分规则</div>
                    <div className="rule">
                        {
                            ruleJson.map((item) => {
                                const { title, desc, list } = item
                                return (
                                    <div className="rule-item" key={title}>
                                        <div className="title">{title}</div>
                                        <div className="desc">{desc}</div>
                                        <ul className="detail-list">
                                            {
                                                list.map((detail, index) => {
                                                    const { range, result } = detail
                                                    return (
                                                        <li key={`li-${index}`}>
                                                            <span>{range}</span>
                                                            <span>{result}</span>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        )
    }

    render() {
        const tabsData = [
            { type: 'index', title: '网易号指数' },
            { type: 'starIntegral', title: '星级积分' },
        ]
        const { type } = this.state
        return (
            <div className="index-integral">
                <div style={{ width: '100%', borderBottom: '1px solid #eeeeee', height: '36px', marginBottom: '25px' }}>
                    <Tabs
                        defaultActiveKey={0}
                        onChange={() => {
                            console.log('Change tab!')
                        }}
                        className={'ii-tabs'}
                        tabWidth={'120px'}>
                        {
                            tabsData.map((item) => {
                                return (
                                    <Tabs.Tab onActive={() => this.onChangeTab(item.type)} id={item.type}
                                              key={item.type}
                                              ref={(tab) => this[item.type] = tab}>{item.title}</Tabs.Tab>
                                )
                            })
                        }
                    </Tabs>
                </div>
                <div>
                    {type === 'index' && this.panelIndexRender()}
                    {type === 'starIntegral' && this.panelStarIntegralRender()}

                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        stone: state.indexStarData,
        common: state.common,
    }),
    dispatch => bindActionCreators({
        initIndexStarData: action.initIndexStarData,
    }, dispatch),
)(IndexStarLevel);