let Common = require('../dy/Common');
let Video = require('../dy/Video');
let Comment = require('../dy/Comment');
let User = require('../dy/User');
let Dy = require('../dy/Dy');
let machine = require('../common/machine');

let task = {
    //0评论，1私信
    getMsg(type) {
        return machine.getMsg(type) || false;//永远不会结束
    },
    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log-log-" + file + ".txt";
        Log.setFile(allFile);
    },

    //cfg是指对评论用户的相关操作
    dealComments(config, firstContinue) {
        while (true) {
            let comments = Comment.getList(0);
            for (let k in comments) {
                try {
                    if (firstContinue) {
                        firstContinue = false;
                        Common.log('自己，不处理');
                        continue;
                    }
                    if (comments[k]['isAuthor']) {
                        Common.log('作者本人评论，跳过');
                        continue;
                    }

                    if (config.commentZanRate >= Math.random() && (!config.commentIp || config.commentIp.includes(comments[k]['ip']))) {
                        Comment.clickZan(comments[k]);
                        Common.sleep(config.timeout * 1000);
                    }
                } catch (e) {
                    Common.log('处理评论区异常了', e, e.message);
                }
            }

            Common.log('下一页评论');
            if (!Common.swipeCommentListOp()) {
                Common.back();
                System.sleep(2000);
                Common.log('到底了');
                break;
            }
            System.sleep(1500 + 500 * Math.random());
        }
    },

    dealUserVideo(config) {
        Video.intoLocalUserPage();
        if (!UiSelector().textContains('抖音号：').isVisibleToUser(true).findOne()) {
            Common.back();
            Common.sleep(1000 + 500 * Math.random());
            Common.log('非个人账号，不操作');
            FloatDialogs.toast('非个人账号，不操作');
            return;
        }

        let gender = User.getGender();
        if (!config.gender.includes(gender)) {
            Common.back();
            Common.sleep(1000 + 500 * Math.random());
            Common.log('性别不符合要求');
            FloatDialogs.toast('性别不符合要求');
            return;
        }

        if (config.minAge > 0 && (User.getAge() < config.minAge || User.getAge() > config.maxAge)) {
            Common.back();
            Common.sleep(1000 + 500 * Math.random());
            Common.log('年龄不符合条件');
            FloatDialogs.toast('年龄不符合条件');
            return;
        }

        if (config.ip && !config.ip.includes(User.getIp())) {
            Common.back();
            Common.sleep(1000 + 500 * Math.random());
            Common.log('IP不符合条件');
            FloatDialogs.toast('IP不符合条件');
            return;
        }

        if (config.focusRate >= Math.random()) {
            Common.log('关注用户');
            if (User.isFocus()) {
                Common.back();
                Common.sleep(1000 + 500 * Math.random());
                Common.log('已关注');
            } else {
                User.focus();
                Common.sleep(config.timeout * 1000);
                Common.back();
                Common.sleep(1000);
                Common.log('关注用户完成');
            }
            return true;
        }

        Common.back();
        Common.sleep(1000 + 500 * Math.random());
        Common.log('未关注');
        return true;
    },

    dealVideo(config) {
        Common.log('开始处理视频');
        if (Video.isLiving()) {
            Common.log('正在直播，跳过');
            return;
        }

        let nickname = Dy.getNickname();
        if (!nickname) {
            throw new Error('获取昵称失败');//不在视频页面
        }

        let zanCount = Video.getZanCount();
        Common.log('视频赞数', zanCount);
        if (zanCount < config.minZan || zanCount > config.maxZan) {
            Common.log('视频赞不符合条件');
            FloatDialogs.toast('视频赞不符合条件');
            return;
        }

        if (config.distance > 0) {
            let distanceTag = UiSelector().textContains('m').isVisibleToUser(true).findOne();
            console.log(distanceTag);
            if (!distanceTag) {
                Common.log('距离不达标，跳过');
                FloatDialogs.toast('距离不达标，跳过');
                return;
            }
            let distance = distanceTag.text();
            let distanceNum = 1000;
            if (distance.indexOf('km') !== -1) {
                distanceNum = parseFloat(distance) * 1000;
            } else if (distance.indexOf('m') !== -1) {
                distanceNum = Common.parseFloat(distance);
            } else {
                distanceNum = Common.parseFloat(distance);
            }

            Common.log('距离', distanceNum, config.distance);
            if (distanceNum > config.distance) {
                Common.log('距离不达标，跳过');
                FloatDialogs.toast('距离不达标，跳过');
                return;
            }
        }

        let f = (v) => {
            return v.bounds().left >= 0 && v.bounds().top > Device.height() / 2 && v.bounds().left < Device.width() && v.bounds().height() < Device.height();
        }

        let checkTag = UiSelector().textContains('广告').filter(f).isVisibleToUser(true).findOne() ||
            UiSelector().textContains('咨询').filter(f).isVisibleToUser(true).findOne() ||
            UiSelector().textContains('预约').filter(f).isVisibleToUser(true).findOne() ||
            UiSelector().textContains('团购').filter(f).isVisibleToUser(true).findOne();

        if (checkTag && checkTag.text().indexOf('团购') === -1) {
            Common.log('广告，跳过');
            Log.log(checkTag);
            FloatDialogs.toast('广告，跳过');
            return;
        } else if (checkTag && checkTag.text().indexOf('团购') !== -1) {
            Common.log('团购');
            let nicknameTag = Common.id('title').isVisibleToUser(true).findOne();
            Log.log(checkTag);
            if (nicknameTag && checkTag.bounds().top < nicknameTag.bounds().bottom) {
                FloatDialogs.toast('团购，跳过');
                return;
            }
        }

        let desc = Dy.getDesc();
        Common.log('视频描述', desc);
        if (desc && Storage.getBoolean('dy_show_desc' + Encrypt.md5(desc))) {
            Common.log('已经操作过了');
            FloatDialogs.toast('已经操作过了');
            return;
        }

        //开始操作博主
        if (!this.dealUserVideo(config)) {
            return;
        }

        Common.log('开始操作视频评论区');
        System.sleep(1500);
        if (config.zanRate >= Math.random()) {
            if (!Video.isZan()) {
                Common.log('视频未赞');
                Video.clickZan();
                Common.sleep(config.timeout * 1000);
                Common.log('赞视频');
            } else {
                Common.log('已赞');
            }
        }

        let first = false;
        if (config.commentRate >= Math.random()) {
            Video.openComment(!!Video.getCommentCount());
            let msg = this.getMsg(0);
            if (!msg) {
                FloatDialogs.toast('没有设置评论话术');
                Common.log('没有设置评论话术');
            } else {
                Common.log('准备评论');
                first = Comment.commentMsg(msg.msg, null, null);
                Common.sleep(config.timeout * 1000);
            }
        }

        if (config.commentZanRate > 0) {
            Common.log('准备打开评论区');
            System.sleep(1500);
            if (UiSelector().className('android.widget.LinearLayout').descContains('点赞').clickable(true).isVisibleToUser(true).findOne()) {
                Video.openComment(!!Video.getCommentCount());
            }
            this.dealComments(config, first);
            Storage.putBoolean('dy_show_desc' + Encrypt.md5(desc), true);
        }

        Comment.closeCommentWindow();
        System.sleep(1000);
        Log.log('关闭评论区');
        return true;
    },
    run(config) {
        while (true) {
            //判断是不是在指定页面，不是则尝试返回
            try {
                // this.backXPage(config.videoType);
                Common.log('dealVideo');
                this.dealVideo(config);
                Video.next();
                System.sleep(3000 + Math.random() * 1000);
            } catch (e) {
                Common.log('视频操作报错了：', e, e.message);
                Video.next();
            }
        }
    },

    /**
     * 尝试返回5次到视频主界面，每次多停留5秒
     * @param {string} type 
     * @returns 
     */
    backXPage(type) {
        let i = 3;
        let times = 5;
        while (Common.inXPage() != type && times-- > 0) {
            Common.log('不在指定页面，尝试返回', type, times, i);
            System.sleep(i * 1000);
            i += 5;
            Common.back(1);
            Common.sleep(1500);
        }
        return true;
    },
}

