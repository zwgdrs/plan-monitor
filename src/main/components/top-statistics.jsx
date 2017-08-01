/**
 * top-statistics.jsx
 *
 * @Author: jruif
 * @Date: 2017/7/16 上午2:12
 */

import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { isNumber } from '../../util/isType';
import action from '../../redux-modules/action';
import ajax from '../../util/ajax';

const formatNumber = (number) => {
    return isNumber(number) ? number > -1 ? (
        number > 1000000 ? (number / 10000).toFixed(2) + ' 万' : number + ''
    ).replace(/(\d{1,3})(?=(\d{3})+(?:$|\D))/g, '$1, ') : '-' : number;
};

class TopStatistics extends React.PureComponent {
    static propTypes = {
        stone: PropTypes.object,
        user: PropTypes.object,
        url: PropTypes.string,
        showTitle: PropTypes.array,
    };

    static defaultProps = {
        url: '/general.json',
        showTitle: [{
            name: '总订阅数',
            key: 'sumSubs',
        }, {
            name: '总阅读数',
            key: 'mediaTotalPv',
        }, {
            name: '昨日阅读数',
            key: 'pvsIncr',
        }, {
            name: '网易号指数',
            key: 'incr',
        }],
    };

    componentDidMount() {
        this.getDataFromAjax();
    }

    getDataFromAjax() {
        const { updateOverview, url } = this.props;
        ajax(url, rs => {
            updateOverview('overview', rs.data);
        });
    }

    render() {
        let { stone, showTitle, user } = this.props;
        // local: 0-订阅号；1-本地号；2-政务号；3-直播号；5-企业号
        let isCompany = +user.local === 5;
        return (
            <div className={classnames("top-statistics",{
                company: isCompany,
            })}>
                {
                    !isCompany && showTitle.map(item => (
                        <dl key={'statistics-' + item.key}>
                            <dt>{item.name}</dt>
                            <dd>{formatNumber(stone[item.key]) || '-'}</dd>
                        </dl>
                    ))
                }
            </div>
        )
    }
}

export default connect(
    state => ({
        stone: state.statistics.overview,
        user: state.common.user,
    }),
    dispatch => bindActionCreators({
        updateOverview: action.updateStatistics,
    }, dispatch),
)(TopStatistics);