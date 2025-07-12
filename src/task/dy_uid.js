let Common = require('../util/dy/Common');
let machine = require('../common/machine');
let dy = {
    getAvatar() {
        return UiSelector().descContains('用户头像').isVisibleToUser(true).findOne();
    },

    getGender() {
        if (UiSelector().className('android.widget.TextView').desc('女').isVisibleToUser(true).findOne()) {
            return '0';
        }

        if (UiSelector().className('android.widget.TextView').desc('男').isVisibleToUser(true).findOne()) {
            return '1';
        }

        return '2';
    },

    intoUserVideo() {
        let videoCountTag = UiSelector().descContains('作品').isVisibleToUser(true).findOnce();
        if (!videoCountTag) {
            Log.log('没有作品');
            return false;
        }

        let containerTag = Common.id('container').isVisibleToUser(true).findOne();
        if (!containerTag) {
            Log.log('没有containerTag');
            return false;
        }

        Common.click(containerTag, 0.3);
        Log.log('进入视频');
        Common.sleep(3000 + 3000 * Math.random());
        //检查是否进入了视频
        if (this.getAvatar()) {
            Log.log('没有进入视频');
            return false;
        }

        Log.log('已进入视频');
        return true;
    },

    likeVideo() {
        let likeTag = UiSelector().descContains('点赞').isVisibleToUser(true).findOne();
        if (!likeTag) {
            Log.log('没有找到点赞按钮');
            return false;
        }

        if (likeTag.desc().includes('未点赞')) {
            Common.click(likeTag, 0.3);
            Log.log('点赞了', likeTag.bounds());
        }

        Log.log('历史点赞过了');
        return true;
    },

    commentVideo(msg) {
        let CommentCountTag = UiSelector().descContains('评论').className('android.widget.ImageView').isVisibleToUser(true).findOne();
        if (!CommentCountTag) {
            Log.log('没有找到评论按钮');
            return false;
        }

        let count = Common.numDeal(CommentCountTag.desc());
        if (count > 0) {
            Log.log('评论数大于0');
            Common.click(CommentCountTag, 0.2);
            Common.sleep(2000 + 1000 * Math.random());
            let iptTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).filter(v => {
                return v.isEditable();
            }).findOne();
            if (!iptTag) {
                Log.log('没有找到输入框');
                return false;
            }
            Common.click(iptTag, 0.2);
            Common.sleep(1000 + 1000 * Math.random());
        } else {
            Common.click(CommentCountTag, 0.2);
            Common.sleep(2000 + 1000 * Math.random());
        }

        let iptTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).filter(v => {
            // @ts-ignore
            return v.isEditable() && v.isFocused();
        }).findOne();
        if (!iptTag) {
            Log.log('没有找到输入框');
            return false;
        }
        iptTag.setText(msg);
        Common.sleep(1000 + 1000 * Math.random());

        // @ts-ignore
        let btnTag = UiSelector().className('android.widget.TextView').text('发送').isVisibleToUser(true).filter(v => {
            // @ts-ignore
            return v.text() == '发送' && v.parent().clickable();
        }).findOne();
        if (!btnTag) {
            Log.log('没有找到发送按钮');
            return false;
        }
        Common.click(btnTag, 0.2);
        Common.sleep(1000 + 1000 * Math.random());
        Log.log('评论成功', msg);
        return true;
    },

    followUser() {
        let focusTag = UiSelector().className('android.widget.TextView').textContains('关注').filter(v => {
            // @ts-ignore
            return v.hintText() == '按钮';
        }).isVisibleToUser(true).findOnce();

        if (!focusTag) {
            Log.log('没有找到关注按钮');
            return false;
        }

        if (focusTag.text() == '已关注' || focusTag.text() == '互相关注') {
            Log.log('已关注', focusTag.text());
            return false;
        }

        Common.click(focusTag, 0.2);
        Log.log('关注成功');
        return true;
    },

    privateMsg(msg) {
        let moreTag = UiSelector().descContains('更多').filter(v => {
            // @ts-ignore
            return v.hintText() == '按钮';
        }).isVisibleToUser(true).findOne();
        if (!moreTag) {
            Log.log('没有更多按钮');
            return false;
        }
        Common.click(moreTag, 0.2);
        Common.sleep(1000 + 1000 * Math.random());

        let sendMsgTag = UiSelector().className('android.widget.TextView').textContains('发私信').filter(v => {
            return v.bounds().top > Device.height() / 2;
        }).isVisibleToUser(true).findOne();
        if (!sendMsgTag) {
            Log.log("没有找到发送私信按钮");
            return false;
        }

        Common.click(sendMsgTag, 0.2);
        Common.sleep(1000 + 1000 * Math.random());

        let iptTag = UiSelector().className('android.widget.EditText').text('发送消息').filter(v => {
            return v.isEditable();
        }).isVisibleToUser(true).findOne();
        if (!iptTag) {
            Log.log("没有找到发送私信输入框");
            return false;
        }

        Common.click(iptTag, 0.2);
        Common.sleep(1000 + 1000 * Math.random());

        iptTag = UiSelector().className('android.widget.EditText').text('发送消息').filter(v => {
            // @ts-ignore
            return v.isEditable() && v.isFocused();
        }).isVisibleToUser(true).findOne();
        if (!iptTag) {
            Log.log('没有找到点击后的输入框');
            return true;
        }

        iptTag.setText(msg);
        Common.sleep(1000 + 1000 * Math.random());
        let btnTag = UiSelector().className('android.widget.ImageView').text('发送').clickable(true).isVisibleToUser(true).findOne();
        if (!btnTag) {
            Log.log('没有找到发送按钮');
            return false;
        }
        Common.click(btnTag, 0.25);
        Log.log('消息已发送', msg);
        return true;
    }
}

