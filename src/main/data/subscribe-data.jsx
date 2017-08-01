import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Panel, DatePicker, Table, Pagination, Tooltip } from '../../library';
import classNames from 'classnames';
import moment from 'moment';
// import the core library.
import ReactEcharts from 'echarts-for-react';
import action from '../../redux-modules/action';
import ajax from '../../util/ajax';
import { TopStatistics } from '../components';

const topStatisticsData = {
    showTitle: [{
        name: '总订阅数',
        key: 'sumSubs',
    }, {
        name: '昨日新增',
        key: 'incr',
    }],
}
const easySelectDate = [
    7, '|', 14, '|', 30,
]

class SubscribeData extends React.PureComponent {
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
            beginDateValue: moment(new Date().getTime() - 7 * 1000 * 3600 * 24).format('YYYY-MM-DD'),
            endDateValue: moment().format('YYYY-MM-DD'),
            total: 7,
            pageNo: 1,
            pageSize: 7,
            renderPanel: false,
        }
    }

    componentDidMount() {
        this.getChangeData()
    }

    getChangeData = () => {
        const { initSubData, common } = this.props
        const { beginDateValue, endDateValue } = this.state
        ajax('/subs.json', {
            method: 'GET',
            params: {
                start: beginDateValue,
                end: endDateValue,
                wemediaId: common.user.wemediaId,
            },
        }, rs => {
            const data = rs.data
            initSubData('changeData', data)
            data && this.setState({
                total: data.list.length,
                renderPanel: true,
            })
        });
    }

    handleDateRange = (dateRange, index) => {
        if (index % 2 === 0) {
            this.setState({
                dateRange,
                beginDateValue: moment(new Date(this.state.endDateValue).getTime() - dateRange * 1000 * 3600 * 24).format('YYYY-MM-DD'),
            }, () => {
                this.getChangeData()
            })
        }
    }

    changeDate = (timeObj) => {
        const { beginTime, endTime } = timeObj
        this.setState({
            beginDateValue: beginTime,
            endDateValue: endTime,
        }, () => {
            this.getChangeData()
        })
    }

    getOption = () => {
        const xAxisData = []
        const incrData = []
        const delData = []
        const listData = this.props.subData.changeData.list
        listData && listData.forEach((item, index) => {
            xAxisData.push(moment(item.statsDate).format('YYYY-MM-DD'))
            incrData.push(item.subs)
            delData.push(item.unsubs)
            // delData.push(index ? (item.sum - listData[index - 1].sum) : 0)
        })
        const option = {
            tooltip: {
                trigger: 'axis',
            },
            grid: {
                containLabel: true,
            },
            legend: {
                data: ['新增订阅数', '取消订阅数'],
                top: '5%',
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
                    name: '新增订阅数',
                    type: 'line',
                    // lineStyle: {
                    //     normal: {
                    //         color: '#5687F7',
                    //     },
                    // },
                    // itemStyle: {
                    //     normal: {
                    //         color: '#5687F7',
                    //     },
                    // },
                    data: incrData,
                },
                {
                    name: '取消订阅数',
                    type: 'line',
                    // lineStyle: {
                    //     normal: {
                    //         color: '#E25050',
                    //     },
                    // },
                    // itemStyle: {
                    //     normal: {
                    //         color: '#E25050',
                    //     },
                    // },
                    data: delData,
                },
            ],
        };
        return option;
    }

    handleDownload = () => {
        const { beginDateValue, endDateValue, total } = this.state
        const { common } = this.props
        if (!!total) {
            window.location.href = `/wemedia/subs/export.do?start=${beginDateValue}&end=${endDateValue}&wemediaId=${common.user.wemediaId}`
        }
    }

    handlePageChange = (number) => {
        this.setState({
            pageNo: number,
        }, () => {

        });
    }

    panelDataRender = () => {
        const self = this
        const dateRange = this.state.dateRange
        const subData = this.props.subData.changeData
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
        const tableData = {
            columns: [
                { title: '日期', key: 'date', style: tableStyle },
                { title: '新增订阅数', key: 'subs', style: tableStyle },
                { title: '取消订阅数', key: 'unsubs', style: tableStyle },
                { title: "净增订阅数", key: "incr", style: tableStyle },
            ],
            dataSource: [],
            isHover: true,
            textCenter: true,
            rowHeight: '55px',
        }
        let copyArray = []
        let sumSubs = 0
        let sumUnsubs = 0
        const arrayLen = subData.list.length
        subData && subData.list.forEach((item) => {
            const { statsDate, subs, unsubs, incr } = item
            copyArray.push({
                date: moment(statsDate).format('YYYY-MM-DD'),
                subs,
                unsubs,
                incr,
            })
            sumSubs += subs
            sumUnsubs += unsubs
        })
        const averageSubs = arrayLen ? Math.floor(sumSubs / arrayLen) : 0
        const averageunSubs = arrayLen ? Math.floor(sumUnsubs / arrayLen) : 0
        const { pageNo, pageSize, total } = this.state
        const tableDataStart = (pageNo - 1) * pageSize
        let tableDataEnd = pageNo * pageSize
        tableDataEnd = tableDataEnd <= copyArray.length ? tableDataEnd : copyArray.length
        for (let i = tableDataStart; i < tableDataEnd; i++) {
            tableData.dataSource.push(copyArray[i])
        }
        const panelData = {
            normalHeader: true,
            title: '详细数据',
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
                        <div className="sdb-charts">
                            <div className="header">
                                <div>
                                    <span className="title">数据趋势</span>
                                    <span className="desc">
                                        {`新增订阅数 累计: ${sumSubs} 日均: ${averageSubs} 取消订阅数 累计: ${sumUnsubs} 日均: ${averageunSubs}`}
                                    </span>
                                </div>
                                {/*<div className="icon">*/}
                                {/*<span className="icon-item add">新增订阅数</span>*/}
                                {/*<span className="icon-item cancel">取消订阅数</span>*/}
                                {/*</div>*/}
                            </div>
                            <ReactEcharts option={this.getOption()} style={{ height: '350px' }}/>
                        </div>
                        <div className="sdb-table">
                            <div className="header">
                                <span className="title">数据明细</span>
                                {
                                    !!total ?
                                        <span className="download"
                                              onClick={self.handleDownload}><span>导出Excel</span></span> :
                                        <Tooltip
                                            content={<span className="download" onClick={self.handleDownload}><span>导出Excel</span></span>}
                                            position="left">
                                            暂无数据
                                        </Tooltip>
                                }
                            </div>
                            <Table {...tableData} />
                        </div>
                        <div className="sdb-page">
                            <Pagination total={this.state.total} showQuickJump={true}
                                        pageSize={this.state.pageSize}
                                        current={this.state.pageNo} onChange={this.handlePageChange}
                                        scrollToTop={false}/>
                        </div>

                    </div>
                )
            },
        }
        return panelData
    }

    render() {
        return (
            <div className="subscribe-data">
                <TopStatistics {...topStatisticsData} />
                {this.state.renderPanel && <Panel {...this.panelDataRender()} />}
            </div>
        )
    }
}

export default connect(
    state => ({
        subData: state.initSubData,
        common: state.common,
    }),
    dispatch => bindActionCreators({
        initSubData: action.initSubData,
    }, dispatch),
)(SubscribeData);