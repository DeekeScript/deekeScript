const tags = {
    package: 'com.zhiliaoapp.musically',
    index: {
        intoHome: ['jwm', 'Home'],
        intoForYou: ['android:id/text1', 'For You'],
        videoChange: ['androidx.viewpager.widget.ViewPager', 'u_q'],
        title: ['title'],
        desc: ['desc'],
        comment: ['cre', 'cqn'],
        zan: ['dwu'],
        input: ['cqz'],
        inputButton: ['bpu'],
        header: ['tou'],
        commentZan: ['j1s', 'i3y', 'i9h'],//i3y是未点赞状态，i9h是点赞后控件
        commentBottom: ['k9l'],
        commentAreaSwipe: ['nl9'],
        live: ['LIVE'],
    },
    user: {
        nickname: ['kpt'],
        focus: ['dgp', 'Follow'],
        //hm_是输入框外层的id，hme是按钮外层的id
        private: ['dgp', 'Message', 'hm_', 'android.widget.EditText', 'hme'],
    }
}

const util = {
    /**
     * @param {string} filename
     */
    setLog(filename) {
        Log.setFile(filename);
    },

    /**
     * @param {...object} obj
     */
    log(...obj) {
        console.log(obj);
        Log.log(obj);
    },

    /**
     * @param {number} millSecond
     */
    sleep(millSecond) {
        System.sleep(millSecond);
    },

    openApp() {
        let res = App.launch(tags.package);
        this.sleep(8000);
        //看看是不是主页
        let times = 3;
        while (!util.id(tags.index.intoHome[0]).isVisibleToUser(true).exists() && times-- > 0) {
            this.back();
            util.log('找不到主页，返回');
        }
        return res;
    },

    /**
     * @param {string} id 
    */
    id(id) {
        return UiSelector().id(tags.package + ':id/' + id);
    },

    /**
     * @param {string} id 
    */
    textId(id) {
        return UiSelector().id(id);
    },

    /**
     * 
     * @param {UiObject} tag 
     * @param {number} millSecond
     */
    click(tag, millSecond = undefined) {
        this.log('点击', tag);
        const x = tag.bounds().left + tag.bounds().width() * Math.random();
        const y = tag.bounds().top + tag.bounds().height() * Math.random();
        const res = Gesture.click(x, y);
        if (millSecond !== undefined) {
            this.sleep(millSecond);
        } else {
            this.sleep(2000 + 1000 * Math.random());
        }
        return res;
    },

    /**
     * 
     * @param {string} base 
     * @param {string} content 
     */
    contains(base, content) {
        const arr = base.replace(/，/g, ',').split(',');
        for (let str of arr) {
            if (content.indexOf(str) !== -1) {
                this.log('包含关键词：' + str);
                return true;
            }
        }
        return false;
    },

    /**
     * 
     * @param {number} millSecond 
     */
    back(millSecond = undefined) {
        Gesture.back();
        if (millSecond === undefined) {
            this.sleep(500);
        } else {
            this.sleep(millSecond);
        }
    },

    backApp() {
        App.backApp();
    },
}

