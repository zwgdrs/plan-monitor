const enhancer = WrappedComponent => class Progress extends WrappedComponent {
    componentDidUpdate() {
        if (!this.path) {
            return;
        }
        const pathStyle = this.path.style;
        pathStyle.transitionDuration = '0.3s, 0.3s';
        const now = Date.now();
        if (this.prevTimeStamp && now - this.prevTimeStamp < 100) {
            pathStyle.transitionDuration = '0s, 0s';
        }
        this.prevTimeStamp = Date.now();
    }

    render() {
        return super.render();
    }
};

export default enhancer;
