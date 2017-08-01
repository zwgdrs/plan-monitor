import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import moment from 'moment';
import Icon from '../icon';
import dateConfig from './config'
class DtItem extends React.PureComponent {
    static propTypes = {
        readonly: PropTypes.bool,
        disabled: PropTypes.bool,
        editable: PropTypes.bool,
        clearable: PropTypes.bool,
        size: PropTypes.string,
        placeholder: PropTypes.string,
        type: PropTypes.string,
        align: PropTypes.string,
        popperClass: PropTypes.string,
        pickerOptions: PropTypes.object,
        rangeSeparator: PropTypes.string,
        defaultValue: PropTypes.string,
    }
    static defaultProps = {
        currentTime: moment().format('YYYY-MM-DD'),
        readonly: false,
        disabled: false,
        editable: true,
        clearable: true,
        size: 'small',
        placeholder: '',
        type: 'date',
        align: 'left',
        popperClass: '',
        pickerOptions: {},
        rangeSeparator: '-',
    }

    constructor(props) {
        super(props)
        this.state = {
            currentDate: new Date(this.props.currentTime),
            currentYear: new Date(this.props.currentTime).getFullYear(),
            currentMonth: new Date(this.props.currentTime).getMonth() + 1,
            currentDay: new Date(this.props.currentTime).getDay(),
            monthDaysArray: [],
            datePickerType: 'select-day',
            curDecadeyears: [],
            timePanel: this.props.showTime,
            datePanel: true,
            selectHour: '00',
            selectMinute: '00',
            selectSecond: '00',
        }
        this.changePanel = this.changePanel.bind(this)
        this.initMonthArray = this.initMonthArray.bind(this) // 加载渲染当前每月天数数据
        this.changeDatePickerType = this.changeDatePickerType.bind(this)
        this.displayYears = this.displayYears.bind(this)
        this.renderYearsPanel = this.renderYearsPanel.bind(this) // 加载渲染年数据
        this.selectYear = this.selectYear.bind(this) // 选择日期年
        this.selectMonth = this.selectMonth.bind(this) // 选择日期月
        this.selectDay = this.selectDay.bind(this) // 选择日期day
        this.changeTimeOrDatePanel = this.changeTimeOrDatePanel.bind(this) // 选择时间day
        this.selectTime = this.selectTime.bind(this) // 选择时间
        this.handleSureTime = this.handleSureTime.bind(this) // 确定时间
        this.count = 1
    }

    // componentDidMount() {
    //     const {selectType} = this.props
    //     this.setState({
    //         datePickerType: selectType,
    //     })
    //
    //     this.initMonthArray()
    //     this.renderYearsPanel()
    // }

    componentWillReceiveProps(props) {
        const {currentTime, selectType} = props
        this.setState({
            datePickerType: selectType,
        })
        this.setState({
            currentDate: new Date(currentTime),
            currentYear: new Date(currentTime).getFullYear(),
            currentMonth: new Date(currentTime).getMonth() + 1,
            currentDay: new Date(currentTime).getDay(),
        },() => {
            this.initMonthArray()
            this.renderYearsPanel()
        })
    }
    changePanel(type) {
        switch (type) {
            case 'days-prev':
                this.setState({
                    currentMonth: this.state.currentMonth === 1 ? 12 : this.state.currentMonth - 1,
                }, () => this.initMonthArray())
                break
            case 'days-next':
                this.setState({
                    currentMonth: this.state.currentMonth === 12 ? 1 : this.state.currentMonth + 1,
                }, () => this.initMonthArray())
                break
            case 'months-prev':
                this.setState({
                    currentYear: this.state.currentYear - 1,
                }, () => this.initMonthArray())
                break
            case 'months-next':
                this.setState({
                    currentYear: this.state.currentYear + 1,
                }, () => this.initMonthArray())
                break
            case 'years-prev':
                this.setState({
                    currentYear: this.state.currentYear - 10,
                }, () => {
                    this.initMonthArray()
                    this.renderYearsPanel()
                })
                break
            case 'years-next':
                this.setState({
                    currentYear: this.state.currentYear + 10,
                }, () => {
                    this.initMonthArray()
                    this.renderYearsPanel()
                })
                break
            default:
                return
        }
    }

