import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from '../icon';
import { Circle } from './rc-progress';

const statusColorMap = {
    normal: '#E25050',
    exception: '#dc143c',
    success: '#00a854',
};

class ComponentName extends React.PureComponent {
    static propTypes = {
        status: PropTypes.oneOf(['normal', 'exception', 'active', 'success']),
        type: PropTypes.oneOf(['line', 'circle', 'dashboard']),
        showInfo: PropTypes.bool,
        percent: PropTypes.number,
        width: PropTypes.number,
        strokeWidth: PropTypes.number,
        trailColor: PropTypes.string,
        format: PropTypes.func,
        gapDegree: PropTypes.number,
    };
    static defaultProps = {
        type: 'line',
        percent: 0  ,
        showInfo: true,
        trailColor: '#f3f3f3',
        prefixCls: 'ne-progress',
    };
    constructor(props, context) {
        super(props, context);
        this.state = {
            loading: false,
        }
    }
    render() {
        const props = this.props;
        const {
            prefixCls, className, percent = 0, status, format, trailColor, lineColor,
            type, strokeWidth, width, showInfo, gapDegree = 0, gapPosition, ...restProps
        } = props;
        const progressStatus = parseInt(percent.toString(), 10) >= 100 && !('status' in props) ?
            'success' : (status || 'normal');
        let progressInfo;
        let progress;
        const textFormatter = format || (percentNumber => `${percentNumber}%`);
        if (showInfo) {
            let text;
            const iconType = (type === 'circle' || type === 'dashboard') ? '' : '-circled';//bug: ne-icon-ok图标缺失
            if (progressStatus === 'exception') {
                text = format ? textFormatter(percent) : <Icon type={`cancel${iconType}`} />;
            } else if (progressStatus === 'success') {
                text = format ? textFormatter(percent) : <Icon type={`ok${iconType}`} />;
            } else {
                text = textFormatter(percent);
            }
            progressInfo = <span className={`${prefixCls}-text`}>{text}</span>;
        }
        if (type === 'line') {
            const style = {
                width: `${percent}%`,
                height: strokeWidth || 10,
                backgroundColor: lineColor,
            };
            progress = (
                <div>
                    <div className={`${prefixCls}-outer`}>
                        <div className={`${prefixCls}-inner`}>
                            <div className={`${prefixCls}-bg`} style={style} />
                        </div>
                    </div>
                    {progressInfo}
                </div>
            );
        } else if (type === 'circle' || type === 'dashboard') {
            const circleSize = width || 132;
            const circleStyle = {
                width: circleSize,
                height: circleSize,
                fontSize: circleSize * 0.16 + 6,
            };
            const circleWidth = strokeWidth || 6;
            const gapPos = ((gapPosition || type === 'dashboard') && 'bottom') || 'top';
            const gapDeg = (gapDegree || type === 'dashboard') && 75;
            progress = (
                <div className={`${prefixCls}-inner`} style={circleStyle}>
                    <Circle
                        percent={percent}
                        strokeWidth={circleWidth}
                        trailWidth={circleWidth}
                        strokeColor={statusColorMap[progressStatus]}
                        trailColor={trailColor}
                        prefixCls={prefixCls}
                        gapDegree={gapDeg}
                        gapPosition={gapPos} />
                    {progressInfo}
                </div>
            );
        }

        const classString = classNames(prefixCls, {
            [`${prefixCls}-${(type === 'dashboard' && 'circle') || type}`]: true,
            [`${prefixCls}-status-${progressStatus}`]: true,
            [`${prefixCls}-show-info`]: showInfo,
        }, className);

        return (
            <div {...restProps} className={classString}>
                {progress}
            </div>
        );
    }
}
export default ComponentName;
