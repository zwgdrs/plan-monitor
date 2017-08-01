// state代码:
//     '草稿': 0
//     '审核中': 1
//     '未通过': 2
//     '已发布': 3
//     '处理失败': 4
//     '管理员下线': 5
//     '已下线': 6
//     '待发布': 7
// type代码:
//     文章：1
//     视频：2
//     图集：3
export default function getContentUrl(
    state,
    type,
    articleId,
    skipId,
    skipTopicId,
) {
    const articleOutPage = `//c.m.163.com/news/a/${articleId}.html?spss=newsapp&spsw=1`;
    const articlePcPage = `//dy.163.com/v2/article/detail/${articleId}.html`;
    const galleryOutPage =`http://c.m.163.com/news/p/0503/${skipId}.html?spss=newsapp&spsw=1`;
    const videoPcPage = `http://v.163.com/paike/${skipTopicId}/${skipId}.html`;
    const urlMap = {
        0: {},
        1: {},
        2: {
            1: articleOutPage,
            3: galleryOutPage,
        },
        3: {
            1: articlePcPage,
            2: videoPcPage,
            3: galleryOutPage,
        },
        4: {},
        5: {},
        6: {
            1: articleOutPage,
            3: galleryOutPage,
        },
        7: {
            1: articleOutPage,
            3: galleryOutPage,
        },
    };
    return urlMap[state] ? urlMap[state][type] : 'unknown url';
}