let config = {
    videoType: 'tongcheng',
    distance: Storage.getInteger('toker_run_distance'),
    gender: Storage.getArray('toker_user_gender'),
    ip: Storage.getString('toker_user_ip') && Storage.getString('toker_user_ip').replace(/，/g, ',').split(','),
    minAge: Storage.getInteger('toker_user_min_age'),
    maxAge: Storage.getInteger('toker_user_max_age'),
    minZan: Storage.getInteger('toker_run_zan_min_count'),
    maxZan: Storage.getInteger('toker_run_zan_max_count'),
    zanRate: Storage.getInteger('toker_run_video_zan_rate') / 100,
    commentRate: Storage.getInteger('toker_run_video_comment_rate') / 100,
    focesRate: Storage.getInteger('toker_run_video_focus_rate') / 100,
    privateRate: Storage.getInteger('toker_run_video_private_rate') / 100,
    commentZanRate: Storage.getInteger('toker_run_video_comment_zan_rate') / 100,
    commentIp: Storage.getString('toker_comment_user_ip') && Storage.getString('toker_comment_user_ip').replace(/，/g, ',').split(','),
    timeout: Storage.getInteger('toker_run_zan_timeout'),
}

while (true) {
    try {
        task.log();
        Common.log('配置：', config);
        task.run(config);
    } catch (e) {
        Common.log('异常处理：', e.message);
    }
}

