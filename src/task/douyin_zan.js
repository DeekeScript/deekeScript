
let newTask = {
    log(){
        Log.log(arguments);
        console.log(arguments);
    },
    comment() {
        let tag = UiSelector().id('com.ss.android.ugc.aweme:id/comment_container').isVisibleToUser(true).findOne();
        console.log(tag);
        Gesture.click(tag.bounds().left + Math.random() * tag.bounds().width(), tag.bounds().centerY());
        console.log('打开评论窗口');
        System.sleep(1200);

        let inputTag = UiSelector().className('android.widget.EditText').editable(true).findOne();
        console.log(inputTag);
        Gesture.click(inputTag.bounds().left + Math.random() * inputTag.bounds().width(), inputTag.bounds().centerY());
        console.log('开始输入评论');
        System.sleep(500);

        let iptTag = UiSelector().className('android.widget.EditText').editable(true).findOne();
        console.log(iptTag);
        Log.log(iptTag);
        iptTag.setText('太棒了');
        System.sleep(500);

        let sendTag = UiSelector().id('com.ss.android.ugc.aweme:id/dqq').text('发送').findOne();
        console.log(sendTag);

        Gesture.click(sendTag.bounds().centerX(), sendTag.bounds().centerY());
        System.sleep(500);
        Gesture.back();
        System.sleep(500);
    },

    backHome() {
        console.log('开始返回主页');
        let homeTag;
        let backMaxCount = 5;
        do {
            homeTag = UiSelector().id('com.ss.android.ugc.aweme:id/x_t').isVisibleToUser(true).findOne();
            if (homeTag) {
                console.log('在首页');
            }
            Gesture.back();
            console.log('返回');
            System.sleep(1000);
        } while (!homeTag && --backMaxCount >= 0);
    },

    run() {
        console.log('开始进入应用');
        App.launch('com.ss.android.ugc.aweme');
        System.sleep(2000);
        let zanCount = Storage.getInteger('task_douyin_zan_count');
        let commentCount = Storage.getInteger('task_douyin_zan_comment');

        console.log('配置：' + zanCount + ' 赞，' + commentCount + ' 评论');
        while (zanCount > 0 || commentCount > 0) {
            try {
                console.log('zanCount: ' + zanCount + ' commentCount: ' + commentCount);
                if (--zanCount >= 0) {
                    let tag = UiSelector().id('com.ss.android.ugc.aweme:id/fd9').isVisibleToUser(true).findOne();
                    console.log('点赞tag', tag);
                    Gesture.click(tag.bounds().left + Math.random() * tag.bounds().width(), tag.bounds().centerY());
                    System.sleep(1000);
                    console.log('点赞完成');
                }

                if (--commentCount >= 0) {
                    this.comment();
                    System.sleep(1000);
                }


                let tag = UiSelector().id('com.ss.android.ugc.aweme:id/viewpager').desc('视频').scrollable(true).findOne();
                tag.scrollForward();
                System.sleep(3000);
            } catch (e) {
                console.log(e);
                this.backHome();
            }
        }
    },
}

Log.setFile("douyin_zan.js.log");
newTask.run();
FloatDialogs.show('抖音任务完成');
