const { get } = require('../common/storage');
let Common = require('./Common');
let Video = {
    getZanTag() {
        let tag = UiSelector().className('android.widget.FrameLayout').descContains('点赞').clickable(true).isVisibleToUser(true).findOne();
        Log.log(tag);
        if (tag) {
            //900 1208 180 201
            console.log(tag.bounds().left, tag.bounds().top, tag.bounds().width(), tag.bounds().height());
            return tag;
        }

        throw new Error('没有找到赞标签');
    },

    getZanCount() {
        let zanTag = this.getZanTag();
        if (zanTag) {
            return Common.numDeal(zanTag.desc());
        }
        return 0;
    },

    isZan() {
        let zanTag = this.getZanTag();
        if (zanTag) {
            return zanTag.desc().indexOf('已点赞') > -1;
        }
        return false;
    },

    clickZan() {
        let zanTag = this.getZanTag();
        if (zanTag) {
            let res = Common.click(zanTag, 0.2);
            return res;
        }
        Log.log('点赞失败');
        return false;
    },
    intoUserVideo() {
        let workTag = UiSelector().descContains('作品').clickable(true).className('androidx.appcompat.app.ActionBar$Tab').isVisibleToUser(true).findOne();
        if (!workTag || Common.numDeal(workTag.desc()) === 0) {
            return false;
        }

        let bottom = Device.height() - 200 - Math.random() * 300;
        let top = bottom - 400 - Math.random() * 200;
        let left = Device.width() * 0.1 + Math.random() * (Device.width() * 0.8);
        Gesture.swipe(left, bottom, left, top, 300);
        Common.sleep(2200 + 300 * Math.random());

        //这里需要判断是否是商家t
        if (!workTag.isSelected()) {
            workTag.click();
            Common.log('点击workTag');
            Common.sleep(2000);
        }

        let containers = UiSelector().descMatches('(视频|图文)').className('android.view.View').filter(v => {
            return v.desc().indexOf('置顶') === -1;
        }).clickable(true).isVisibleToUser(true).find();
        let videoIndex = 0;
        let baseZanCount = 1000000000;
        let res;

        //老视频好像没有这种容器，新视频适用这个模式
        if (containers.length > 0) {
            for (let i in containers) {
                let zanCount = parseInt(containers[i].desc().split('点赞数')[1]);
                if (zanCount < baseZanCount) {
                    baseZanCount = zanCount;
                    videoIndex = parseInt(i);
                }
            }

            Common.log('最小赞', baseZanCount);
            Common.log("容器", containers[videoIndex]);
            //注意，这里偶尔通过tag.click点不进去
            res = Common.click(containers[videoIndex]);
        } else {
            containers = UiSelector().id('com.ss.android.ugc.aweme:id/container').isVisibleToUser(true).find();
            if (containers.length > 0) {
                res = Common.click(containers[videoIndex]);
            }
        }

        if (containers.length === 0) {
            return false;
        }

        Common.sleep(4000 + Math.random() * 1000);
        return res;
    },
    next() {
        let w = Device.width();
        let h = Device.height();

        let x = w * (0.45 + Math.random() * 0.1);
        let startY = h * (0.80 + Math.random() * 0.05);
        let endY = h * (0.20 + Math.random() * 0.05);

        let duration = 250 + Math.random() * 150;

        return Gesture.swipe(x, startY, x, endY, duration);
    },

    getCommentTag() {
        let tag = UiSelector().className('android.widget.FrameLayout').descContains('评论').isVisibleToUser(true).findOne();
        Common.log("评论标签：：：", tag);
        if (tag) {
            return tag;
        }

        throw new Error('没有找到评论标签');
    },

    getCommentCount() {
        let comment = this.getCommentTag();
        return Common.numDeal(comment.desc());
    },

    openComment(type) {
        let comment = this.getCommentTag();
        let res = comment.click();
        if (type) {
            Common.sleep(2000 + 1500 * Math.random());
        } else {
            Common.sleep(2000 + 1000 * Math.random());
            Common.back();
        }

        return res;
    },

    isLiving() {
        if (Common.id('live_audience_count_text').isVisibleToUser(true).findOne()) {
            return true;
        }

        //两种方式，一种是屏幕上展示，一种是头像
        if (UiSelector().text('点击进入直播间').isVisibleToUser(true).findOne()) {
            return true;
        }

        console.log("直播1检测完成");
        let tag = UiSelector().descContains('直播中').filter((v) => {
            return v && v.bounds() && v.bounds().top > Device.height() / 7 && v.bounds().top < Device.height() * 0.7 && v.bounds().left > Device.width() * 0.8;
        }).isVisibleToUser(true).exists();

        console.log("直播2检测完成");
        return tag ? true : false;
    },

    getAvatarTag() {
        let tag = Common.id('user_avatar').isVisibleToUser(true).findOnce();
        if (tag) {
            return tag;
        }
        throw new Error('找不到头像');
    },

    intoLocalUserPage() {
        let nicknameTag = Common.id('user_name_text_view').isVisibleToUser(true).findOne();
        Common.log(nicknameTag);
        let res = Common.click(nicknameTag);
        Common.sleep(4000 + 2000 * Math.random());
        return res;
    },

    collect() {
        let collectTag = UiSelector().descContains('未选中，收藏').isVisibleToUser(true).findOne();
        if (collectTag) {
            Common.click(collectTag);
        }
    }
}

module.exports = Video;