    //载入重渲染每月天数数据
    initMonthArray() {
        const {currentYear, currentMonth} = this.state
        const format = this.props.format
        const curTime = new Date(`${currentYear}-${currentMonth}-01`)
        let curDay = new Date(`${currentYear}-${currentMonth}-01`).getDay()
        if (!curDay) {
            curDay = 7
        }
        const curMonthDays = new Date(curTime.getFullYear(), (curTime.getMonth() + 1), 0).getDate()
        const lastMonthDays = new Date(curTime.getFullYear(), (curTime.getMonth()), 0).getDate()
        const monthDaysArray = []
        let newDay = 1
        let currentDay = 1
        for (let i = 1; i <= 42; i++) {
            if (i < +curDay) {
                const day = lastMonthDays - curDay + i + 1
                monthDaysArray.push({
                    title: day,
                    type: 'old',
                    dayFormat: moment(new Date(`${currentYear}-${currentMonth - 1}-${day}`)).format(format),
                })
            } else if (i >= curDay && i <= curDay - 1 + curMonthDays) {
                monthDaysArray.push({
                    title: currentDay,
                    type: 'current',
                    dayFormat: moment(new Date(`${currentYear}-${currentMonth}-${currentDay}`)).format(format),
                })
                currentDay++
            } else {
                monthDaysArray.push({
                    title: newDay,
                    type: 'new',
                    dayFormat: moment(new Date(`${currentYear}-${currentMonth + 1}-${newDay}`)).format(format),
                })
                newDay++
            }
        }
        this.setState({
            monthDaysArray,
        })
    }

    // 向上切换年月日面板
    changeDatePickerType(datePickerType) {
        this.setState({
            datePickerType,
        })
        if (datePickerType === 'select-year') {
            this.renderYearsPanel()
        }
    }

    // 展示年
    displayYears() {
        const {currentYear} = this.state
        const singleDigit = currentYear % 10
        if (singleDigit !== 0) {
            return `${currentYear - singleDigit} - ${currentYear - singleDigit + 10}`
        } else {
            return `${currentYear} - ${currentYear + 10}年`
        }
    }

    // 渲染年份
    renderYearsPanel() {
        const {currentYear} = this.state
        const singleDigit = currentYear % 10
        const curDecadeyears = []
        if (singleDigit) {
            for (let i = -1; i < 11; i++) {
                curDecadeyears.push(currentYear - singleDigit + i)
            }
        } else {
            for (let i = -1; i < 11; i++) {
                curDecadeyears.push(currentYear + i)
            }
        }
        this.setState({
            curDecadeyears,
        })
    }

    // 选择年份
    selectYear(index) {
        const {selectType, onBlur, format, onChange, type} = this.props
        const {curDecadeyears} = this.state
        const rightType = selectType === 'select-year'
        const checkedYear = curDecadeyears[index]
        if (rightType) {
            this.setState({
                currentYear: checkedYear,
                currentDate: moment(new Date(`${checkedYear}-01-01`)).format(format),
            }, () => {
                this.initMonthArray()
                onChange && onChange(type, moment(new Date(`${checkedYear}-01-01`)).format(format))
            })
            setTimeout(() => {
                onBlur && onBlur()
            }, 200)
            if (index === 11) {
                this.changePanel('years-next')
            } else if (index === 0) {
                this.changePanel('years-prev')
            }
        } else {
            this.setState({
                currentYear: checkedYear,
                datePickerType: 'select-month',
            }, () => {
                this.initMonthArray()
            })
        }
    }

