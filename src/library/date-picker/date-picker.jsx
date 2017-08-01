import React from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import moment from 'moment'
import Input from '../input'
import classNames from 'classnames';
import DtItem from './dt-item'
class DatePicker extends React.Component {

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
        inputClass: PropTypes.string,
        format: PropTypes.string,
        onChange: PropTypes.func,
        showTime: PropTypes.bool,
    }
    static defaultProps = {
        type: 'date',
        readonly: true,
        disabled: false,
        format: 'YYYY-MM-DD',
        editable: true,
        clearable: true,
        size: 'small',
        placeholder: '',
        onChange: (obj) => console.log(obj),
        align: 'left',
        popperClass: '',
        pickerOptions: {},
        separator: '-',
        inputClass: '',
        showTime: true,
        defaultValue: moment().format('YYYY-MM-DD'),
        beginDateValue: moment().format('YYYY-MM-DD'),
        endDateValue: moment().format('YYYY-MM-DD'),
    }

    constructor(props) {
        super(props)
        const { defaultValue, format, beginDateValue, endDateValue } = this.props
        const onlyTimeValue = moment(new Date(defaultValue)).format(format)
        const beginTimeValue = moment(new Date(beginDateValue)).format(format)
        const endTimeValue = moment(new Date(endDateValue)).format(format)
        this.state = {
            displayPicker: false,
            beginPicker: false,
            endPicker: false,
            onlyTimeValue,
            beginTimeValue,
            endTimeValue,
            shouldRender: false,
        }
        this.handleClosePanel = this.handleClosePanel.bind(this)
    }

    componentDidMount() {
        document.addEventListener('click', this.handleClosePanel, false)
    }

    shouldComponentUpdate(nextProps, nextStates) {
        const { beginDateValue, endDateValue, defaultValue } = this.props
        if (nextStates.shouldRender || beginDateValue !== nextProps.beginDateValue || endDateValue !== nextProps.endDateValue || defaultValue !== nextProps.defaultValue) {
            return true
        } else {
            return false
        }
    }

    componentWillReceiveProps(props) {
        const {beginDateValue, endDateValue, defaultValue, onChange} = props
        const {beginTimeValue, endTimeValue, onlyTimeValue} = this.state
        switch (true) {
            case beginTimeValue !== beginDateValue:
                this.setState({
                    beginTimeValue: beginDateValue,
                    endTimeValue: endDateValue,
                })
                onChange({beginTime: beginDateValue, endTime: endDateValue})
                break
            case endTimeValue !== endDateValue:
                this.setState({
                    beginTimeValue: beginDateValue,
                    endTimeValue: endDateValue,
                })
                onChange({beginTime: beginDateValue, endTime: endDateValue})
                break
            case onlyTimeValue !== defaultValue:
                this.setState({
                    onlyTimeValue: defaultValue,
                })
                onChange({currentTime: defaultValue})
                break
        }
    }

    componentWillUnmount() {
        document.removeEventListener('click', this.handleClosePanel, false)
    }
    handleClosePanel = (e) => {
        let target = e.target
        let container
        let type
        const {displayPicker, beginPicker, endPicker} = this.state

        if (displayPicker) {
            container = document.getElementById('datePickerCon')
            type = 'date'
        } else if (beginPicker) {
            container = document.getElementById('beginDateCon')
            type = 'date-range-begin'
        } else if (endPicker) {
            container = document.getElementById('endDateCon')
            type = 'date-range-end'
        }
        if (container && !container.contains(target)) {
            this.onInputClick(type, false)
        }
    }
    onInputClick = (type, bool) => {
        const {beginPicker, endPicker} = this.state
        const {disabled} = this.props
        if (disabled) {
            return
        }
        this.setState({
            shouldRender: true,
        })
        switch (type) {
            case 'date-range-begin':
                this.setState({
                    beginPicker: bool,
                })
                if (endPicker) {
                    this.setState({
                        endPicker: false,
                    })
                }
                break
            case 'date-range-end':
                this.setState({
                    endPicker: bool,
                })
                if (beginPicker) {
                    this.setState({
                        beginPicker: false,
                    })
                }
                break
            case 'date':
                this.setState({
                    displayPicker: bool,
                })
                break
        }

    };

    onChange = (type, time) => {
        const {onChange} = this.props;
        let selectDate
        switch (type) {
            case 'date-range-begin':
                this.setState({
                    beginTimeValue: time,
                })
                selectDate = {
                    beginTime: time,
                    endTime: this.state.endTimeValue,
                }
                break
            case 'date-range-end':
                selectDate = {
                    beginTime: this.state.beginTimeValue,
                    endTime: time,
                }
                this.setState({
                    endTimeValue: time,
                })
                break
            case 'date':
                selectDate = {
                    currentTime: time,
                }
                this.setState({
                    onlyTimeValue: time,
                })
                break
        }

        onChange && onChange(selectDate)
    }

    render() {
        const {type, placeholder, format, separator, selectType, readOnly, disabled, showTime, inputClass} = this.props;
        const {displayPicker, onlyTimeValue, beginTimeValue, endTimeValue, beginPicker, endPicker} = this.state;
        if (type === 'date') {
            return (
                <div className="date-picker" id="datePickerCon">
                    <Input placeholder={placeholder} onFocus={() => this.onInputClick('date', true)}
                           value={onlyTimeValue} readOnly={readOnly} disabled={disabled} className={inputClass} />
                    <Transition timeout={150} in={displayPicker}>
                        {(state) => (
                            <DtItem type={'date'} selectType={selectType} openState={state} currentTime={onlyTimeValue}
                                    className={classNames('dt-item', [`dt-item-${displayPicker}`])}
                                    onBlur={() => this.onInputClick('date', false) } format={format}
                                    onChange={this.onChange} showTime={showTime} />
                        )}
                    </Transition>
                </div>
            )
        } else if (type === 'date-range') {
            return (
                <div className="date-range">
                    <div className="left-inner"  id="beginDateCon">
                        <Input placeholder={placeholder} onFocus={() => this.onInputClick('date-range-begin', true)}
                               value={beginTimeValue} readOnly={readOnly} disabled={disabled} className={inputClass}/>
                        <Transition timeout={150} in={beginPicker}>
                            {(state) => (
                                <DtItem type={'date-range-begin'} selectType={selectType} endTime={endTimeValue}
                                        className={classNames('dt-item', [`dt-item-${beginPicker}`])} openState={state}
                                        onBlur={() => this.onInputClick('date-range-begin', false)} format={format}
                                        onChange={this.onChange} showTime={showTime} currentTime={beginTimeValue} />
                            )}
                        </Transition>
                    </div>
                    <span className="date-separator">{separator}</span>
                    <div className="right-inner" id="endDateCon">
                        <Input placeholder={placeholder} onFocus={() => this.onInputClick('date-range-end', true)}
                               value={endTimeValue} readOnly={readOnly} disabled={disabled} className={inputClass} />
                        <Transition timeout={150} in={endPicker}>
                            {(state) => (
                                <DtItem type={'date-range-end'} selectType={selectType} beginTime={beginTimeValue}
                                        className={classNames('dt-item', [`dt-item-${endPicker}`])} openState={state}
                                        onBlur={() => this.onInputClick('date-range-end', false)} format={format}
                                        onChange={this.onChange} showTime={showTime} currentTime={endTimeValue} />
                            )}
                        </Transition>
                    </div>
                </div>
            )
        }

    }

}

export default DatePicker