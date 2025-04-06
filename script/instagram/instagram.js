const tags = require('./tags');
const util = require('./util');

const instagram = {
    intoHome() {
        const tag = util.id(tags.index.intoHome[0]).className(tags.index.intoHome[1]).isVisibleToUser(true).findOne();
        if (!tag) {
            throw new Error('找不到Home');
        }
        return util.click(tag, 1000 + 1000 * Math.random());
    },

    intoVideo() {
        const tag = util.id(tags.index.intoVideo[0]).isVisibleToUser(true).findOne();
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
        if (util.getNum(commentCountTag.text()) === 0) {
            util.back();
        }
        return true;
    },

    getVideoData() {
        const nicknameTag = util.id(tags.index.title[0]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();

        let descTag = util.id(tags.index.desc[0]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();

        if (descTag) {
            descTag = descTag.children().findOne(UiSelector().descMatches('.+'));
        }

        return {
            nickname: nicknameTag.text() || '',
            content: descTag ? descTag.desc() : '',
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
            let zanTags = UiSelector().className(tags.index.commentZan[0]).desc(tags.index.commentZan[1]).isVisibleToUser(true).filter(v => {
                return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0 && v.bounds().top + v.bounds().height() < bottom;
            }).find();

            for (let i in zanTags) {
                if (ignoreCount-- > 0) {
                    continue;//自己的评论过滤掉
                }

                if (zanTags[i].isSelected()) {
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
        const titleTag = util.id(tags.index.title[0]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();

        if (!titleTag) {
            throw new Error('找不到昵称');
        }

        //只能点击头部的60%，否则可能点击到关注
        const x = titleTag.bounds().left + Math.random() * titleTag.bounds().width();
        const y = titleTag.bounds().top + titleTag.bounds().height() * (0.6 * Math.random());
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
            if (!util.id(tags.user.focus[0]).isVisibleToUser(true).filter(v => {
                return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
            }).findOne()) {
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
        const privateTag = util.id(tags.user.private[0]).desc(tags.user.private[1]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();
        if (!privateTag) {
            throw new Error('没有私信按钮');
        }

        util.click(privateTag);
        util.sleep(2000 + 2000 * Math.random());
        util.log('点击了Message按钮');

        this.privateUserMain(getMsg);
    },

    /**
     * 
     * @param {Function} getMsg 
     */
    privateUserMain(getMsg) {
        const inputTag = util.id(tags.user.private[2]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left >= 0 && v.bounds().top >= 0;
        }).findOne();
        if (!inputTag) {
            throw new Error('找不到输入框');
        }
        util.click(inputTag);
        util.sleep(2000 + 2000 * Math.random());

        const inputTag2 = util.id(tags.user.private[2]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left > 0 && v.bounds().top > 0 && v.bounds().top < Device.height() * 0.75;
        }).findOne();

        if (!inputTag2) {
            throw new Error('找不到输入框2');
        }

        inputTag2.setText(getMsg(1));
        util.sleep(1000 + 1000 * Math.random());

        const sumbitTag = util.id(tags.user.private[3]).isVisibleToUser(true).filter(v => {
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

    intoCity() {
        //判断是否在同城，是的话，不操作
        const inCityTag = util.id(tags.index.city[4]).text(tags.index.city[5]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left > 0 && v.bounds().top > 0 && v.bounds().top < Device.height() * 0.75;
        }).findOne();
        if (inCityTag) {
            util.log('在同城，无需操作');
            return true;
        }

        const changeTag = util.id(tags.index.city[0]).text(tags.index.city[1]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left > 0 && v.bounds().top > 0 && v.bounds().top < Device.height() * 0.75;
        }).findOne();

        if (!changeTag) {
            throw new Error('找不到切换按钮');
        }
        util.click(changeTag);
        util.sleep(3000 + 2000 * Math.random());

        const cityTag = util.id(tags.index.city[2]).text(tags.index.city[3]).isVisibleToUser(true).filter(v => {
            return v && v.bounds() && v.bounds().left > 0 && v.bounds().top > 0 && v.bounds().top < Device.height() * 0.75;
        }).findOne();

        if (!cityTag) {
            throw new Error('找不到同城按钮');
        }
        util.click(cityTag);
        util.sleep(3000 + 2000 * Math.random());
    },

    /**
     * 
     * @param {object} config 
     * @param {Function} getMsg 
     */
    run(config, getMsg) {
        this.intoHome();
        this.intoVideo();
        let checkCount = 0;
        while (true) {
            util.log('进入视频');
            if (!this.viewVideo(config, getMsg)) {
                this.next();
                continue;
            }
            if (checkCount++ > 10) {
                checkCount = 0;
                this.intoCity();
            }

            this.next();
        }
    },

    /**
     * 
     * @param {number} type 0消息，1私信
     */
    intoMessage(type = 0) {
        const homeTag = util.id(tags.index.intoMessage[0]).isVisibleToUser(true).findOne();
        if (!homeTag) {
            throw new Error('homeTag没有找到');
        }
        util.click(homeTag, 2000 + 2000 * Math.random());

        const tag = util.id(tags.index.intoMessage[type + 1]).isVisibleToUser(true).findOne();
        if (!tag) {
            throw new Error('找不到消息入口：' + (type === 0 ? '消息' : '私信'));
        }
        return util.click(tag, 2000 + 2000 * Math.random());
    },

    /**
     * 
     * @param {*} config 
     * @param {*} getMsg 
     * @param {number} type
     */
    messageDeal(config, getMsg, type) {
        let scrollCount = 10;
        if (type === 0 && config.ai_back_comment_switch) {
            while (scrollCount-- > 0) {
                let replaies = UiSelector().className('android.view.View').filter(v => {
                    return v && v.id() === tags.index.message[0];
                }).isVisibleToUser(true).find();
                let messageCount = 0;
                for (let i in replaies) {
                    util.log('replaies', replaies[i]);
                    let top = replaies[i].bounds().top;
                    let bottom = replaies[i].bounds().top + replaies[i].bounds().height();
                    let rTag = UiSelector().textContains(tags.index.message[1]).isVisibleToUser(true).filter(v => {
                        return v && v.bounds() && v.bounds().top >= top && v.bounds().top + v.bounds().height() / 2 <= bottom;
                    }).findOne();

                    util.log(rTag);
                    if (!rTag) {
                        util.log('没有找到回复按钮，不处理');
                        continue;
                    }

                    let msgTag = UiSelector().className(tags.index.message[2]).isVisibleToUser(true).filter(v => {
                        return v && v.bounds() && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom && v.bounds().width() > Device.width() / 2;
                    }).findOne();
                    let msg = msgTag.text();
                    util.log('消息：' + msg);

                    //点击中间的20%，否则可能进入视频
                    // const x = rTag.bounds().left + rTag.bounds().width() * (1 - 0.40) * Math.random();
                    // const y = rTag.bounds().top + rTag.bounds().height() * (1 - 0.40) * Math.random();
                    // util.log('x, y');
                    Gesture.click(rTag.bounds().left + rTag.bounds().width() / 2, rTag.bounds().top + rTag.bounds().height() / 2);
                    util.sleep(2000 + 2000 * Math.random());

                    let iptTag = util.id(tags.index.message[3]).isVisibleToUser(true).findOne();
                    if (!iptTag) {
                        util.log('没有找到输入按钮');
                        throw new Error('没有找到输入按钮');
                    }

                    util.click(iptTag);
                    util.sleep(2000 + 1000 * Math.random());

                    iptTag = util.id(tags.index.message[3]).isVisibleToUser(true).findOne();
                    iptTag.setText(getMsg(0, iptTag.text() + msg));

                    let buttonTag = util.id(tags.index.message[4]).isVisibleToUser(true).findOne();
                    if (!buttonTag) {
                        throw new Error('没有找到发送按钮');
                    }

                    messageCount++;
                    util.click(buttonTag);
                    util.sleep(1500 + 1000 * Math.random());
                }

                if (messageCount === 0) {
                    util.log('没有可以处理的消息');
                    util.back();
                    util.sleep(2000 + 2000 * Math.random());
                    break;
                }

                util.log('一轮处理完毕');
                let scrollTag = UiSelector().scrollable(true).isVisibleToUser(true).filter(v => {
                    return v && v.id() === tags.index.messageScroll[0];
                }).findOne();
                if (scrollTag) {
                    scrollTag.scrollForward();
                    util.sleep(2000 + 2000 * Math.random());
                    util.log('滑动');
                }
            }
        }

        if (type === 1 && config.ai_back_friend_private_switch) {
            while (scrollCount-- > 0) {
                let privateContains = util.id(tags.index.privateMessage[0]).isVisibleToUser(true).find();
                if (privateContains.length === 0) {
                    util.log('没有私信内容了，中断');
                    break;
                }
                //评论内容或者私信
                for (let i in privateContains) {
                    let top = privateContains[i].bounds().top;
                    let bottom = privateContains[i].bounds().top + privateContains[i].bounds().height();
                    //开始处理内容
                    let tipTag = util.id(tags.index.privateMessage[1]).isVisibleToUser(true).filter(v => {
                        return v && v.bounds() && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                    }).findOne();

                    if (!tipTag) {
                        util.log('不是私信消息');
                        continue;
                    }

                    let headerTag = util.id(tags.index.privateMessage[2]).filter(v => {
                        return v && v.bounds() && v.bounds().top >= top && v.bounds().top + v.bounds().height() <= bottom;
                    }).findOne();
                    if (!headerTag) {
                        util.log('没有头像');
                        continue;
                    }
                    util.log(headerTag);

                    util.click(headerTag);
                    util.sleep(2000 + 2000 * Math.random());

                    let latestPrivateMsgTag = util.id(tags.index.latestPrivateMsg[0]).isVisibleToUser(true).filter(v => {
                        //必须是右边距大于左边距
                        return v && v.bounds() && v.bounds().left < Device.width() - (v.bounds().left + v.bounds().width());
                    }).findOne();
                    let msg = '';
                    if (latestPrivateMsgTag && latestPrivateMsgTag.text()) {
                        msg = latestPrivateMsgTag.text();
                    }
                    this.privateUserMain(() => getMsg(1, msg));
                }
            }
        }
    },

    /**
     * @param {{ ai_back_comment_run_other_fun: number; ai_back_comment_switch: boolean; ai_back_friend_private_switch: boolean; ai_back_minitue: number; }} config
     * @param {(type: number, msg: string) => "hello, 😄" | "hi, 😄"} getMsg
     */
    aiBack(config, getMsg) {
        //进入消息页面
        this.intoMessage(0);
        this.messageDeal(config, getMsg, 0);

        this.intoMessage(1);
        this.messageDeal(config, getMsg, 1);
    }
}

module.exports = instagram;
