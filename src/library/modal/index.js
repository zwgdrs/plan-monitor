/**
 * index.js
 *
 * @Author: jruif
 * @Date: 2017/7/10 下午10:52
 */

import Modal from './Modal';
import ModalHeader from './ModalHeader';
import ModalFooter from './ModalFooter';
import ModalContent from './ModalContent';
import Confirm from './Confirm';
import extend from 'object-assign';
/*
 * 可以通过 Modal.Footer 来调用，例如：
 * <Modal.Footer>
 *     <Button>确定</Button>
 * </Modal.Footer>
 * */
Modal.Header = ModalHeader;
Modal.Content = ModalContent;
Modal.Footer = ModalFooter;

Modal.info = (config) => {
    return Confirm(extend({
        type: 'info',
        iconType: 'attention',
        title: '提示',
        content: '',
    }, config));
};

Modal.success = (config) => {
    return Confirm(extend({
        type: 'success',
        iconType: 'ok-o',
        title: '已成功',
        content: '',
    }, config));
};

Modal.error = (config) => {
    return Confirm(extend({
        type: 'error',
        iconType: 'cancel-o',
        title: '发生错误',
        content: '',
        onOk: config.onClose,
    }, config));
};

Modal.warning = (config) => {
    return Confirm(extend({
        type: 'warning',
        iconType: 'warn',
        title: '警告',
        content: '',
    }, config));
};

Modal.confirm = (config) => {
    return Confirm(extend({
        type: 'warning',
        iconType: 'warn',
        title: '请确认',
        content: '',
        onCancel(){
        },
    }, config));
};

export default Modal;
