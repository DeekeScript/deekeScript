let e = require("./dyApp"), o = UiSelector().id("name").findOne(), r = {
    toker_view_video_keywords: Storage.get("toker_view_video_keywords"),
    toker_view_video_second: Storage.getInteger("toker_view_video_second"),
    toker_run_sex: Storage.getArray("toker_run_sex")
};

console.log(r, e.getName()), FloatDialogs.show("提示", "请编写业务代码");