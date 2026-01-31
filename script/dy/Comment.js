let Common = require('./Common');
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
            let formatted = time.replace('年', '-').replace('月', '-').replace('日', '');
            incSecond = new Date().getTime() / 1000 - new Date(formatted).getTime() / 1000;
        } else if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(time)) {
            incSecond = new Date().getTime() / 1000 - new Date(time).getTime() / 1000;
        } else if (/^\d{1,2}月\d{1,2}日$/.test(time)) {
            const year = now.getFullYear();
            let formatted = year + '-' + time.replace('月', '-').replace('日', '');
            incSecond = new Date().getTime() / 1000 - new Date(formatted).getTime() / 1000;
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
            data = {
                tag: contains[i],
                nickname: this.getNickname(),
                content: this.getContent(),
                isAuthor: this.isAuthor(),
                ip: this.getIp(),
                time: this.getTime(),
            }

            Common.log("评论读取到的数据：", data.nickname, data.content, data.ip, data.time, data.isAuthor);
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

        tag = this.getAvatarTag();
        if (tag.desc()) {
            return tag.desc();
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

    /**
     * 是否已点赞
     * @returns boolean
     */
    isZan(tag) {
        if (!tag) {
            tag = this.getZanTag();
        }

        if (!tag) {
            return false;
        }
        return tag.desc().indexOf('已选中') !== -1;
    },

    /**
     * 点赞
     * @param {Object} data 
     * @returns 
     */
    clickZan(data) {
        let zanTag = this.getZanTag(data.tag);
        zanTag && zanTag.parent() && zanTag.parent().click();
        return true;
    },
}

module.exports = Comment;