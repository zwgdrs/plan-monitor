网易号 - 媒体开放平台
=================

:star2: :zap: :smile: :zap: :star2:

设置*上传*配置`./config/custom.json`,没有这个文件，就自己新建一个，格式如下：
```json
{
    "cdn":{
        "host":"61.135.251.132",
        "port":"16321",
        "user":"your_name",
        "password":"your_passw",
        "path": "//img5.cache.netease.com/utf8/mp/"
    },
    "f2e": {
        "name": "your_name",
        "host": "f2e-vps",
        "port": 16322,
        "path": "//f2e.developer.163.com/your_name/mp/"
    }
}
```
使用直接的用户名和密码,注意替换所有的`your_name`字段。


上传命令：
```bash
// 上传F2E
npm run f2e
// 上传cdn
npm run cdn
```

仅用来打包：
```bash
npm run build
```