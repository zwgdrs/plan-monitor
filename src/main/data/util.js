import {Modal} from '../../library'

function paging(pageSize, pageNo, realLen) {
    const pageStart = (pageNo - 1) * pageSize
    let pageEnd = pageNo * pageSize
    pageEnd = pageEnd <= realLen ? pageEnd : realLen
    return {pageStart, pageEnd}
}

const openConfirm = () => {
    let confirm = Modal.confirm({
        title: false,
        content: '数据为空!',

        onOk: () => {
            return new Promise((resolve, reject) => {
                let rs = Math.random() > 0.5;
                console.log(rs);
                setTimeout(() => rs ? reject() : resolve(), 2000);
            }).catch(() => {
                confirm.close();
            });
        },
    });
};

function log() {
    console.log(1)
}
export {
    openConfirm,
    paging,
    log,
}