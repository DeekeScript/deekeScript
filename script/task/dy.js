
let Common = {
    id(name) {
        return UiSelector().id('com.ss.android.ugc.aweme:id/' + name);
    },

    click(tag) {
        return Gesture.click(tag.bounds().left + tag.bounds().width() * Math.random(), tag.bounds().top + tag.bounds().height() * Math.random());
    },

    log(...args) {
        console.log(args);
        Log.log(args);
    },

    contains(title, keywords) {
        for (let k in keywords) {
            if (title.indexOf(keywords[k]) !== -1) {
                return true;
            }
        }
        return false;
    },

    numDeal(text) {
        text = /[\d\.]+[\w|万]*/.exec(text);
        if (!text) {
            return 0;
        }

        text[0] = text[0].replace(',', '').replace(',', '').replace(',', '');
        if (text[0].indexOf('w') !== -1 || text[0].indexOf('万') !== -1) {
            text[0] = text[0].replace('w', '').replace('万', '') * 10000;
        }
        Common.log('数字：', text[0]);
        return text[0] * 1;//可能存在多个逗号
    },

    selectPhoto(file, isPrivate) {
        let file2 = MediaStore.saveContentImageToGallery(file);//文件移动到相册
        try {
            if (!isPrivate) {
                let tag = UiSelector().desc('插入图片').isVisibleToUser(true).findOne();
                Gesture.click(tag.bounds().centerX(), tag.bounds().centerY());
                System.sleep(3000);
            } else {
                let tag = UiSelector().desc('更多面板').isVisibleToUser(true).findOne();
                Gesture.click(tag.bounds().centerX(), tag.bounds().centerY());
                System.sleep(3000);

                tag = UiSelector().text('相册').isVisibleToUser(true).findOne();
                Gesture.click(tag.bounds().centerX(), tag.bounds().centerY());
                System.sleep(3000);
            }

            let imageTag = UiSelector().className('android.widget.ImageView').isVisibleToUser(true).filter(v => {
                return v.parent().className() == 'android.widget.FrameLayout' && v.parent().bounds().width() == v.parent().bounds().height();
            }).findOne();

            Gesture.click(imageTag.bounds().centerX(), imageTag.bounds().centerY());
            System.sleep(500);
        } catch (e) {
            Common.log("图片处理异常：", e);
        }

        let success = MediaStore.deleteImage(file2);
        if (success) {
            console.log('删除成功');
        }
        System.sleep(2000);
    },

    swipeSearchUserOp(filterRootLayout) {
        let tag = UiSelector().className('androidx.recyclerview.widget.RecyclerView').scrollable(true).filter(v => {
            if (filterRootLayout) {
                return v.children().findOne(UiSelector().id('com.ss.android.ugc.aweme:id/root_layout').isVisibleToUser(true));
            }
            return true;
        }).isVisibleToUser(true).findOne();
        if (!tag) {
            Common.log('滑动失败');
            return 0;
        }

        if (tag.scrollForward()) {
            Common.log('滑动成功');
            return true;
        }
        Common.log('滑动到底了');
        return false;
    },

    swipeCommentListOp() {
        return this.swipeSearchUserOp();
    },

    sleep(time) {
        System.sleep(time);
    },

    back(times) {
        if (!times) {
            times = 1;
        }
        for (let i = 0; i < times; i++) {
            Gesture.back();
            Common.sleep(500);
        }
    }
}

