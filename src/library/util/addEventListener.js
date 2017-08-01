/**
 * addEventListener.js
 *
 *
 *
 * @Author: jruif
 * @Date: 2017/7/7 下午10:52
 */

// var addEventListener = require('add-dom-event-listener');
// var handler = addEventListener(document.body, 'click', function(e){
//     console.log(e.target); // works for ie
//
//     console.log(e.nativeEvent); // native dom event
// });
// handler.remove(); // detach event listener

import addDOMEventListener from 'add-dom-event-listener';
import ReactDOM from 'react-dom';

const addEventListener = (target, eventType, cb) => {
    /* eslint camelcase: 2 */
    const callback = ReactDOM.unstable_batchedUpdates ? function run(e) {
        ReactDOM.unstable_batchedUpdates(cb, e);
    } : cb;
    return addDOMEventListener(target, eventType, callback);
};

export default addEventListener;
