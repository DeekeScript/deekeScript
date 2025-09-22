let e = {
    log() {
        Log.log(arguments), console.log(arguments);
    },
    comment() {
        var e = UiSelector().id("com.ss.android.ugc.aweme:id/comment_container").isVisibleToUser(!0).findOne(), e = (console.log(e), 
        Gesture.click(e.bounds().left + Math.random() * e.bounds().width(), e.bounds().centerY()), 
        console.log("打开评论窗口"), System.sleep(1200), UiSelector().className("android.widget.EditText").editable(!0).findOne()), e = (console.log(e), 
        Gesture.click(e.bounds().left + Math.random() * e.bounds().width(), e.bounds().centerY()), 
        console.log("开始输入评论"), System.sleep(500), UiSelector().className("android.widget.EditText").editable(!0).findOne()), e = (console.log(e), 
        Log.log(e), e.setText("太棒了"), System.sleep(500), UiSelector().id("com.ss.android.ugc.aweme:id/dqq").text("发送").findOne());
        console.log(e), Gesture.click(e.bounds().centerX(), e.bounds().centerY()), 
        System.sleep(500), Gesture.back(), System.sleep(500);
    },
    backHome() {
        var e;
        console.log("开始返回主页");
        let o = 5;
        for (;(e = UiSelector().id("com.ss.android.ugc.aweme:id/x_t").isVisibleToUser(!0).findOne()) && console.log("在首页"), 
        Gesture.back(), console.log("返回"), System.sleep(1e3), !e && 0 <= --o; );
    },
    run() {
        console.log("开始进入应用"), App.launch("com.ss.android.ugc.aweme"), System.sleep(2e3);
        let e = Storage.getInteger("task_douyin_zan_count"), o = Storage.getInteger("task_douyin_zan_comment");
        for (console.log("配置：" + e + " 赞，" + o + " 评论"); 0 < e || 0 < o; ) try {
            var s;
            console.log("zanCount: " + e + " commentCount: " + o), 0 <= --e && (s = UiSelector().id("com.ss.android.ugc.aweme:id/fd9").isVisibleToUser(!0).findOne(), 
            console.log("点赞tag", s), Gesture.click(s.bounds().left + Math.random() * s.bounds().width(), s.bounds().centerY()), 
            System.sleep(1e3), console.log("点赞完成")), 0 <= --o && (this.comment(), 
            System.sleep(1e3)), UiSelector().id("com.ss.android.ugc.aweme:id/viewpager").desc("视频").scrollable(!0).findOne().scrollForward(), 
            System.sleep(3e3);
        } catch (e) {
            console.log(e), this.backHome();
        }
    }
};

Log.setFile("douyin_zan.js.log"), e.run(), FloatDialogs.show("抖音任务完成");