/**
 * Pagination.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/14 上午11:44
 */

import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '../button';
import Input from '../input';

class Pagination extends React.PureComponent {
    static propTypes = {
        total: PropTypes.number, // 数据总数
        totalPage: PropTypes.number, //页数总数
        pageSize: PropTypes.number,
        current: PropTypes.number,
        pageSizeOptions: PropTypes.array, //[10, 20, 40]
        showQuickJump: PropTypes.bool,
        showPer: PropTypes.bool,
        showTotal: PropTypes.bool,
        showSelectPageSize: PropTypes.bool,
        onChange: PropTypes.func,
        onChangePage: PropTypes.func,
        onChangePageSize: PropTypes.func,
        className: PropTypes.string,
        scrollToTop: PropTypes.bool, //是否跳到页面顶部
    };

    static defaultProps = {
        total: 0,
        totalPage: 0,
        pageSize: 10,
        current: 1,
        showQuickJump: false,
        showTotal: false,
        showSelectPageSize: false,
        prefixCls: 'ne-pagination',
        scrollToTop: true,
    };

    constructor(props, context) {
        super(props, context);

        this.state = {
            current: props.current,
            inputPage: 0,
        };
    }

    componentWillReceiveProps(nextProps) {
        if ('current' in nextProps) {
            this.setState({
                current: nextProps.current,
            });
        }

        if ('pageSize' in nextProps) {
            const newState = {};
            let current = this.state.current;
            const newCurrent = this.calcPage(nextProps.pageSize);
            current = current > newCurrent ? newCurrent : current;
            if (!('current' in nextProps)) {
                newState.current = current;
            }
            newState.pageSize = nextProps.pageSize;
            newState.totalPage = nextProps.totalPage;
            this.setState(newState);
        }
    }

    onSelectPageSize = (e) => {
        let { onChangePageSize } = this.props;
        let target = e.target;
        if (onChangePageSize) onChangePageSize(target.value);
    };

    onInputPage = (e) => {
        let { onChangePage } = this.props;
        let target = e.target;
        let value = Number(target.value);
        this.setState({
            inputPage: value < 0 ? 0 : value,
        });
        if (onChangePage) onChangePage(target.value);
    };

    quickJumpPage = () => {
        const { total, pageSize, totalPage } = this.props;
        let _totalPage = totalPage || Math.ceil(total / pageSize);
        if (this.state.inputPage > 0 && this.state.inputPage <= _totalPage) {
            this.jumpPage(this.state.inputPage);
        }
    };

    jumpPage = (next) => {
        let { onChange, scrollToTop } = this.props;
        // setTimeout(() => {
        //     this.setState({
        //         current: next,
        //     });
        // }, 150);
        this.setState({
            current: next,
        });
        if (onChange) onChange(next);
        // todo: 待优化适配
        scrollToTop && window.scrollTo(0,0)
    };

    prev = () => {
        if (this.hasPrev()) {
            this.jumpPage(this.state.current - 1);
        }
    };

    next = () => {
        if (this.hasNext()) {
            this.jumpPage(this.state.current + 1);
        }
    };

    hasPrev = () => {
        return this.state.current > 1;
    };

    hasNext = () => {
        return this.state.current < this.calcPage();
    };

    calcPage = (p) => {
        let _pageSize = p;
        let { total, totalPage, pageSize } = this.props;
        let _totalPage = 0;
        // 有默认值
        if (_pageSize === void 0) {
            _pageSize = pageSize;
        }
        if (totalPage === 0) {
            if (total !== 0) {
                _totalPage = Math.ceil(total / _pageSize);
            }
        } else {
            _totalPage = totalPage;
        }
        return _totalPage;
    };

    render() {

        let { total, totalPage, pageSize, showTotal, showQuickJump, showSelectPageSize, prefixCls } = this.props;
        let elementPage = [];

        totalPage = Number(totalPage);
        total = Number(total);
        pageSize = Number(pageSize);

        let current = this.state.current;

        if (totalPage === 0 && total === 0) {
            return null;
        } else if (total !== 0) { //默认值为0
            totalPage = Math.ceil(total / pageSize);
        }
        if (totalPage < 9) {
            for (let i = 0; i < totalPage; i++) {
                elementPage.push(
                    <li key={ `page-${i}` }>
                        <Button onClick={this.jumpPage.bind(this, i + 1)} size="small"
                            type={(i + 1) === current ? 'primary' : 'secondary'}>{i + 1}</Button>
                    </li>
                )
            }
        } else {
            let left = Math.max(1, current - 2);
            let right = Math.min(current + 2, totalPage);
            if (current - 1 <= 2) {
                right = 1 + 4;
            }

            if (totalPage - current <= 2) {
                left = totalPage - 4;
            }

            for (let i = left; i <= right; i++) {
                elementPage.push(
                    <li key={ `page-${i}` }>
                        <Button onClick={this.jumpPage.bind(this, i)} size="small"
                            type={i === current ? 'primary' : 'secondary'}>{i}</Button>
                    </li>
                );
            }
            if (current - 1 >= 4) {
                elementPage.unshift(<li className="ellipsis" key="ellipsis-1" />);
            }
            if (totalPage - current >= 4) {
                elementPage.push(<li className="ellipsis" key="ellipsis-2" />);
            }
            if (left !== 1) {
                elementPage.unshift(
                    <li key={ `page-first` }>
                        <Button size="small" onClick={this.jumpPage.bind(this, 1)}
                            type={1 === current ? 'primary' : 'secondary'}>1</Button>
                    </li>
                );
            }
            if (right !== totalPage) {
                elementPage.push(
                    <li key={ `page-last` }>
                        <Button onClick={this.jumpPage.bind(this, totalPage)} size="small"
                            type={totalPage === current ? 'primary' : 'secondary'}>{totalPage}</Button>
                    </li>
                )
            }
        }

        let classes = classNames(prefixCls);

        return (
            <ul className={classes} ref="pagination">
                <li className="pagination-previous">
                    <Button onClick={this.prev} disabled={!this.hasPrev()}>上一页</Button>
                </li>
                { elementPage }
                <li className="pagination-next">
                    <Button onClick={this.next} disabled={!this.hasNext()}>下一页</Button>
                </li>
                {
                    showSelectPageSize && (
                        <li>每页 <select className="" defaultValue={pageSize} onChange={this.onSelectPageSize}>{
                            [10, 20, 50, 100].map(val => <option key={`pageSize-opt-${val}`} value={val}>{val}</option>)
                        }</select> 条
                        </li>)
                }
                { !!total && showTotal && <li><span>共 {total} 条</span></li> }
                {
                    showQuickJump &&
                    <li className="pagination-quick">第 <Input type="number" onChange={this.onInputPage} value={this.state.inputPage} /> 页 <Button
                        onClick={this.quickJumpPage}>跳转</Button></li>
                }
            </ul>
        )
    }
}

export default Pagination;
