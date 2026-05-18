let dyApp = require("./dyApp");

let tag = UiSelector().id('name').findOne();

// console.log(tag.click());
let config = {
    toker_view_video_keywords: Storage.get('toker_view_video_keywords'),
    toker_view_video_second: Storage.getInteger('toker_view_video_second'),
    toker_run_sex: Storage.getArray('toker_run_sex'),
}

console.log(config, dyApp.getName());//获取json文件中的配置参数

FloatDialogs.show('提示', '请编写业务代码');