let Video = {
    getZanTag() {
        let tag = UiSelector().className('android.widget.LinearLayout').descContains('点赞').clickable(true).isVisibleToUser(true).findOne();
        Log.log(tag);
        if (tag) {
            //900 1208 180 201
            console.log(tag.bounds().left, tag.bounds().top, tag.bounds().width(), tag.bounds().height());
            return tag;
        }

        throw new Error('没有找到赞标签');
    },
    clickZan() {
        let zanTag = this.getZanTag();
        if (zanTag) {
            let res = zanTag.click();
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

        //这里需要判断是否是商家
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
    next(fast) {
        if (fast) {
            System.setAccessibilityMode('!fast');
        }
        let tag = UiSelector().id('com.ss.android.ugc.aweme:id/viewpager').desc('视频').scrollable(true).isVisibleToUser(true).findOne();
        if (!tag) {
            tag = UiSelector().id('com.ss.android.ugc.aweme:id/viewpager').filter(v => {
                return v.bounds().height() < Device.height();
            }).scrollable(true).className('androidx.viewpager.widget.ViewPager').isVisibleToUser(true).findOne();
        }
        if (!tag) {
            tag = UiSelector().className('androidx.viewpager.widget.ViewPager').scrollable(true).isVisibleToUser(true).findOne();
        }
        if (!tag) {
            tag = UiSelector().scrollable(true).isVisibleToUser(true).findOne();
        }
        if (!tag) {
            throw new Error('找不到可滑动的视频页面');
        }
        let res = tag.scrollForward();
        if (fast) {
            System.setAccessibilityMode('fast');
        }
        return res;
    },

    getCommentTag() {
        let tag = UiSelector().className('android.widget.LinearLayout').descContains('评论').clickable(true).isVisibleToUser(true).findOne();
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
}

let Comment = {
    tag: null,
    getTime() {
        let now = new Date();
        let incSecond = 0;

        let timeTag = this.getTimeTag();
        if (!timeTag) {
            return 0;
        }

        let time = timeTag.text();
        if (time.indexOf('分钟前') !== -1) {
            incSecond = parseInt(time) * 60;

        } else if (time.indexOf('小时前') !== -1) {
            incSecond = parseInt(time) * 3600;

        } else if (time.indexOf('刚刚') !== -1) {
            incSecond = 0;

        } else if (time.indexOf('天前') !== -1) {
            incSecond = parseInt(time) * 86400;

        } else if (time.indexOf('昨天') !== -1) {
            let t = time.replace('昨天', '').split(':');
            incSecond =
                86400 -
                // @ts-ignore
                t[0] * 3600 -
                // @ts-ignore
                t[1] * 60 +
                now.getHours() * 3600 +
                now.getMinutes() * 60;
        } else if (/^\d{4}年\d{1,2}月\d{1,2}日$/.test(time)) {
            let formatted = time
                .replace('年', '-')
                .replace('月', '-')
                .replace('日', '');
            incSecond = new Date(formatted).getTime() / 1000;
        } else if (/^\d{1,2}月\d{1,2}日$/.test(time)) {
            const year = now.getFullYear();
            let formatted =
                year +
                '-' +
                time.replace('月', '-').replace('日', '');
            incSecond = new Date(formatted).getTime() / 1000;
        }

        return incSecond;
    },
    atUser(atUser) {
        let tag = UiSelector().isVisibleToUser(true).filter(v => {
            return v.isEditable();
        }).findOne();
        let account = atUser.split('@');
        for (let i in account) {
            if (!account[i]) {
                continue;
            }
            System.setClip('@' + account[i].replace('@', ''));
            System.sleep(1000);
            tag.paste();
            System.sleep(2000);

            let selectTag = UiSelector().id('com.ss.android.ugc.aweme:id/tv_name').findOne();
            if (selectTag) {
                console.log('CheckBox');
                Gesture.click(selectTag.bounds().left + selectTag.bounds().width() * Math.random(), selectTag.bounds().top + selectTag.bounds().height() * Math.random());
                System.sleep(1000);
            }
        }
    },

    commentMsg(msg, atUser, img) {
        let iptTag = UiSelector().className('android.widget.EditText').isVisibleToUser(true).filter(v => {
            return v.isEditable();
        }).findOne();

        iptTag.click();
        Common.sleep(1500 + 500 * Math.random());
        iptTag = UiSelector().className('android.widget.EditText').isVisibleToUser(true).filter(v => {
            return v.isEditable();
        }).findOne();

        //获取是否评论图片
        Common.log("带图评论：" + img);
        if (img) {
            Common.selectPhoto(img);
            iptTag.click();
            Common.sleep(100);
        }

        Common.log('msg', msg);
        if (msg) {
            let j = Math.floor(Math.random() * msg.length);
            Common.sleep(200 + 50 * Math.random());
            System.setClip(msg.substring(0, j));
            Log.log('评论第一部分：', msg.substring(0, j));
            iptTag.paste();
            if (atUser) {
                Common.sleep(200 + 50 * Math.random());
                this.atUser(atUser);
            }

            Common.sleep(200 + 50 * Math.random());
            System.setClip(msg.substring(j, msg.length));
            Log.log('评论第二部分：', msg.substring(j, msg.length));
            iptTag.paste();
        } else {
            if (atUser) {
                this.atUser(atUser);
            }
        }

        Common.sleep(500 + Math.random() * 1000);
        Common.sleep(500 + Math.random() * 500);

        let btnTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).text('发送').findOne();
        Gesture.click(btnTag.bounds().left + btnTag.bounds().width() * Math.random(), btnTag.bounds().top + btnTag.bounds().height() * Math.random());
        Common.sleep(500 + 500 * Math.random());

        //查看dg0位置有没有下来
        iptTag = UiSelector().className('android.widget.EditText').isVisibleToUser(true).filter(v => {
            return v.isEditable();
        }).findOne();
        if (iptTag && iptTag.bounds().top < Device.height() * 2 / 3) {
            Common.back();
            Common.log("点击失败：返回");
        }

        Common.sleep(1000 + 1000 * Math.random());
        return true;
    },
    containers: [],
    getList() {
        let moreTag = UiSelector().text('已折叠部分评论').isVisibleToUser(true).findOne();
        if (moreTag) {
            Common.log('点击展开');
            Common.click(moreTag);
            Common.sleep(3000 + Math.random() * 1500);
        }

        let secondListTag = UiSelector().descContains('展开').descContains('条回复').isVisibleToUser(true).find();
        if (secondListTag.length > 0) {
            Common.log('二级评论数量：', secondListTag.length);
            for (let i in secondListTag) {
                secondListTag[i].parent().click();
            }
        }

        // let contains = UiSelector().className('android.widget.FrameLayout').filter(v => {
        //     return v.desc() && v.bounds().width() >= Device.width() - 10;
        // }).isVisibleToUser(true).find();
        //一级评论和二级评论
        let contains = UiSelector().filter(v => {
            return (v.className() == 'android.view.ViewGroup' || v.className() == 'android.widget.FrameLayout') && v.desc() && v.children().findOne(Common.id('avatar'));
        }).isVisibleToUser(true).find();

        Common.log("数量：", contains.length);
        let contents = [];
        let data = {};

        for (let i in contains) {
            this.tag = contains[i];//主要给当前方法使用的，比如下面的this.getIp()方法等
            Common.log("tag", this.tag);
            data = {
                tag: contains[i],
                nickname: this.getNickname(),
                content: this.getContent(),
                isAuthor: this.isAuthor(),
                ip: this.getIp(),
                time: this.getTime(),
            }

            Common.log("评论数据", data.nickname, data.content, data.ip, data.time, data.isAuthor);
            if (data.nickname === false) {
                Common.log('评论区nickname无');
                continue;
            }

            if (this.containers && this.containers.length > 100) {
                this.containers.shift();
            }

            if (this.containers.includes(data.nickname + '_' + data.content)) {
                continue;
            }

            contents.push(data);
            this.containers.push(data.nickname + '_' + data.content);
        }
        return contents;
    },

    getAvatarTag(tag) {
        if (tag) {
            return tag.children().findOne(Common.id('avatar'));
        }
        return this.tag.children().findOne(Common.id('avatar'));
    },

    intoUserPage(data) {
        let headTag = this.getAvatarTag(data.tag);
        let res = headTag.click();
        Common.sleep(3000 + 1000 * Math.random());
        return res;
    },

    /**
     * 返回昵称控件，也可以通过TextView的第一个的方式来返回，注意这个可以被点击，另外如果isVisibleToUser为false也能点击
     * @returns Object
     */
    getNicknameTag() {
        // return this.tag.children().findOne(Common.id('title'));
        return Common.id('title').filter(v => {
            return v.bounds().left >= this.tag.bounds().left && v.bounds().right <= this.tag.bounds().right
                && v.bounds().top >= this.tag.bounds().top && v.bounds().bottom <= this.tag.bounds().bottom;
        }).findOne();
    },

    /**
     * 返回评论内容控件
     * @returns Object
     */
    getContentTag() {
        // return this.tag.children().findOne(Common.id('content'));
        return Common.id('content').filter(v => {
            return v.bounds().left >= this.tag.bounds().left && v.bounds().right <= this.tag.bounds().right
                && v.bounds().top >= this.tag.bounds().top && v.bounds().bottom <= this.tag.bounds().bottom;
        }).findOne();
    },

    /**
     * 获取Ip控件
     * @returns object
     */
    getIpTag() {
        // return this.tag.children().findOne(UiSelector().textContains(' · ').isVisibleToUser(true));
        return UiSelector().textContains(' · ').filter(v => {
            return v.bounds().left >= this.tag.bounds().left && v.bounds().right <= this.tag.bounds().right
                && v.bounds().top >= this.tag.bounds().top && v.bounds().bottom <= this.tag.bounds().bottom;
        }).findOne();
    },

    getIp() {
        let ipTag = this.getIpTag();
        if (ipTag) {
            return ipTag.text().replace(' · ', '');
        }
        return null;
    },

    getTimeTag() {
        // return this.tag.children().findOne(Common.id('erw'));
        return Common.id('erw').filter(v => {
            return v.bounds().left >= this.tag.bounds().left && v.bounds().right <= this.tag.bounds().right
                && v.bounds().top >= this.tag.bounds().top && v.bounds().bottom <= this.tag.bounds().bottom;
        }).findOne();
    },

    /**
     * 返回回复控件
     * @param {Object} tag 
     * @returns 
     */
    getBackTag(tag) {
        if (tag) {
            return tag.children().findOne(UiSelector().text('回复').filter(v => {
                return v.bounds().left > Device.width() / 4;
            }));
        }

        return this.tag.children().findOne(UiSelector().text('回复').filter(v => {
            return v.bounds().left > Device.width() / 4;
        }));
    },

    /**
     * 获取点赞控件  注意它的父控件可以直接使用click方法点击
     * @param {Object} tag 
     * @returns 
     */
    getZanTag(tag) {
        if (tag) {
            return tag.children().findOne(UiSelector().className('android.widget.LinearLayout').descContains('赞'));
        }
        return this.tag.children().findOne(UiSelector().className('android.widget.LinearLayout').descContains('赞'));
    },

    /**
     * 是否是作者
     * @returns boolean
     */
    isAuthor() {
        return this.tag.children().findOne(UiSelector().text('作者')) ? true : false;
    },

    /**
     * 返回昵称
     * @returns string|false
     */
    getNickname() {
        let tag = this.getNicknameTag();
        if (tag) {
            return tag.text();
        }
        return false;
    },

    /**
     * 返回评论内容
     * @returns string|false
     */
    getContent() {
        let tag = this.getContentTag();
        if (tag) {
            return tag.text();
        }
        return false;
    },

    /**
     * 获取点赞数量
     * @returns number
     */
    getZanCount() {
        let tag = this.getZanTag();
        return tag ? Common.numDeal(tag.desc()) : 0;
    },

    closeCommentWindow() {
        let closeTag = UiSelector().desc('关闭').isVisibleToUser(true).clickable(true).findOne();
        if (!closeTag) {
            return false;
        }
        return closeTag.click();
    },
}

let User = {
    getGender() {
        if (UiSelector().className('android.widget.TextView').isVisibleToUser(true).textContains('男').findOne()) {
            return '1';
        }

        if (UiSelector().className('android.widget.TextView').isVisibleToUser(true).textContains('女').findOne()) {
            return '0';
        }

        return '2';
    },

    /**
     * 黑名单账号（封禁和注销账号）
     * @returns {boolean}
     */
    isBlackUser() {
        //帐号已被封禁
        if (UiSelector().textContains('封禁').isVisibleToUser(true).findOnce()) {
            return true;
        }

        //注销了
        if (UiSelector().textContains('账号已经注销').isVisibleToUser(true).findOnce()) {
            return true;
        }
        return false;
    },

    /**
     * 是否是私密账号、注销账号、封禁账号
     * @returns {boolean}
     */
    isPrivate() {
        Common.log("是否是私密账号、注销账号、封禁账号？");
        if (UiSelector().text('私密账号').isVisibleToUser(true).findOnce()) {
            return true;
        }

        if (this.isBlackUser()) {
            return true;
        }
        Common.log("不是私密账号、注销账号、封禁账号");
        return false;
    },

    intoPrivatePage() {
        let settingTag = UiSelector().desc('更多').clickable(true).isVisibleToUser(true).findOne() || UiSelector().text('更多').clickable(true).isVisibleToUser(true).findOne();
        if (!settingTag) {
            Log.log('找不到setting按钮');
            return false;
        }

        settingTag.click();
        Log.log("私信");
        Common.sleep(700 + 500 * Math.random());

        let sendTag = UiSelector().text('发私信').isVisibleToUser(true).findOne();
        if (!sendTag) {
            throw new Error('找不到发私信按钮');
        }

        let res = sendTag.parent().click();
        Common.sleep(3000 + 1000 * Math.random());
        return res;
    },

    privateMsg(types, msg) {
        if (!this.intoPrivatePage()) {
            return false;
        }

        if (!msg) {
            Common.log('没有内容');
            return false;
        }

        try {
            let textTag = null;
            let retryCount = 0;
            let maxRetries = 3;

            while (retryCount < maxRetries && !textTag) {
                textTag = UiSelector().className('android.widget.EditText').filter(v => {
                    return v.isEditable();
                }).isVisibleToUser(true).findOne();

                if (!textTag) {
                    retryCount++;
                    Common.log('找不到发私信输入框，重试第' + retryCount + '次');
                    if (retryCount < maxRetries) {
                        Common.sleep(1000 + 500 * Math.random());
                    }
                }
            }

            if (!textTag) {
                throw new Error('找不到发私信输入框');
            }

            textTag.setText(msg);
            Common.sleep(500 + 500 * Math.random());

            // if (types.includes('1') && photo) {
            //     Common.selectPhoto(photo, 1);
            //     Common.sleep(500 + 500 * Math.random());
            // }

            let sendTextTag = UiSelector().desc('发送').isVisibleToUser(true).clickable(true).findOne();
            if (!sendTextTag) {
                throw new Error('找不到发送按钮');
            }

            if (!sendTextTag.click()) {
                throw new Error('发送消息失败');
            }

            Common.back(2);
            Common.sleep(500 + 500 * Math.random());
            Common.log("私信发送完成");
            return true;
        } catch (e) {
            Common.log('私信发送异常:', e.message);
        }
        return false;
    },

    isFocusTag() {
        return UiSelector().className('android.widget.TextView').isVisibleToUser(true).filter(v => {
            return v.hintText == '按钮';
        }).textContains('已关注').findOne() || UiSelector().className('android.widget.TextView').isVisibleToUser(true).filter(v => {
            return v.hintText == '按钮';
        }).textContains('互相关注').findOne();
    },

    /**
     * 是否已关注
     * @returns {boolean}
     */
    isFocus() {
        return !!this.isFocusTag();
    },

    /**
     * 关注
     * @returns {boolean}
     */
    focus() {
        let focusTag = UiSelector().className('android.widget.TextView').isVisibleToUser(true).filter(v => {
            return v.hintText == '按钮';
        }).text('关注').findOne() || UiSelector().className('android.widget.TextView').isVisibleToUser(true).filter(v => {
            return v.hintText == '按钮';
        }).text('回关').findOne();

        if (this.isFocus()) {
            Common.log('已关注');
            return true;
        }

        if (focusTag) {
            let res = focusTag.click();
            Common.sleep(500 + 500 * Math.random());
            return res;
        }

        throw new Error('找不到关注和已关注');
    },

    backHome() {
        let i = 5;
        let settingTag;
        do {
            settingTag = UiSelector().descContains('复制名字').clickable(true).findOne();
            if (!settingTag) {
                Common.back();
                System.sleep(1000);
                continue;
            }
            Common.log('返回到了用户主页');
            return true;
        } while (i-- > 0 && !settingTag);
        Common.log('返回用户主页失败');
        return false;
    },
}

let Dy = {
    inTargetPage() {
        if (UiSelector().descContains('推荐').filter(v => {
            return v.bounds().left > 0 && v.bounds().top > 0 && v.bounds().width() > 0;
        }).findOne()) {
            return true;
        }

        if (UiSelector().descContains('搜索').filter(v => {
            return v.bounds().left > 0 && v.bounds().top > 0 && v.bounds().width() > 0;
        }).findOne()) {
            return true;
        }

        return false;
    },

    getDesc() {
        let tag = Common.id('desc').isVisibleToUser(true).findOne();
        return tag.text();
    },

    getNickname() {
        //com.ss.android.ugc.aweme:id/title
        let tag = Common.id('title').isVisibleToUser(true).findOne();
        return tag.text() && tag.text().replace('@', '');
    },

    getTimeTag() {
        return UiSelector().descContains('发布时间：').isVisibleToUser(true).findOne();
    },

    getTime() {
        let now = new Date();
        let incSecond = 0;

        let timeTag = this.getTimeTag();
        if (!timeTag) {
            return 0;
        }

        let timeDesc = timeTag.desc();
        let times = timeDesc.split('发布时间：');
        let time = times[1];
        console.log(time);

        if (time.indexOf('分钟前') !== -1) {
            incSecond = parseInt(time) * 60;

        } else if (time.indexOf('小时前') !== -1) {
            incSecond = parseInt(time) * 3600;

        } else if (time.indexOf('刚刚') !== -1) {
            incSecond = 0;

        } else if (time.indexOf('天前') !== -1) {
            incSecond = parseInt(time) * 86400;

        } else if (time.indexOf('昨天') !== -1) {
            let t = time.replace('昨天', '').split(':');
            incSecond =
                86400 -
                // @ts-ignore
                t[0] * 3600 -
                // @ts-ignore
                t[1] * 60 +
                now.getHours() * 3600 +
                now.getMinutes() * 60;
        } else if (/^\d{4}年\d{1,2}月\d{1,2}日$/.test(time)) {
            let formatted = time
                .replace('年', '-')
                .replace('月', '-')
                .replace('日', '');
            incSecond = new Date(formatted).getTime() / 1000;
        } else if (/^\d{1,2}月\d{1,2}日$/.test(time)) {
            const year = now.getFullYear();
            let formatted =
                year +
                '-' +
                time.replace('月', '-').replace('日', '');
            incSecond = new Date(formatted).getTime() / 1000;
        }

        return Math.floor(Date.now() / 1000) - incSecond;
    },

    getIp() {
        let tag = Common.id('qeq').isVisibleToUser(true).findOne();
        if (!tag || !tag.desc()) {
            return null;
        }

        let tmp = tag.desc().split('m');
        if (tmp && tmp.length == 2) {
            return tmp[1];
        }

        return tmp[0].replace('null', '');
    }
}


let task = {
    //cfg是指对视频的操作
    dealCommentVideo(cfg) {

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
            Gesture.back();
            System.sleep(1000 + Math.random() * 500);
            return;
        }

        return Comment.commentMsg(msg, atName, img);
    },

    //cfg是指对评论用户的相关操作
    dealComments(nickname, cfg, backCfg) {
        while (true) {
            if (cfg) {
                let comments = Comment.getList();
                for (let k in comments) {
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
                        Common.log('进入用户页异常处理：', e);
                        continue;
                    }
                    //私密账号
                    if (User.isPrivate()) {
                        Gesture.back();
                        System.sleep(500);
                        Common.log('私密账号');
                        continue;
                    }

                    if (cfg.gender && !Common.contains(User.getGender(), cfg.gender)) {
                        Common.log('性别不匹配');
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
                        Gesture.back();
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
                        Gesture.back();
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
                                let msg = cfg.commentMsg[Math.floor(Math.random() * cfg.commentMsg.length)];
                                let atName = cfg.videoCommentAtNames[Math.floor(Math.random() * cfg.videoCommentAtNames.length)];
                                let img = cfg.videoCommentImages[Math.floor(Math.random() * cfg.videoCommentImages.length)];
                                Comment.commentMsg(msg, atName, img);///////////////////////////////////操作  评论视频
                                System.sleep(1500 + 2000 * Math.random());
                                Common.log('评论了');
                                Gesture.back();//视频页面回到用户页面
                            }
                            Gesture.back();//从视频页面到用户页面
                        }
                    } catch (e) {
                        Common.log('异常了', e);
                        System.sleep(2000);
                        User.backHome();
                    }

                    Gesture.back();
                    System.setAccessibilityMode('fast');
                    System.sleep(1000);
                }
            }

            if (backCfg) {
                let comments = Comment.getList();
                for (let k in comments) {
                    if (backCfg.keywords && (!comments[k]['content'] || !Common.contains(comments[k]['content'], backCfg.keywords))) {
                        Common.log('数据：', comments[k]['content'], backCfg.keywords);
                        continue;
                    }

                    if (backCfg.ip && comments[k].ip && !Common.contains(comments[k].ip, backCfg.ip)) {
                        Common.log('IP不匹配', comments[k].ip, backCfg.ip);
                        continue;
                    }

                    //评论时间处理
                    if (backCfg.minDay && comments[k].time / 86400 > backCfg.minDay) {
                        Common.log('时间不匹配', comments[k].time / 86400, backCfg.minDay);
                        continue;
                    }

                    if (Storage.getBoolean('task_dy_toker_comment_back_' + nickname + '_' + comments[k].nickname)) {
                        Common.log('重复');
                        continue;
                    }

                    Common.log('找到了关键词', comments[k]['content']);
                    Storage.putBoolean('task_dy_toker_comment_back_' + nickname + '_' + comments[k].nickname, true);

                    let backTag = comments[2].tag.children().findOne(UiSelector().text('回复'));
                    if (backTag) {
                        backTag.click();
                        System.sleep(1500);
                        let msg = backCfg.comments[Math.floor(Math.random() * backCfg.comments.length)];
                        let atName = backCfg.atUserNames[Math.floor(Math.random() * backCfg.atUserNames.length)];
                        let img = backCfg.comentImages[Math.floor(Math.random() * backCfg.comentImages.length)];
                        Comment.commentMsg(msg, atName, img);///////////////////////////////////操作  回复评论
                        Common.log('回复了评论');
                        System.sleep(1000);
                    }
                }
            }

            Common.log('下一页评论');
            if (!Common.swipeCommentListOp()) {
                Gesture.back();
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
        if (ip && config.videoIp && !Common.contains(ip, config.videoIp)) {
            Common.log('不在指定IP范围，跳过操作视频', ip);
            return;
        }

        let desc = Dy.getDesc();
        Common.log('视频描述', desc);
        if (config.videoKeywords && !Common.contains(desc, config.videoKeywords) && config.videoWaitSecond > 0) {
            Common.log('找到关键词，等待', config.videoWaitSecond, '秒');
            let nextVideo = FloatDialogs.confirm('不包含关键词提示', 5 + '秒后关闭，执行下一个作品', '下一个作品', '操作当前作品', (dialog) => {
                let i = 0;
                while (i++ < 5) {
                    System.sleep(1000);
                    dialog.setContent((5 - i) + '秒后关闭，执行下一个作品');
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
        let isOpenComment = false;
        if (config.comment) {
            System.sleep(1500);
            this.dealComment(config.comment);
            isOpenComment = true;
        }

        if (config.commentUser || config.backComment) {
            System.sleep(1500);
            if (!isOpenComment) {
                Video.openComment(!!Video.getCommentCount());
            }
            this.dealComments(nickname, config.commentUser, config.backComment);
        }

        Comment.closeCommentWindow();
        System.sleep(1000);
        Log.log('关闭评论区');
    },
    run(config) {
        while (true) {
            this.dealVideo(config);
            Video.next(true);
            System.sleep(2000 + Math.random() * 1000);
        }
    }
}

let config = {
    VideoType: Storage.get('toker_run_mode'),
    videoIp: Storage.get('toker_video_ip').replace(/\，/g, ',').split(','),
    videoKeywords: Storage.get('toker_video_keywords').replace(/\，/g, ',').split(','),
    videoWaitSecond: Storage.getInteger('toker_wait_second'),
    comment: Storage.getBoolean('toker_comments') ? {
        commentRate: Storage.getInteger('toker_comment_rate') / 100,
        commentTypes: Storage.getArray('toker_comment_type'),
        commentAtNames: Storage.get('toker_comment_at_name').split('@'),
        commentContents: Storage.get('toker_comment_content').split("\n\n"),
        commentImages: Storage.getArray('toker_comment_images'),
    } : null,
    commentUser: Storage.getBoolean('toker_comment_setting') ? {
        ip: Storage.get('toker_comment_setting_video_ip').replace(/\，/g, ',').split(','),
        keywords: Storage.get('toker_comment_setting_keywords').replace(/\，/g, ',').split(','),
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
        ip: Storage.get('toker_back_comment_ip').replace(/\，/g, ',').split(','),
        keywords: Storage.get('toker_back_comment_keywords').replace(/\，/g, ',').split(','),
        minDay: Storage.getInteger('toker_back_comment_min_day'),
        type: Storage.getArray('toker_back_comment_type'),
        comentImages: Storage.getArray('toker_back_comment_images'),
        comments: Storage.get('toker_back_comment_content').split("\n\n"),
        atUserNames: Storage.get('toker_back_comment_at_user').replace(/\，/g, ',').split(','),
    } : null,
}

try {
    Common.log('配置：', config);
    task.run(config);
} catch (e) {
    Common.log('异常处理：', e, e.message);
}