    // 选择月份
    selectMonth(index) {
        const {selectType, onBlur, format, onChange, type} = this.props
        const {currentYear} = this.state
        const rightType = selectType === 'select-month'
        if (rightType) {
            this.setState({
                currentMonth: index + 1,
                currentDate: moment(new Date(`${currentYear}-${index + 1}-01`)).format(format),
            }, () => {
                this.initMonthArray()
            })
            setTimeout(() => {
                onBlur && onBlur()
            }, 200)
            onChange && onChange(type, moment(new Date(`${currentYear}-${index + 1}-01`)).format(format))
        } else {
            this.setState({
                currentMonth: index + 1,
                datePickerType: 'select-day',
            }, () => {
                this.initMonthArray()
            })
        }
    }

    // 选择天
    selectDay(index) {
        const {monthDaysArray} = this.state
        const {onBlur, format, onChange, type} = this.props
        this.setState({
            currentDate: monthDaysArray[index].dayFormat,
        })
        onChange && onChange(type, moment(new Date(monthDaysArray[index].dayFormat)).format(format))
        // setTimeout(() => {
        //     onBlur && onBlur()
        // }, 200)
    }

    changeTimeOrDatePanel() {
        this.setState({
            datePanel: !this.state.datePanel,
        })
    }

    selectTime(type, time) {
        this.setState({
            [type]: time,
        })
    }

    handleSureTime() {
        const {onChange, format, type, onBlur} = this.props
        const {currentDate, selectHour, selectMinute, selectSecond} = this.state
        // onBlur && onBlur()
        this.setState({
            datePanel: true,
        })
        onChange && onChange(type, moment(new Date(`${moment(new Date(currentDate)).format('YYYY-MM-DD')} ${selectHour}:${selectMinute}:${selectSecond}`)).format(format))
    }

