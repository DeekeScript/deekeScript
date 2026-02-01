let Common = require('../dy/Common');
let Video = require('../dy/Video');
let Comment = require('../dy/Comment');
let User = require('../dy/User');
let Dy = require('../dy/Dy');

let task = {
    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log-log-" + file + ".txt";
        Log.setFile(allFile);
    },

    dealComment(cfg) {
        if (cfg.commentRate < Math.random()) {
            Common.log('评论概率不达标，跳过评论');
            return;
        }

        if (cfg.commentTypes.length == 0) {
            Common.log('没有评论内容，跳过评论');
            return;
        }

        Common.log('准备打开评论区');
        Video.openComment(!!Video.getCommentCount());
        Common.log('评论类型', cfg.commentTypes);
        let msg = '';
        if (cfg.commentTypes.includes('0')) {
            msg = cfg.commentContents[Math.floor(Math.random() * cfg.commentContents.length)];
        }

        let atName = '';
        if (cfg.commentTypes.includes('2') && cfg.commentAtNames && cfg.commentAtNames.length > 0) {
            atName = cfg.commentAtNames[Math.floor(Math.random() * cfg.commentAtNames.length)];
        }

        let img = undefined;
        if (cfg.commentTypes.includes('1') && cfg.commentImages && cfg.commentImages.length > 0) {
            //图片评论
            img = cfg.commentImages[Math.floor(Math.random() * cfg.commentImages.length)];
        }

        if (!msg && !img && !atName) {
            Common.log('评论内容和图片均为空，跳过评论');
            Common.back();
            System.sleep(1000 + Math.random() * 500);
            return;
        }

        return Comment.commentMsg(msg, atName, img);
    },

    //cfg是指对评论用户的相关操作
    dealComments(nickname, cfg, backCfg, firstContinue, count) {
        let a = firstContinue;
        let b = firstContinue;
        if (cfg && backCfg) {
            count *= 2;
        }

        Common.log('count', count);
        while (true) {
            if (cfg) {
                let comments = Comment.getList(0);
                for (let k in comments) {
                    if (count-- <= 0) {
                        Common.log('操作完了');
                        break;
                    }

                    try {
                        if (a) {
                            a = false;
                            Common.log('自己，不处理');
                            continue;
                        }
                        if (comments[k]['isAuthor']) {
                            Common.log('作者本人评论，跳过');
                            continue;
                        }

                        if (cfg.keywords && (!comments[k]['content'] || !Common.contains(comments[k]['content'], cfg.keywords))) {
                            Common.log('数据不包含关键词：', comments[k]['content'], cfg.keywords);
                            continue;
                        }

                        if (cfg.ip && comments[k].ip && !Common.contains(comments[k].ip, cfg.ip)) {
                            Common.log('IP不匹配', comments[k].ip, cfg.ip);
                            continue;
                        }

                        //评论时间处理
                        if (cfg.minDay && comments[k].time / 86400 > cfg.minDay) {
                            Common.log('时间不匹配', comments[k].time / 86400, cfg.minDay);
                            continue;
                        }

                        if (Storage.getBoolean('task_dy_toker_comment_' + nickname + '_' + comments[k].nickname)) {
                            Common.log('重复');
                            continue;
                        }

                        Common.log('找到了关键词', comments[k]['content']);
                        Storage.putBoolean('task_dy_toker_comment_' + nickname + '_' + comments[k].nickname, true);
                        try {
                            Comment.intoUserPage(comments[k]);
                        } catch (e) {
                            Common.log('进入用户页异常处理：', e, e.message);
                            continue;
                        }
                        //私密账号
                        if (User.isPrivate()) {
                            Common.back();
                            System.sleep(1500);
                            Common.log('私密账号');
                            continue;
                        }

                        if (cfg.gender && !Common.contains(User.getGender(), cfg.gender)) {
                            Common.log('性别不匹配');
                            Common.back();
                            System.sleep(1500);
                            continue;
                        }

                        let privateRate = Math.random();
                        let focusRate = Math.random();
                        let zanRate = Math.random();
                        let commentRate = Math.random();

                        Common.log('频率', cfg);
                        if (privateRate > cfg.privateRate && focusRate > cfg.focusRate &&
                            zanRate > cfg.videoZanRate && commentRate > cfg.videoCommentRate) {
                            Common.log('全部概率不匹配，跳过用户操作');
                            Common.back();
                            System.sleep(2000);
                            continue;
                        }

                        if (cfg.focusRate >= focusRate) {
                            if (User.isFocus()) {
                                Common.log('已关注');
                            } else {
                                User.focus();
                                Common.log('关注了');
                                System.sleep(1500 + 2000 * Math.random());
                            }
                        }

                        if (cfg.privateRate >= privateRate) {
                            Common.log('直接操作关注和私信引流');
                            User.privateMsg(
                                cfg.privateTypes,
                                cfg.privateMsgs[Math.floor(Math.random() * cfg.privateMsgs.length)],
                            );
                            System.sleep(2000);
                        }

                        if (cfg.videoZanRate < zanRate && cfg.videoCommentRate < commentRate) {
                            Common.log('视频点赞和评论概率均不匹配，跳过视频操作');
                            Common.back();
                            System.sleep(2000);
                            continue;
                        }

                        System.setAccessibilityMode('!fast');
                        try {
                            Common.log('进入用户视频页面');
                            if (Video.intoUserVideo()) {
                                Common.log('有视频，直接操作视频引流');
                                if (cfg.videoZanRate >= zanRate) {
                                    Video.clickZan();
                                    Common.log('点赞了');
                                    System.sleep(1500 + 2000 * Math.random());
                                }

                                if (cfg.videoCommentRate >= commentRate) {
                                    Video.openComment(!!Video.getCommentCount());
                                    Common.log('开启评论窗口');
                                    let msg = cfg.videoCommentContents[Math.floor(Math.random() * cfg.videoCommentContents.length)];
                                    let atName = cfg.videoCommentAtNames[Math.floor(Math.random() * cfg.videoCommentAtNames.length)];
                                    let img = cfg.videoCommentImages[Math.floor(Math.random() * cfg.videoCommentImages.length)];
                                    if (!cfg.videoCommentTypes.includes("0")) {
                                        msg = null;
                                    }

                                    if (!cfg.videoCommentTypes.includes("2")) {
                                        atName = null;
                                    }

                                    if (!cfg.videoCommentTypes.includes("1")) {
                                        img = null;
                                    }
                                    Comment.commentMsg(msg, atName, img);///////////////////////////////////操作  评论视频
                                    System.sleep(1500 + 2000 * Math.random());
                                    Common.log('评论了');
                                    Common.back();//视频页面回到用户页面
                                }
                                Common.back();//从视频页面到用户页面
                            }
                        } catch (e) {
                            Common.log('异常了', e);
                            System.sleep(2000);
                            User.backHome();
                        }

                        Common.back();
                        System.setAccessibilityMode('fast');
                        System.sleep(1000);
                        if (UiSelector().descContains('复制名字').findOne()) {
                            Common.back();
                            Log.log('在用户页面-，返回');
                            System.sleep(1000);
                        }
                    } catch (e) {
                        Common.log('处理评论区异常了', e, e.message);
                        //如果在用户页面，则返回
                        System.setAccessibilityMode('fast');
                        if (UiSelector().descContains('复制名字').findOne()) {
                            Common.back();
                            Log.log('在用户页面，返回');
                            System.sleep(1000);
                        }
                    }
                }
            }

            Common.log('开始处理回复', backCfg);
            if (backCfg) {
                Common.log('开始处理回复2');
                let comments = Comment.getList(1);
                for (let k in comments) {
                    if (count-- <= 0) {
                        Common.log('操作完了');
                        break;
                    }
                    try {
                        if (b) {
                            b = false;
                            Common.log('自己，不处理');
                            continue;
                        }

                        if (backCfg.keywords && (!comments[k]['content'] || !Common.contains(comments[k]['content'], backCfg.keywords))) {
                            Common.log('数据：', comments[k]['content'], backCfg.keywords);
                            continue;
                        }

                        Common.log('123');
                        if (backCfg.ip && comments[k].ip && !Common.contains(comments[k].ip, backCfg.ip)) {
                            Common.log('IP不匹配', comments[k].ip, backCfg.ip);
                            continue;
                        }

                        Common.log('124');
                        //评论时间处理
                        if (backCfg.minDay && comments[k].time / 86400 > backCfg.minDay) {
                            Common.log('时间不匹配', comments[k].time / 86400, backCfg.minDay);
                            continue;
                        }

                        Common.log('125');
                        if (Storage.getBoolean('task_dy_toker_comment_back_' + nickname + '_' + comments[k].nickname)) {
                            Common.log('重复');
                            continue;
                        }

                        Common.log('找到了关键词', comments[k]['content']);
                        Storage.putBoolean('task_dy_toker_comment_back_' + nickname + '_' + comments[k].nickname, true);

                        if (backCfg.commentZanRate >= Math.random() && !Comment.isZan(comments[k].tag)) {
                            Log.log('评论赞');
                            Comment.clickZan(comments[k]);
                        }

                        let backTag = comments[k].tag.children().findOne(UiSelector().text('回复'));
                        Common.log('backTag', backTag);
                        if (backTag) {
                            backTag.click();
                            System.sleep(1500);
                            let msg = backCfg.comments[Math.floor(Math.random() * backCfg.comments.length)];
                            let atName = backCfg.atUserNames[Math.floor(Math.random() * backCfg.atUserNames.length)];
                            let img = backCfg.comentImages[Math.floor(Math.random() * backCfg.comentImages.length)];

                            if (!backCfg.type.includes("0")) {
                                msg = null;
                            }

                            if (!backCfg.type.includes("2")) {
                                atName = null;
                            }

                            if (!backCfg.type.includes("1")) {
                                img = null;
                            }

                            Comment.commentMsg(msg, atName, img);///////////////////////////////////操作  回复评论
                            Common.log('回复了评论');
                            System.sleep(1000);
                        }
                    } catch (e) {
                        Common.log('处理回复评论异常了', e);
                        //如果发送按钮底部不在屏幕底部
                        if (UiSelector().text('发送').findOne()) {
                            Common.back();
                            Log.log('在用户页面，返回');
                            System.sleep(1000);
                        }
                    }
                }
            }

            Common.log('下一页评论', count);
            if (count <= 0 || !Common.swipeCommentListOp()) {
                Common.back();
                System.sleep(1000);
                Common.log('到底了');
                break;
            }
            System.sleep(1500 + 500 * Math.random());
        }
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

        let ip = Dy.getIp();
        Common.log('ip', ip);
        if (config.videoIp) {
            if (!ip) {
                Common.log('不在指定IP范围，跳过操作视频', ip);
                return;
            }

            if (!Common.contains(ip, config.videoIp)) {
                Common.log('不在指定IP范围，跳过操作视频', ip);
                return;
            }
        }

        let desc = Dy.getDesc();
        Common.log('视频描述', desc);
        let rt = false;
        if (config.videoKeywords) {
            if (desc && Common.contains(desc, config.videoKeywords)) {
                rt = true;
            }

            if (ip && Common.contains(ip, config.videoKeywords)) {
                rt = true;
            }
        } else {
            rt = true;
        }

        if (!rt) {
            Common.log('找到关键词，等待', config.videoWaitSecond, '秒');
            let nextVideo = FloatDialogs.confirm('不包含关键词提示', config.videoWaitSecond + '秒后关闭，执行下一个作品', '下一个作品', '操作当前作品', (dialog) => {
                let i = 0;
                while (i++ < config.videoWaitSecond) {
                    System.sleep(1000);
                    dialog.setContent((config.videoWaitSecond - i) + '秒后关闭，执行下一个作品');
                }
                return true;
            });

            if (nextVideo) {
                Common.log('跳过操作视频');
                return;
            }
        } else {
            Common.log('找到了关键词');
        }

        Common.log('开始操作视频评论区');
        let first = false;
        if (config.comment) {
            System.sleep(1500);
            this.dealComment(config.comment);
            first = true;
        }

        if (config.commentUser || config.backComment) {
            System.sleep(1500);
            if (!Common.id('title').textContains('暂无评论').findOne() && !Common.id('title').textContains('条评论').findOne()) {
                Video.openComment(!!Video.getCommentCount());
            }

            this.dealComments(nickname, config.commentUser, config.backComment, first, config.count);
        }

        Comment.closeCommentWindow();
        System.sleep(1000);
        Log.log('关闭评论区');
    },
    run(config) {
        while (true) {
            //判断是不是在指定页面，不是则尝试返回
            try {
                Common.log('backXPage');
                System.setAccessibilityMode('fast');
                this.backXPage(config.videoType);
                Common.log('dealVideo');
                this.dealVideo(config);
                Video.next(true);
                System.sleep(2000 + Math.random() * 1000);
            } catch (e) {
                Common.log('视频操作报错了：', e, e.message);
                Video.next(true);
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
    videoType: ['tuijian', 'tongcheng', 'search'][Storage.get('toker_run_mode')],
    videoIp: Storage.get('toker_video_ip') ? Storage.get('toker_video_ip').replace(/\，/g, ',').split(',') : null,
    videoKeywords: Storage.get('toker_video_keywords') ? Storage.get('toker_video_keywords').replace(/\，/g, ',').split(',') : null,
    videoWaitSecond: Storage.getInteger('toker_wait_second'),
    count: Storage.getInteger('toker_video_count'),
    comment: Storage.getBoolean('toker_comments') ? {
        commentRate: Storage.getInteger('toker_comment_rate') / 100,
        commentTypes: Storage.getArray('toker_comment_type'),
        commentAtNames: Storage.get('toker_comment_at_name').split('@'),
        commentContents: Storage.get('toker_comment_content').split("\n\n"),
        commentImages: Storage.getArray('toker_comment_images'),
    } : null,
    commentUser: Storage.getBoolean('toker_comment_setting') ? {
        ip: Storage.get('toker_comment_setting_video_ip') ? Storage.get('toker_comment_setting_video_ip').replace(/\，/g, ',').split(',') : null,
        keywords: Storage.get('toker_comment_setting_keywords') ? Storage.get('toker_comment_setting_keywords').replace(/\，/g, ',').split(',') : null,
        gender: Storage.getArray('toker_comment_setting_sex'),
        minDay: Storage.getInteger('toker_comment_setting_min_day'),
        focusRate: Storage.getInteger('toker_comment_setting_focus_rate') / 100,
        privateRate: Storage.getInteger('toker_comment_setting_private_msg_rate') / 100,
        privateTypes: Storage.getArray('toker_comment_setting_private_msg_type'),
        privateImages: Storage.getArray('toker_comment_setting_private_msg_images'),
        privateMsgs: Storage.get('toker_comment_setting_private_msg').split("\n\n"),
        videoZanRate: Storage.getInteger('toker_comment_setting_video_zan_rate') / 100,
        videoCommentRate: Storage.getInteger('toker_comment_setting_video_comment_rate') / 100,
        videoCommentTypes: Storage.getArray('toker_comment_setting_video_comment_type'),
        videoCommentImages: Storage.getArray('toker_comment_setting_video_comment_images'),
        videoCommentAtNames: Storage.get('toker_comment_setting_video_at_name').split('@'),
        videoCommentContents: Storage.get('toker_comment_setting_video_comment_content').split("\n\n"),
    } : null,
    backComment: Storage.getBoolean('toker_back_comment') ? {
        ip: Storage.get('toker_back_comment_ip') ? Storage.get('toker_back_comment_ip').replace(/\，/g, ',').split(',') : null,
        keywords: Storage.get('toker_back_comment_keywords') ? Storage.get('toker_back_comment_keywords').replace(/\，/g, ',').split(',') : null,
        minDay: Storage.getInteger('toker_back_comment_min_day'),
        type: Storage.getArray('toker_back_comment_type'),
        commentZanRate: Storage.getInteger('toker_back_comment_zan_rate') / 100,
        comentImages: Storage.getArray('toker_back_comment_images'),
        comments: Storage.get('toker_back_comment_content').split("\n\n"),
        atUserNames: Storage.get('toker_back_comment_at_user').split('@'),
    } : null,
}

try {
    task.log();
    Common.log('配置：', config);
    task.run(config);
} catch (e) {
    Common.log('异常处理：', e, e.message);
}
