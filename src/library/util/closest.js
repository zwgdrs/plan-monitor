/**
 * closest.js
 *
 * @Author: jruif
 * @Date: 2017/7/25 下午3:46
 */

if (window.Element && !Element.prototype.closest) {
    Element.prototype.closest = (s) => {
        let matches = (this.document || this.ownerDocument).querySelectorAll(s),
            i,
            el = this;
        do {
            i = matches.length;
            while (--i >= 0 && matches.item(i) !== el) {
            }
        } while ((i < 0) && (el = el.parentElement));
        return el;
    };
}
