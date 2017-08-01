import React from 'react';
import PropTypes from 'prop-types';
import {Row, Col, Icon, Panel, DatePicker, Table, Pagination} from '../../../../library/index';
import classNames from 'classnames';
import moment from 'moment';
import ReactEcharts from 'echarts-for-react';

const mockChartData = {
    code: 1,
    data: [
        {
            date: '2017-07-21',
            planList: [
                {
                    title: '学习',
                    type: 'study',
                    weight: .4,
                    subPlan: [
                        {
                            title: 'PHP路由篇',
                            weight: .7,
                            aim: 1, // 目标完成度
                            startPercent: .7, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                        {
                            title: 'PHP数据库篇',
                            weight: .3,
                            aim: 1, // 目标完成度
                            startPercent: .3, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                    ],
                },
                {
                    title: '工作',
                    type: 'work',
                    weight: .3,
                    subPlan: [
                        {
                            title: '时间组件开发',
                            weight: .6,
                            aim: 1, // 目标完成度
                            startPercent: 0.3, // 当天开始任务完成度
                            endPercent: .8, // 当天结束任务完成度
                        },
                        {
                            title: '表单组件开发',
                            weight: .4,
                            aim: 1, // 目标完成度
                            startPercent: .6, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                    ],
                },
                {
                    title: '锻炼',
                    type: 'train',
                    weight: .3,
                    subPlan: [
                        {
                            title: '胸部锻炼',
                            weight: 1,
                            subPlan: [
                                {title: '上斜卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '下斜卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '俯卧撑', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '蝴蝶机夹胸', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                            ],
                        },
                    ],
                },
            ],
        },
        {
            date: '2017-07-22',
            planList: [
                {
                    title: '学习',
                    type: 'study',
                    weight: .4,
                    subPlan: [
                        {
                            title: 'PHP路由篇',
                            weight: .7,
                            aim: 1, // 目标完成度
                            startPercent: .7, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                        {
                            title: 'PHP数据库篇',
                            weight: .3,
                            aim: 1, // 目标完成度
                            startPercent: .3, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                    ],
                },
                {
                    title: '工作',
                    type: 'work',
                    weight: .3,
                    subPlan: [
                        {
                            title: '时间组件开发',
                            weight: .6,
                            aim: 1, // 目标完成度
                            startPercent: 0.3, // 当天开始任务完成度
                            endPercent: .8, // 当天结束任务完成度
                        },
                        {
                            title: '表单组件开发',
                            weight: .4,
                            aim: 1, // 目标完成度
                            startPercent: .6, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                    ],
                },
                {
                    title: '锻炼',
                    type: 'train',
                    weight: .3,
                    subPlan: [
                        {
                            title: '胸部锻炼',
                            weight: 1,
                            subPlan: [
                                {title: '上斜卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '下斜卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '俯卧撑', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '蝴蝶机夹胸', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                            ],
                        },
                    ],
                },
            ],
        },
        {
            date: '2017-07-23',
            planList: [
                {
                    title: '学习',
                    type: 'study',
                    weight: .4,
                    subPlan: [
                        {
                            title: 'PHP路由篇',
                            weight: .7,
                            aim: 1, // 目标完成度
                            startPercent: .7, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                        {
                            title: 'PHP数据库篇',
                            weight: .3,
                            aim: 1, // 目标完成度
                            startPercent: .3, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                    ],
                },
                {
                    title: '工作',
                    type: 'work',
                    weight: .3,
                    subPlan: [
                        {
                            title: '时间组件开发',
                            weight: .6,
                            aim: 1, // 目标完成度
                            startPercent: 0.3, // 当天开始任务完成度
                            endPercent: .8, // 当天结束任务完成度
                        },
                        {
                            title: '表单组件开发',
                            weight: .4,
                            aim: 1, // 目标完成度
                            startPercent: .6, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                    ],
                },
                {
                    title: '锻炼',
                    type: 'train',
                    weight: .3,
                    subPlan: [
                        {
                            title: '胸部锻炼',
                            weight: 1,
                            subPlan: [
                                {title: '上斜卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '下斜卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '俯卧撑', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '蝴蝶机夹胸', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                            ],
                        },
                    ],
                },
            ],
        },
        {
            date: '2017-07-24',
            planList: [
                {
                    title: '学习',
                    type: 'study',
                    weight: .4,
                    subPlan: [
                        {
                            title: 'PHP路由篇',
                            weight: .7,
                            aim: 1, // 目标完成度
                            startPercent: .7, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                        {
                            title: 'PHP数据库篇',
                            weight: .3,
                            aim: 1, // 目标完成度
                            startPercent: .3, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                    ],
                },
                {
                    title: '工作',
                    type: 'work',
                    weight: .3,
                    subPlan: [
                        {
                            title: '时间组件开发',
                            weight: .6,
                            aim: 1, // 目标完成度
                            startPercent: 0.3, // 当天开始任务完成度
                            endPercent: .8, // 当天结束任务完成度
                        },
                        {
                            title: '表单组件开发',
                            weight: .4,
                            aim: 1, // 目标完成度
                            startPercent: .6, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                    ],
                },
                {
                    title: '锻炼',
                    type: 'train',
                    weight: .3,
                    subPlan: [
                        {
                            title: '胸部锻炼',
                            weight: 1,
                            subPlan: [
                                {title: '上斜卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '下斜卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '俯卧撑', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '蝴蝶机夹胸', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                            ],
                        },
                    ],
                },
            ],
        },
        {
            date: '2017-07-25',
            planList: [
                {
                    title: '学习',
                    type: 'study',
                    weight: .4,
                    subPlan: [
                        {
                            title: 'PHP路由篇',
                            weight: .7,
                            aim: 1, // 目标完成度
                            startPercent: .7, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                        {
                            title: 'PHP数据库篇',
                            weight: .3,
                            aim: 1, // 目标完成度
                            startPercent: .3, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                    ],
                },
                {
                    title: '工作',
                    type: 'work',
                    weight: .3,
                    subPlan: [
                        {
                            title: '时间组件开发',
                            weight: .6,
                            aim: 1, // 目标完成度
                            startPercent: 0.3, // 当天开始任务完成度
                            endPercent: .8, // 当天结束任务完成度
                        },
                        {
                            title: '表单组件开发',
                            weight: .4,
                            aim: 1, // 目标完成度
                            startPercent: .6, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                    ],
                },
                {
                    title: '锻炼',
                    type: 'train',
                    weight: .3,
                    subPlan: [
                        {
                            title: '胸部锻炼',
                            weight: 1,
                            subPlan: [
                                {title: '上斜卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '下斜卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '俯卧撑', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '蝴蝶机夹胸', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                            ],
                        },
                    ],
                },
            ],
        },
        {
            date: '2017-07-26',
            planList: [
                {
                    title: '学习',
                    type: 'study',
                    weight: .4,
                    subPlan: [
                        {
                            title: 'PHP路由篇',
                            weight: .7,
                            aim: 1, // 目标完成度
                            startPercent: .7, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                        {
                            title: 'PHP数据库篇',
                            weight: .3,
                            aim: 1, // 目标完成度
                            startPercent: .3, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                    ],
                },
                {
                    title: '工作',
                    type: 'work',
                    weight: .3,
                    subPlan: [
                        {
                            title: '时间组件开发',
                            weight: .6,
                            aim: 1, // 目标完成度
                            startPercent: 0.3, // 当天开始任务完成度
                            endPercent: .8, // 当天结束任务完成度
                        },
                        {
                            title: '表单组件开发',
                            weight: .4,
                            aim: 1, // 目标完成度
                            startPercent: .6, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                    ],
                },
                {
                    title: '锻炼',
                    type: 'train',
                    weight: .3,
                    subPlan: [
                        {
                            title: '胸部锻炼',
                            weight: 1,
                            subPlan: [
                                {title: '上斜卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '下斜卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '俯卧撑', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '蝴蝶机夹胸', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                            ],
                        },
                    ],
                },
            ],
        },
        {
            date: '2017-07-27',
            planList: [
                {
                    title: '学习',
                    type: 'study',
                    weight: .4,
                    subPlan: [
                        {
                            title: 'PHP路由篇',
                            weight: .7,
                            aim: 1, // 目标完成度
                            startPercent: .7, // 当天开始任务完成度
                            endPercent: 1, // 当天结束任务完成度
                        },
                        {
                            title: 'PHP数据库篇',
                            weight: .3,
                            aim: 1, // 目标完成度
                            startPercent: .3, // 当天开始任务完成度
                            endPercent: 1, // 当天结束任务完成度
                        },
                    ],
                },
                {
                    title: '工作',
                    type: 'work',
                    weight: .3,
                    subPlan: [
                        {
                            title: '时间组件开发',
                            weight: .6,
                            aim: 1, // 目标完成度
                            startPercent: 0.3, // 当天开始任务完成度
                            endPercent: .8, // 当天结束任务完成度
                        },
                        {
                            title: '表单组件开发',
                            weight: .4,
                            aim: 1, // 目标完成度
                            startPercent: .6, // 当天开始任务完成度
                            endPercent: .9, // 当天结束任务完成度
                        },
                    ],
                },
                {
                    title: '锻炼',
                    type: 'train',
                    weight: .3,
                    subPlan: [
                        {
                            title: '胸部锻炼',
                            weight: 1,
                            subPlan: [
                                {title: '上斜卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '下斜卧推', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '俯卧撑', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                                {title: '蝴蝶机夹胸', weight: .2, aim: 1, startPercent: 0, endPercent: 1},
                            ],
                        },
                    ],
                },
            ],
        },
    ],
}

class MakePlan extends React.PureComponent {
    static propTypes = {
        className: PropTypes.string,
        user: PropTypes.object,
    };

    static defaultProps = {
        user: {},
    };

    constructor(props, context) {
        super(props, context);
    }

    getOption = () => {
        const listData = mockChartData.data
        const xAxisData = []
        const yDateAxisData = []
        const yStudyAxisData = []
        const yWorkAxisData = []
        const yTrainAxisData = []
        listData.forEach((item) => {
            xAxisData.push(item.date)
            const dateObject = {
                date: item.date,
                data: [],
            }
            item.planList.forEach((dateItem, index) => {
                const typeObject = {
                    type: dateItem.type,
                    weight: dateItem.weight,
                    percent: [],
                }
                const mapSubPlan = (plan, weight = 1) => {
                    let typeSumPercent = 0
                    plan.forEach((item) => {
                        const temWeight = weight * item.weight
                        if (item.subPlan) {
                            mapSubPlan(item.subPlan, temWeight)
                        } else {
                            const {startPercent, endPercent, weight, aim} = item
                            let finishedPercent = ((endPercent - startPercent) / (aim - startPercent) * weight).toFixed(5)
                            typeSumPercent += +finishedPercent
                            typeObject.typePercent = typeSumPercent
                            typeObject.percent.push(finishedPercent)
                        }
                    })
                }
                mapSubPlan(dateItem.subPlan, 1)
                dateObject.data.push(typeObject)
            })
            let sumPercent = 0
            dateObject.data.forEach((item) => {
                switch (item.type) {
                    case 'study':
                        yStudyAxisData.push(((+item.typePercent) * 100).toFixed(1))
                        break
                    case 'work':
                        yWorkAxisData.push(((+item.typePercent) * 100).toFixed(1))
                        console.log(item.typePercent, (+item.typePercent).toFixed(1), ((+item.typePercent) * 100).toFixed(1))
                        break
                    case 'train':
                        yTrainAxisData.push(((+item.typePercent) * 100).toFixed(1))
                        break

                }
                let typePercent = 0
                item.percent.forEach((percent) => {
                    typePercent = (+percent) + typePercent
                })
                sumPercent += +(typePercent) * (+item.weight)
            })
            yDateAxisData.push((+sumPercent * 100).toFixed(1))
        })

        const option = {
            title: {
                text: '总计划完成趋势',
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data:['总计划', '工作计划', '学习计划', '锻炼计划'],
            },
            grid: {
                containLabel: true,
                height: '230px',
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
                    name: '总计划',
                    type: 'line',
                    data: yDateAxisData,
                },
                {
                    name: '工作计划',
                    type: 'line',
                    data: yWorkAxisData,
                },
                {
                    name: '学习计划',
                    type: 'line',
                    data: yStudyAxisData,
                },
                {
                    name: '锻炼计划',
                    type: 'line',
                    data: yTrainAxisData,
                },
            ],
        };

        return option;
    }
    panelDataRender = () => {
        const self = this
        const panelData = {
            header: () => {
                return '制定计划'
            },
            body: () => {
                return (
                    <div className="mpd-body">
                        <div className="mpd-charts">
                            <ReactEcharts option={this.getOption()} />
                        </div>
                    </div>
                )
            },
        }
        return panelData
    }

    render() {
        return (
            <div className="make-plan">
                <Panel {...this.panelDataRender()} />
            </div>
        )
    }
}

export default MakePlan;