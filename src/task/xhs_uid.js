let Common = require('../util/xhs/Common');
let machine = require('../common/machine');
let xhs = {
    getAvatar() {
        return UiSelector().descContains('头像').isVisibleToUser(true).findOne();
    },

    intoWork() {
        let nicknameTag = UiSelector().desc('作者').isVisibleToUser(true).findOne();
        return nicknameTag.bounds().top < Device.height() / 3;
    },

    intoVideo() {
        let nicknameTag = UiSelector().desc('作者').isVisibleToUser(true).findOne();
        return nicknameTag.bounds().top < Device.height() / 2;
    },

    getGender() {
        if (UiSelector().className('android.widget.LinearLayout').desc('女').isVisibleToUser(true).findOne()) {
            return '0';
        }

        if (UiSelector().className('android.widget.LinearLayout').desc('男').isVisibleToUser(true).findOne()) {
            return '1';
        }

        return '2';
    },

    intoUserVideo() {
        let videoCountTag = UiSelector().className('android.view.ViewGroup').descContains('笔记').isVisibleToUser(true).findOnce();
        if (!videoCountTag) {
            Log.log('没有笔记');
            return false;
        }

        if (videoCountTag.desc().includes('已选定')) {
            Common.click(videoCountTag, 0.2);
            Common.sleep(1000 + 1000 * Math.random());
            Log.log('点击笔记');
        }

        let containerTag = UiSelector().className('android.widget.FrameLayout').filter(v => {
            return v.desc() && v.desc().includes('笔记') || v.desc().includes('视频');
        }).isVisibleToUser(true).findOne();

        if (!containerTag) {
            Log.log('没有笔记或者视频');
            return false;
        }

        let type = containerTag.desc().includes('笔记') ? 0 : 1;
        Common.click(containerTag, 0.3);
        Log.log('进入' + ['笔记', '视频'][type]);
        Common.sleep(3000 + 3000 * Math.random());
        //检查是否进入了视频
        if (type == 0 && !this.intoWork()) {
            Log.log('没有进入视频');
            return false;
        }

        if (type == 1 && !this.intoVideo()) {
            Log.log('没有进入视频');
            return false;
        }

        Log.log('已进入作品');
        return type;
    },

    likeVideo(type) {
        let likeTag = UiSelector().descContains('点赞').isVisibleToUser(true).findOne();
        if (!likeTag) {
            Log.log('没有找到点赞按钮');
            return false;
        }

        if (!likeTag.isSelected()) {
            Common.click(likeTag, 0.3);
            Log.log('点赞了', likeTag.bounds());
        }

        Log.log('历史点赞过了');
        return true;
    },

    commentVideo(msg, type) {
        let CommentCountTag = UiSelector().descContains('评论').className('android.widget.Button').isVisibleToUser(true).findOne();
        if (!CommentCountTag) {
            Log.log('没有找到评论按钮');
            return false;
        }

        let count = Common.numDeal(CommentCountTag.desc());
        Common.click(CommentCountTag, 0.2);
        Common.sleep(2000 + 1000 * Math.random());

        if (type == 1) {
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
        } else {
            if (count > 1) {
                Common.click(CommentCountTag, 0.2);
                Common.sleep(2000 + 1000 * Math.random());
            }
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
        let focusTag = UiSelector().className('android.widget.Button').textContains('关注').isVisibleToUser(true).findOnce();
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
        let sendMsg = UiSelector().className('android.widget.TextView').descContains('私信').isVisibleToUser(true).findOne() || UiSelector().className('android.widget.TextView').descContains('发消息').isVisibleToUser(true).findOne();
        if (!sendMsg) {
            Log.log('没有私信或者发消息按钮');
            return false;
        }

        Common.click(sendMsg, 0.2);
        Common.sleep(2000 + 2000 * Math.random());

        let iptTag = UiSelector().className('android.widget.EditText').text('发消息').filter(v => {
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
        let btnTag = UiSelector().className('android.widget.ImageView').text('发送').filter(v => {
            return v.bounds().top + v.bounds().height() > iptTag.bounds().top;
        }).clickable(true).isVisibleToUser(true).findOne();
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
            uids: Storage.getString('xhs_uid'),
            type: Storage.getArray('toker_xhs_type'),//0点赞首作品、1评论首作品、2关注、3私信
            gender: Storage.getArray('toker_xhs_sex'),
            second: Storage.getInteger('toker_xhs_second'),
        }
    },

    run() {
        let config = task.getConfig();
        Log.log('配置', config);

        let uids = config.uids.split("\n");
        for (let uid of uids) {
            if (Storage.getBoolean('xhs_uid_' + uid)) {
                Log.log('uid存在', uid);
                App.gotoIntent('xhsdiscover://user/' + uid);
                Common.sleep(4000 + 2000 * Math.random());

                //看看是否存在用户，不存在则下一个
                let avatarTag = xhs.getAvatar();
                if (!avatarTag) {
                    Log.log('用户不存在', uid);
                    continue;
                }

                let gender = xhs.getGender();
                if (config.gender.contains(gender)) {
                    Log.log('性别不匹配');
                    continue;
                }

                if ((config.type.contains("0") || config.type.contains("1"))) {
                    let type = xhs.intoUserVideo();
                    if (type !== false) {
                        if (config.type.contains("0")) {
                            xhs.likeVideo(type);
                        }

                        if (config.type.contains("1")) {
                            xhs.commentVideo(task.getMsg(0), type);
                            Common.back();//返回到主页
                            Log.log('评论返回到视频');
                        }

                        Common.back();//返回到主页
                        Log.log('返回到用户主页');
                        if (xhs.getAvatar()) {
                            Log.log('没有返回回来，再操作一次');
                            Common.sleep(1000);
                            Common.back();
                        }
                    }
                }

                if (config.type.contains("2")) {
                    xhs.followUser();
                }

                if (config.type.contains("3")) {
                    xhs.privateMsg(task.getMsg(1));
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