const tiktok = {
    intoHome() {
        const tag = util.id(tags.index.intoHome[0]).desc(tags.index.intoHome[1]).isVisibleToUser(true).findOne();
        if (!tag) {
            throw new Error('找不到Home');
        }
        return util.click(tag, 1000 + 1000 * Math.random());
    },

    intoForYou() {
        const tag = util.textId(tags.index.intoForYou[0]).text(tags.index.intoForYou[1]).isVisibleToUser(true).findOne();
        if (!tag) {
            throw new Error('找不到forYou');
        }
        return util.click(tag);
    },

    next() {
        const tag = util.id(tags.index.videoChange[1]).className(tags.index.videoChange[0]).isVisibleToUser(true).scrollable(true).findOne();
        if (!tag) {
            throw new Error('找不到滑动');
        }
        const res = tag.scrollForward();
        util.sleep(500 + 500 * Math.random());
        return res;
    },

    openComment() {
        const commentCountTag = util.id(tags.index.comment[1]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();
        if (!commentCountTag) {
            throw new Error('找不到评论数量');
        }

        const commentTag = util.id(tags.index.comment[0]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();

        if (!commentTag) {
            throw new Error('找不到评论框');
        }

        util.click(commentTag, 4000);
        if (parseInt(commentCountTag.text()) === 0) {
            util.back();
        }
        return true;
    },

    getVideoData() {
        const nicknameTag = util.id(tags.index.title[0]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();

        const descTag = util.id(tags.index.desc[0]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();

        return {
            nickname: nicknameTag.text() || '',
            content: descTag ? descTag.text() : '',
        }
    },

    zanVideo() {
        const zanTag = util.id(tags.index.zan[0]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();
        if (!zanTag) {
            throw new Error('找不到赞');
        }
        util.click(zanTag);
    },

    /**
     * 
     * @param {string} msg 
     */
    commentVideo(msg) {
        this.openComment();
        const videoInputTag = util.id(tags.index.input[0]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();

        if (!videoInputTag) {
            throw new Error('找不到评论框');
        }
        util.click(videoInputTag);
        util.sleep(2000 + 2000 * Math.random());

        const videoInputTag2 = util.id(tags.index.input[0]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0 && v.bounds().top < Device.height() * 0.75;
        }).findOne();
        if (!videoInputTag2) {
            throw new Error('找不到评论框');
        }

        util.log('评论内容：' + msg);
        videoInputTag2.setText(msg);
        const videoInputButton = util.id(tags.index.inputButton[0]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();

        if (!videoInputButton) {
            throw new Error('找不到评论框');
        }
        util.click(videoInputButton);
        return true;//没有返回到视频，主要是考虑5连赞
    },

    /**
     * 
     * @param {boolean} commentWindowOpen 
     * @param {number} count 
     */
    commentAreaZan(commentWindowOpen, count) {
        if (!commentWindowOpen) {
            util.log('五连赞的评论区没打开，现在打开');
            this.openComment();
        }

        const bottomTag = util.id(tags.index.commentBottom[0]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();
        const bottom = bottomTag.bounds().top;
        let ignoreCount = 0;
        if (commentWindowOpen) {
            ignoreCount = 1;
        }

        let maxSwipe = 3;
        while (true) {
            let zanTags = util.id(tags.index.commentZan[0]).isVisibleToUser(true).filter(v => {
                return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0 && v.bounds().top + v.bounds().height() < bottom;
            }).find();

            for (let i in zanTags) {
                if (ignoreCount-- > 0) {
                    continue;//自己的评论过滤掉
                }

                if (zanTags[i].children().findOne(util.id(tags.index.commentZan[2]).isVisibleToUser(true))) {
                    util.log('已经点赞了');
                    continue;
                }

                let x = zanTags[i].bounds().left + zanTags[i].bounds().width() * (0.3 + 0.7 * Math.random());
                let y = zanTags[i].bounds().top + zanTags[i].bounds().height() * Math.random();
                util.log('点赞', zanTags[i], [x, y]);
                Gesture.click(x, y);
                util.sleep(2000 + 2000 * Math.random());
                if (--count <= 0) {
                    break;
                }
            }

            if (count <= 0 || maxSwipe-- <= 0) {
                util.log('评论点赞完毕');
                break;
            }

            const commentAreaSwipeTag = util.id(tags.index.commentAreaSwipe[0]).isVisibleToUser(true).scrollable(true).filter(v => {
                return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
            }).findOne();
            if (commentAreaSwipeTag) {
                util.log('滑动');
                commentAreaSwipeTag.scrollForward();
                util.sleep(2000 + 2000 * Math.random());
            }
        }
        return true;
    },

    intoUserPage() {
        const headerTag = util.id(tags.index.header[0]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();

        if (!headerTag) {
            throw new Error('找不到头像');
        }

        //只能点击头部的60%，否则可能点击到关注
        const x = headerTag.bounds().left + Math.random() * headerTag.bounds().width();
        const y = headerTag.bounds().top + headerTag.bounds().height() * (0.6 * Math.random());
        Gesture.click(x, y);
        util.sleep(3000 + 2000 * Math.random());
        util.log('进入了用户主页');

        const nicknameTag = util.id(tags.user.nickname[0]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();
        if (!nicknameTag) {
            //如果没有用户标签，看看是不是还在视频页面，是的话则返回true；否则抛异常
            this.getVideoData();//直接获取视频数据，不存在自动抛异常
            return false;
        }
        return true;
    },

    focusUser() {
        const focusTag = util.id(tags.user.focus[0]).text(tags.user.focus[1]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();

        if (!focusTag) {
            const privateTag = util.id(tags.user.private[0]).textContains(tags.user.private[1]).isVisibleToUser(true).filter(v => {
                return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
            }).findOne();

            if (!privateTag) {
                throw new Error('找不到关注按钮');
            }
            util.log('已关注过了');
            return false;
        }

        util.click(focusTag);
        util.sleep(2000 + 3000 * Math.random());
        return true;
    },

    /**
     * 
     * @param {Function} getMsg 
     */
    privateUser(getMsg) {
        const privateTag = util.id(tags.user.private[0]).textContains(tags.user.private[1]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();
        if (!privateTag) {
            throw new Error('没有私信按钮');
        }

        util.click(privateTag);
        util.sleep(2000 + 2000 * Math.random());
        util.log('点击了Message按钮');

        const inputParentTag = util.id(tags.user.private[2]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();
        if (!inputParentTag) {
            throw new Error('找不到输入框');
        }
        util.click(inputParentTag);
        util.sleep(1000 + 2000 * Math.random());

        const inputTag = UiSelector().className(tags.user.private[3]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left > 0 && v.bounds().top > 0 && v.bounds().top < Device.height() * 0.75;
        }).findOne();

        if (!inputTag) {
            throw new Error('找不到输入框2');
        }

        inputTag.setText(getMsg(1));
        util.sleep(1000 + 1000 * Math.random());

        const sumbitTag = util.id(tags.user.private[4]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left > 0 && v.bounds().top > 0 && v.bounds().top < Device.height() * 0.75;
        }).findOne();

        if (!sumbitTag) {
            throw new Error('找不到按钮');
        }
        util.click(sumbitTag);
        util.sleep(2000 + 2000 * Math.random());
        util.back();//关闭输入框
        util.back(700 + 800 * Math.random());//返回到用户主页
        return true;
    },

    /**
     * 
     * @param {object} config 
     * @param {Function} getMsg
     * @returns bool
     */
    viewVideo(config, getMsg) {
        const videoData = this.getVideoData();
        if (config.toker_view_video_keywords && !util.contains(config.toker_view_video_keywords, videoData.content)) {
            util.log('不包含关键词');
            return false;
        }

        util.log('观看视频：' + config.toker_view_video_second + '秒');
        util.sleep(config.toker_view_video_second * 1000 / 2 + config.toker_view_video_second * 1000 / 2 * Math.random());

        if (config.toker_zan_rate >= 100 * Math.random()) {
            util.log('点赞视频');
            this.zanVideo();
            util.sleep(3000 + 3000 * Math.random());
        }

        let openCommentWindow = false;
        if (config.toker_comment_rate >= 100 * Math.random()) {
            util.log('评论视频');
            this.commentVideo(getMsg(0));
            openCommentWindow = true;
            util.sleep(3000 + 3000 * Math.random());
        }

        if (config.toker_comment_area_zan_rate >= 100 * Math.random()) {
            util.log('评论区点赞');
            this.commentAreaZan(openCommentWindow, 5);
            openCommentWindow = true;
            util.sleep(3000 + 3000 * Math.random());
        }

        if (openCommentWindow) {
            util.back(1000 + 1000 * Math.random());
            util.log('关闭评论窗口');
        }

        //看看是不是直播，如果是则滑走
        if (UiSelector().text(tags.index.live[0]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left > Device.width() * 0.75 && v.bounds().top > Device.height() * 0.3 && v.bounds().top < Device.height() * 0.7;
        }).exists()) {
            util.log('直播中，下一个');
            return true;
        }

        const focusRate = Math.random() * 100;
        const privateRate = Math.random() * 100;
        if (focusRate > config.toker_focus_rate && privateRate > config.toker_private_msg_rate) {
            util.log('没有私信和关注操作，下一个');
            return true;
        }

        if (!this.intoUserPage()) {
            util.log('没有进入用户主页');
            return true;
        }

        if (focusRate <= config.toker_focus_rate) {
            util.log('关注用户');
            this.focusUser();
            util.sleep(3000 + 3000 * Math.random());
        }

        if (privateRate <= config.toker_private_msg_rate) {
            util.log('私信用户');
            this.privateUser(getMsg);
            util.sleep(3000 + 3000 * Math.random());
        }

        util.back(2000 + Math.random() * 2000);
        util.log('从主页进入到视频');
        return true;
    },

    /**
     * 
     * @param {object} config 
     * @param {Function} getMsg 
     */
    run(config, getMsg) {
        this.intoHome();
        this.intoForYou();
        while (true) {
            util.log('进入视频');
            if (!this.viewVideo(config, getMsg)) {
                this.next();
                continue;
            }

            this.next();
        }
    }
}

const task = {
    /**
     * @param {number} type
     */
    getMsg(type) {
        if (type == 0) {
            return '视频拍的很好';//0评论，1私信
        }

        return 'hello, 😄';
    },

    /**
     * @param {{ toker_view_video_second: number; //视频观看时间
    toker_view_video_keywords: string; //关键词
    toker_zan_rate: number; //点赞频率
    toker_comment_rate: number; //评论频率
    toker_focus_rate: number; //关注频率
    toker_private_msg_rate: number; //私信频率
    toker_comment_area_zan_rate: number; //评论区五连赞
    toker_run_hour: number[]; }} config
     */
    run(config) {
        tiktok.run(config, this.getMsg);
    }
}

Log.setFile('tiktok.log');
const config = {
    toker_view_video_second: 5,//视频观看时间
    toker_view_video_keywords: 'she,the,me,just,time,and,me,live,baby,you,that,this,simple,it', //关键词
    toker_zan_rate: 50, //点赞频率
    toker_comment_rate: 50, //评论频率
    toker_focus_rate: 20, //关注频率
    toker_private_msg_rate: 20, //私信频率
    toker_comment_area_zan_rate: 50, //评论区五连赞
    toker_run_hour: [0, 1, 21, 22, 23], //运行时间 
}

while (true) {
    try {
        util.log(config);
        util.openApp();
        if (!config.toker_run_hour.includes(new Date().getHours())) {
            util.backApp();
            util.log('回到app');
            util.sleep(60 * 1000);//休眠一分钟
            continue;
        }

        task.run(config);
    } catch (e) {
        util.log("异常了：", e.stack);
        util.sleep(3000);
    }
}

// tiktok.commentVideo('😄');
// tiktok.commentAreaZan(true, 5);
