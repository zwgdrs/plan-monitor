import React from 'react';
import PropTypes from 'prop-types';
import {Button} from '../../library';
import cssRules from '../util/operateCssRule';
import './carousel.scss'

class Carousel extends React.PureComponent {

    /***
     * params:
     *  type: 轮播图切换类型。
     *  dots: 底部显示跳转点的类型：目前存在 dots(点) smallImg(缩略图片) 若为空则不显示。
     *  time: number类型，划过一张幻灯片的时间。
     *
     * */
    static propTypes = {
        imgWidth: PropTypes.number,
        imgHeight: PropTypes.number,
        dots: PropTypes.string,
        time: PropTypes.number,
        interval: PropTypes.number,
        arrow: PropTypes.bool,
        autoPlay: PropTypes.bool,
    }

    static defaultProps = {
        time: 500,
        interval: 3000,
        dots: 'dots',
        arrow: true,
        autoPlay: false,
        onClick: (obj) => {console.log(obj)},
    }

    constructor(props) {
        super(props);
        this.index = 1
        this.animated = false
        this.state = {
            activeIndex: 1, // 当前显示的图片
        }
        this.animate = this.animate.bind(this)
        this.play = this.play.bind(this)
        this.stop = this.stop.bind(this)
    }


    componentDidMount() {
        const {dots, imgWidth, arrow, autoPlay} = this.props
        const self = this
        const dotsList = dots && this.dots.getElementsByClassName('dot-btn')
        const list = document.getElementsByClassName('img-list')

        if (arrow) {
            const next = document.getElementById('next')
            const prev = document.getElementById('prev')
            next.onclick = () => {
                // 图片正在移动，则返回
                if (self.animated) {
                    return
                }
                // 图片目前已经到最后一张,则移动到第一张
                if (self.state.activeIndex === self.state.len) {
                    this.setState({
                        activeIndex: 1,
                    })
                } else {
                    // 否则当前图片id加1，得到下一张显示的图片id
                    self.setState({
                        activeIndex: self.state.activeIndex + 1,
                    })
                }
                // 开始移动
                self.animate(-imgWidth);
            }
            prev.onclick = () => {
                if (self.animated) {
                    return
                }
                if (self.state.activeIndex === 1) {
                    self.setState({
                        activeIndex: self.state.len,
                    })
                } else {
                    self.setState({
                        activeIndex: self.state.activeIndex - 1,
                    })
                }
                self.animate(imgWidth);
            }
        }
        if (dots) {
            for (var i = 0; i < dotsList.length; i++) {
                dotsList[i].addEventListener('click', (e) => {
                    if (this.animated) {
                        return
                    }
                    this.myIndex = parseInt(e.toElement.dataset.index, 10) // 得到需要移动到的位置
                    const offset = -imgWidth * (this.myIndex - this.state.activeIndex) // 判断出需要偏移的位移量

                    this.animate(offset) // 去移动
                    this.setState({
                        activeIndex: this.myIndex,
                    })
                }, false)
            }
        }
        this.setState({
            autoPlay,
        }, () => {
            this.state.len !== 0 && this.state.len !== 1 && this.state.autoPlay && this.play()
        })

    }

    componentWillReceiveProps() {
        const {imgList = []} = this.props
        // console.log()
        this.setState({
            len: imgList.length,
        })
    }
    componentWillUnmount() {
        if (this.props.autoplay) {
            this.setState({
                autoPlay: false,
            })
            this.stop()
        }

    }

    animate(offset) {
        const self = this
        const {imgList, imgWidth, time} = this.props
        const list = document.getElementsByClassName('img-list')
        if (offset === 0 || !list.length) {
            return;
        }
        self.animated = true
        const len = imgList.length

        let left = parseInt(list[0].style.left, 10) + offset // 目标位置，当前位移加上偏移量
        const speed = offset / (time / 10)
        const go = function() {
            let leftPosition = list[0].style.left
            if ((speed > 0 && parseInt(leftPosition, 10) < left) || (speed < 0 && parseInt(leftPosition, 10) > left)) {
                const distance = left - parseInt(leftPosition, 10)
                if (Math.abs(distance) < Math.abs(speed)) {
                    list[0].style.left = parseInt(leftPosition, 10) + distance + 'px';
                    if (left < (-imgWidth * len)) {
                        list[0].style.left = `-${imgWidth}px`;
                    } else if (left === 0) {
                        list[0].style.left = `-${len * imgWidth}px`
                    }
                    self.animated = false;
                } else {
                    list[0].style.left = parseInt(leftPosition, 10) + speed + 'px';
                    setTimeout(go, 10);
                }
            }
        }
        go();
    }

    play() {
        const next = document.getElementById('next')
        const {interval = 3000} = this.props
        this.timer = setTimeout(() => {
            next && next.onclick();
            this.play();
        }, interval);
    }

    stop() {
        clearTimeout(this.timer);
    }

    render() {
        const {imgList, dots, imgWidth, imgHeight, arrow, onClick} = this.props
        const imgLen = imgList.length
        return (
            <div className="carousel">
                <div className="container" style={{height: `${imgHeight}px`, width: `${imgWidth}px`}}>
                    <ul className="img-list"
                        style={{left: -imgWidth + 'px', width: `${(imgLen + 2) * imgWidth}px`, height: imgHeight}}>
                        {imgLen && <li className="img-li" onClick={() => onClick(imgList[imgLen - 1])}><img src={imgList[imgLen - 1].img} alt={imgList[imgLen - 1].alt} style={{height: `${imgHeight}px`, width: `${imgWidth}px`}}/></li>}
                        {
                            imgLen && imgList.map((item, index) => {
                                const currentIndex = index + 1
                                return (
                                    <li className="img-li" key={currentIndex} onClick={() => onClick(item)}><img src={item.img} alt={item.alt} style={{height: `${imgHeight}px`, width: `${imgWidth}px`}}/></li>
                                )
                            })
                        }
                        {imgLen && <li className="img-li" onClick={() => onClick(imgLen[0])}><img src={imgList[0].img} alt={imgList[0].alt} style={{height: `${imgHeight}px`, width: `${imgWidth}px`}}/></li>}
                    </ul>
                    {arrow && <a className="left-arrow" id="prev"><Button icon="left-arrow" size="small"/></a>}
                    {
                        dots === 'dots' ?
                            <div className="dots" ref={e => this.dots = e}>
                                <div className="inner">
                                    <div className="dots-list">
                                        {imgList.map((item, index) => {
                                            const currentIndex = index + 1
                                            const className = this.state.activeIndex === currentIndex ? 'on dot-item dot-btn' : 'dot-item dot-btn'
                                            return (<span key={currentIndex} data-index={currentIndex} className={className}></span>)
                                        })}
                                    </div>
                                </div>
                            </div> : null
                    }
                    {
                        dots === 'smallImg' ?
                            <div className="smallImg" ref={e => this.dots = e} style={{width: `${imgWidth}px`}}>
                                <div className="inner">
                                    <div className="img-list">
                                        {imgList.map((item, index) => {
                                            const currentIndex = index + 1
                                            const className = this.state.activeIndex === currentIndex ? 'on smallImg-item dot-btn' : 'smallImg-item dot-btn'
                                            return (
                                                <img key={currentIndex} src={item.img} data-index={currentIndex} className={className} alt="缩略图"/>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div> : null
                    }
                    {arrow && <a className="right-arrow" id="next"><Button icon="right-arrow" size="small"/></a>}
                </div>
            </div>
        )
    }
}

export default Carousel;