    render() {
        const {className, beginTime, endTime, format, showTime} = this.props
        const {days, months} = dateConfig
        const {currentYear, currentMonth, monthDaysArray, datePickerType, curDecadeyears, currentDate, datePanel} = this.state
        return (
            <div className={className} ref={(container) => this.container = container}>
                <span className={classNames({'up-triangular-pink': datePanel, 'up-triangular-white': !datePanel})} />
                <div className={classNames("inner date-picker-days", {'disable': datePickerType !== 'select-day'})}>
                    <div className="table">
                        {
                            datePanel ?
                                <div className="table-date">
                                    <div className="thead">
                                        <div className="first-tr">
                                        <span className="th prev" onClick={() => this.changePanel('days-prev')}><Icon type="left-arrow"/></span>
                                            <span className="th date-picker-switch"
                                                  onClick={() => this.changeDatePickerType('select-month')}>{`${currentMonth}月 ${currentYear}`}</span>
                                            <span className="th next" onClick={() => this.changePanel('days-next')}><Icon type="right-arrow"/></span>
                                        </div>
                                        <div className="tr">
                                            {days.map((item) => {
                                                return (
                                                    <span className="td" key={item}>{item}</span>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div className="tbody">
                                        {
                                            monthDaysArray.map((day, index) => {
                                                const {title, type, dayFormat} = monthDaysArray[index]
                                                const className = moment(currentDate).format(format) === dayFormat ? `td ${type}-day checked` : `td ${type}-day`
                                                if ((this.props.type === 'date-range-begin' && new Date(dayFormat) >= new Date(endTime)) || (this.props.type === 'date-range-end' && new Date(dayFormat) < new Date(beginTime))) {
                                                    return <span key={`${day}-${index}`} className={className}
                                                                 disabled>{title}</span>
                                                } else {
                                                    return <span key={`${day}-${index}`} className={className}
                                                                 onClick={() => this.selectDay(index)}>{title}</span>
                                                }

                                            })
                                        }
                                    </div>
                                </div> :
                                <div className="table-time">
                                    <div className="time-item">
                                        {dateConfig.easyToMap(24).map((item) => {
                                            const classes = classNames('time-unit', {checked: item === this.state.selectHour})
                                            return (
                                                <span className={classes} key={`hour-${item}`} onClick={() => this.selectTime('selectHour', item)}>{item}</span>
                                            )
                                        })}
                                    </div>
                                    <div className="time-item">
                                        {dateConfig.easyToMap(60).map((item) => {
                                            const classes = classNames('time-unit', {checked: item === this.state.selectMinute})
                                            return (
                                                <span className={classes} key={`minute-${item}`} onClick={() => this.selectTime('selectMinute', item)}>{item}</span>
                                            )
                                        })}
                                    </div>
                                    <div className="time-item">
                                        {dateConfig.easyToMap(60).map((item) => {
                                            const classes = classNames('time-unit', {checked: item === this.state.selectSecond})
                                            return (
                                                <span className={classes} key={`second-${item}`} onClick={() => this.selectTime('selectSecond', item)}>{item}</span>
                                            )
                                        })}
                                    </div>
                                </div>
                        }
                        <div className="tfoot">
                            {
                                showTime &&
                                <div className="time-choose" style={datePanel ? {justifyContent: 'flex-end', marginRight: '20px'} : {}}>
                                    <span onClick={this.changeTimeOrDatePanel}>{datePanel ? 'time' : 'date'}</span>
                                    {!datePanel && <span onClick={this.handleSureTime}>select</span>}
                                </div>
                            }
                        </div>
                    </div>
                </div>
                <div className={classNames("inner date-picker-months", {'disable': datePickerType !== 'select-month'})}>
                    <div className="table table-condensed">
                        <div className="thead">
                            <div className="first-tr">
                                <span className="th prev"
                                      onClick={() => this.changePanel('months-prev')}><Icon
                                    type="left-arrow"/></span>
                                <span className="th date-picker-switch"
                                      onClick={() => this.changeDatePickerType('select-year')}>{`${currentYear}年`}</span>
                                <span className="th next"
                                      onClick={() => this.changePanel('months-next')}><Icon
                                    type="right-arrow"/></span>
                            </div>
                        </div>
                        <div className="tbody">
                            {
                                months.map((item, index) => {
                                    const disabled = ((this.props.type === 'date-range-begin' && new Date(endTime) <= new Date(`${currentYear}-${index + 1}`))
                                    || (this.props.type === 'date-range-end' && new Date(beginTime) >= new Date(`${currentYear}-${index + 1}`)))
                                    const classes = classNames('td', {checked: moment(new Date(`${currentYear}-${index + 1}`)).format(format) === currentDate})
                                    return (
                                        <span className={classes} key={item}
                                              onClick={!disabled && (() => this.selectMonth(index))}
                                              disabled={disabled}>{item}</span>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className={classNames("inner date-picker-years", {'disable': datePickerType !== 'select-year'})}>
                    <div className="table table-condensed">
                        <div className="thead">
                            <div className="first-tr">
                                <span className="th prev"
                                      onClick={() => this.changePanel('years-prev')}><Icon
                                    type="left-arrow"/></span>
                                <span className="th date-picker-switch">{this.displayYears()}</span>
                                <span className="th next"
                                      onClick={() => this.changePanel('years-next')}><Icon
                                    type="right-arrow"/></span>
                            </div>
                        </div>
                        <div className="tbody">
                            {
                                curDecadeyears.map((item, index) => {
                                    const disabled = ((this.props.type === 'date-range-begin' && new Date(+endTime) <= new Date(curDecadeyears[index]))
                                    || (this.props.type === 'date-range-end' && new Date(+beginTime) >= new Date(curDecadeyears[index])))
                                    const classes = classNames('td', {checked: +moment(new Date(`${curDecadeyears[index]}`)).format(format) === new Date(currentDate).getFullYear()})
                                    return (
                                        <span className={classes} key={item}
                                              onClick={!disabled && (() => this.selectYear(index))}
                                              disabled={disabled}>{item}</span>
                                    )
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }

}

export default DtItem