let task = {
    getMsg(type) {
        return machine.getMsg(type) || false;//永远不会结束
    },

    getConfig() {
        return {
            uids: Storage.getString('dy_uid'),
            type: Storage.getArray('toker_dy_type'),//0点赞首作品、1评论首作品、2关注、3私信
            gender: Storage.getArray('toker_dy_sex'),
            second: Storage.getInteger('toker_dy_second'),
        }
    },

    run() {
        let config = task.getConfig();
        Log.log('配置', config);

        let uids = config.uids.split("\n");
        for (let uid of uids) {
            if (Storage.getBoolean('dy_uid_' + uid)) {
                Log.log('uid存在', uid);
                App.gotoIntent('snssdk1128://user/profile/' + uid);
                Common.sleep(4000 + 2000 * Math.random());

                //看看是否存在用户，不存在则下一个
                let avatarTag = dy.getAvatar();
                if (!avatarTag) {
                    Log.log('用户不存在', uid);
                    continue;
                }

                let gender = dy.getGender();
                if (config.gender.contains(gender)) {
                    Log.log('性别不匹配');
                    continue;
                }

                if ((config.type.contains("0") || config.type.contains("1")) && dy.intoUserVideo()) {
                    if (config.type.contains("0")) {
                        dy.likeVideo();
                    }

                    if (config.type.contains("1")) {
                        dy.commentVideo(task.getMsg(0));
                        Common.back();//返回到主页
                        Log.log('评论返回到视频');
                    }

                    Common.back();//返回到主页
                    Log.log('返回到用户主页');
                    if (dy.getAvatar()) {
                        Log.log('没有返回回来，再操作一次');
                        Common.sleep(1000);
                        Common.back();
                    }
                }

                if (config.type.contains("2")) {
                    dy.followUser();
                }

                if (config.type.contains("3")) {
                    dy.privateMsg(task.getMsg(1));
                }

                Common.backHomeOnly();
                Common.sleep(config.second / 2 * 1000 + config.second / 2 * 1000 * Math.random());
            }
        }
    }
}


while (true) {
    Common.openApp();
    try {
        task.run();
    } catch (e) {
        Log.log('出错了', e);
    }
}
