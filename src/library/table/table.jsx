import React from 'react';
import PropTypes from 'prop-types';
import isFunction from 'lodash/isFunction';
import TableCell from './tableCell';


class Table extends React.PureComponent {
    /***
     * params:
     *  columns: 表格设定。
     * title: string类型，标题，非可选
     * key: string类型，键值，非可选
     * style: object类型，样式，可选
     * render: func类型，渲染自定义html，可选
     *  dataSource: array类型，表格渲染的数据，可选。
     *  onClickTh: 函数类型，点击标题触发的回调函数。
     *  loading: bool类型，当图表未加载到数据时候使用，显示正在加载数据状态。
     *  checkRow: bool类型，是否显示每行列表的勾选框
     *  longTable: bool类型，是否允许x轴滚动
     *  filterData: array类型，表单过滤，可选。
     *  selectSort: array类型，表单排序，可选。
     *  checkBoxCallback: func类型，表单选择回调函数，参数：selectDatas, array类型，选择的行数据。
     *  allBorder: bool类型，是否显示全边框，true为显示，false为只显示下边框，可选，默认为false
     *  stripe: bool类型，是否显示条纹表格，true为显示，false为不显示，可选，默认为不显示。
     *  isHover: bool类型，是否显示鼠标当前所在行的hover背景样式，true为显示，false为不显示，默认不显示。
     * */
    static propTypes = {
        columns: PropTypes.array,
        dataSource: PropTypes.array,
        onClickTh: PropTypes.func,
        loading: PropTypes.bool,
        className: PropTypes.string,
        rowHeight: PropTypes.string,
        textCenter: PropTypes.bool,
        checkBox: PropTypes.bool,
        longTable: PropTypes.bool,
        checkBoxCallback: PropTypes.func,
        allBorder: PropTypes.bool,
        stripe: PropTypes.bool,
        isHover: PropTypes.bool,
        expandColumns: PropTypes.array,

    };
    static defaultProps = {
        onClickTh: () => {
        },
        loading: false,
        className: '',
        checkBox: false,
        loneTable: false,
        checkBoxCallback: (selectDatas) => console.log(selectDatas),
        allBorder: false,
        stripe: false,
        isHover: false,
        expandColumns: [],
        textCenter: false,
        prefixCls: 'ne-table',
    };

    constructor(props, context) {
        super(props, context);
        this.onTableClick = this.onTableClick.bind(this);
        this.checkRow = this.checkRow.bind(this);
        this.selectSort = this.selectSort.bind(this);
        this.selectRows = []
    }

    // componentDidMount() {
    //     let { columns, dataSource, checkBox } = this.props;
    //     if (checkBox) {
    //         columns.unshift({title: 'checkBox', key: 'checkBox', style: {minWidth: '50px'}})
    //     }
    // }

    onTableClick(event) {
        let target = event.target;
        this['onClick' + target.nodeName] && this['onClick' + target.nodeName](event);
    }

    checkRow(ele, all) {
        const className = ele.target.className
        const { dataSource, checkBoxCallback } = this.props
        const checkedList = document.querySelectorAll('.checked-box-inner')
        const checkList = document.querySelectorAll('.check-box-inner')
        if (all === 'all') {
            if (className === 'check-box-inner') {
                this.selectRows = Object.assign([], dataSource)
                checkList.forEach((item) => {
                    item.className = 'checked-box-inner'
                })
            } else {
                this.selectRows = []
                checkedList.forEach((item) => {
                    item.className = 'check-box-inner'
                })
            }
        } else {
            if (className === 'check-box-inner') {
                this.selectRows.push({ [all]: dataSource[all] })
                ele.target.className = 'checked-box-inner'
            } else {
                const tempArray = this.selectRows.filter((item) => {
                    return +Object.keys(item)[0] !== all
                })
                this.selectRows = Object.assign([], tempArray)

                ele.target.className = 'check-box-inner'
            }
        }
        checkBoxCallback(this.selectRows)
    }

    selectSort() {
        console.log("表单排序")
    }

    render() {
        let {
            columns, dataSource, onClickTh, loading, styles, className, longTable, checkBox,
            allBorder, stripe, isHover, textCenter, rowHeight, prefixCls,
        } = this.props;
        let rule = [];
        const newColumns = Object.assign([], columns)
        const checkElm = (all) => {
            return (
                <div className="check-box">
                    <span className="check-box-inner" onClick={(event) => this.checkRow(event, all)}></span>
                </div>
            )
        }
        if (checkBox) {
            newColumns.unshift({
                key: 'checkBox',
                style: { minWidth: '50px' },
                renderHeader: checkElm,
                render: checkElm,
            })
        }
        let containerCN = longTable ? `table-body lone-table ${className}` : `table-body ${className}`
        if (allBorder) {
            containerCN += ' all-border'
        }
        if (stripe) {
            containerCN += ' stripe'
        }
        if (!stripe && isHover) {
            containerCN += ' is-hover'
        }
        // let showExpand = false
        // if (expandColumns.length !== 0) {
        //     showExpand = true
        // }
        return (
            <div className={containerCN}>
                <table style={styles} onClick={ this.onTableClick } className={prefixCls}>
                    <thead>
                    <tr>
                        { newColumns.map((elm, i) => {
                            rule.push(elm.key);
                            const style = elm.style || {}
                            if (textCenter) {
                                style.textAlign = 'center'
                            }
                            if (rowHeight) {
                                style.height = rowHeight
                            }
                            return (
                                <th key={`th-${i}`} style={ style || {}}
                                    className={elm.className || ''}
                                    onClick={ (event) => onClickTh(event, elm, i) }>
                                    {elm.title}
                                    {elm.renderHeader && elm.renderHeader('all')}
                                </th>
                            )
                        })
                        }
                    </tr>
                    </thead>
                    <tbody>
                    {
                        dataSource.length !== 0 ? dataSource.map((elm, i) =>
                            <tr key={ `tr-${i}` } style={{ height: rowHeight }}>
                                {
                                    isFunction(elm) ?
                                        elm.call(this, rule.length) :
                                        rule.map((e, index) => <TableCell
                                            key={`tr-${i}-td-${e}`}
                                            content={ elm[e] }
                                            style={{ textAlign: textCenter ? 'center' : 'start' }}
                                            render={ isFunction(newColumns[index].render) ? newColumns[index].render.bind(null, i) : null } />
                                        )
                                }
                            </tr>
                        ) : (<tr>
                            <TableCell className="text-center" colSpan={newColumns.length}
                                style={{ padding: '55px', color: '#999', textAlign: 'center' }} content={'暂无数据'} />
                        </tr>)
                    }
                    </tbody>
                </table>
                <div className={['loading-cover', !!loading && 'active'].join(' ')}>
                    <div className="loading" />
                </div>
            </div>
        )
    }
}

export default Table;
