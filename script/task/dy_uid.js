let Common = require('../util/dy/Common');
let machine = require('../common/machine');

let dy = {
    debug: false,
    showUserTag() {
        let scrollTag = UiSelector().className('android.widget.HorizontalScrollView').scrollable(true).findOne();
        let userTag;
        let i = 0;
        do {
            userTag = UiSelector().id('android:id/text1').text('用户').isVisibleToUser(true).filter(v => {
                return v.bounds().left < Device.width() * 0.7;
            }).findOne();
            if (userTag) {
                Common.log('找到用户tab');
                Common.log(userTag);
                break;
            }
            // scrollTag.scrollForward();

            Gesture.swipe(Device.width() * (0.7 + 0.1 * Math.random()), scrollTag.bounds().centerY() + 20 * Math.random(), scrollTag.bounds().left + Device.width() * (0.2 + 0.1 * Math.random()), scrollTag.bounds().centerY(), 400 + 100 * Math.random());
            Common.sleep(500 + 500 * Math.random());
            Common.log('没有找到”用户“tab，滑动');
        } while (!userTag || i++ < 3);
        return userTag;
    },

    fansCountShow(type) {
        let text = ['不限', '1000以下', '1000-1w', '1w-10w', '10w-100w', '100w以上'][type];
        let scrollTags = UiSelector(false).className('androidx.recyclerview.widget.RecyclerView').scrollable(true).find();
        let fansCountTag;
        let i = 0;
        do {
            fansCountTag = UiSelector(false).text(text).isVisibleToUser(true).findOne();
            if (fansCountTag) {
                Common.log("找到了fansCountTag");
                break;
            }
            scrollTags[0].scrollForward();
            Common.sleep(500 + 500 * Math.random());
            Common.log('没有找到fansCountTag，滑动');
        } while (!fansCountTag || i++ < 3);
        if (!fansCountTag) {
            throw new Error('没有找到fansCountTag');
        }
        return fansCountTag;
    },

    userTypeShow(type) {
        let text = ['不限', '普通用户', '企业认证', '个人认证'][type];
        let scrollTags = UiSelector(false).className('androidx.recyclerview.widget.RecyclerView').scrollable(true).find();
        let userTypeTag;
        let i = 0;
        do {
            userTypeTag = UiSelector(false).text(text).isVisibleToUser(true).findOne();
            if (userTypeTag) {
                Common.log('找到了userTypeTag');
                break;
            }
            scrollTags[1].scrollForward();
            Common.sleep(500 + 500 * Math.random());
            Common.log('没有找到userTypeTag，滑动');
        } while (!userTypeTag || i++ < 3);
        if (!userTypeTag) {
            throw new Error('没有找到userTypeTag');
        }
        return userTypeTag;
    },
    searchKeyword(keyword) {
        let searchTag = UiSelector().desc('搜索').isVisibleToUser(true).findOne();
        if (searchTag) {
            Common.log('找到了搜索按钮');
            Common.click(searchTag, 0.2);
            Common.sleep(1500 + 1000 * Math.random());
        }

        let iptTag = UiSelector().className('android.widget.EditText').isVisibleToUser(true).editable(true).findOne();
        if (iptTag) {
            Common.log('找到了输入框');
            Common.click(iptTag, 0.25);
            Common.sleep(1500 + 1000 * Math.random());
        }

        iptTag = UiSelector().className('android.widget.EditText').isVisibleToUser(true).editable(true).findOne();
        if (iptTag) {
            Common.log('找到了输入框2');
            iptTag.setText(keyword);
            Common.sleep(1500 + 1000 * Math.random());
        }

        let searchBtnTag = UiSelector().desc('搜索').isVisibleToUser(true).findOne();
        if (searchBtnTag) {
            Common.log('找到了搜索按钮2');
            Common.click(searchBtnTag, 0.2);
            Common.sleep(2000 + 2000 * Math.random());
        }

        let userTag = this.showUserTag();
        if (userTag) {
            Common.log('找到了用户tab');
            Common.click(userTag, 0.2);
            Common.sleep(2000 + 2000 * Math.random());
        }

        let filterTag = UiSelector().descContains('筛选').findOne();
        if (filterTag) {
            Common.log('找到了筛选按钮');
            Common.click(filterTag, 0.3);
            Common.sleep(2000 + 2000 * Math.random());
            return true;
        }

        return false;
    },
    searchUser(keyword, config) {
        if (!this.searchKeyword(keyword)) {
            throw new Error('没有找到搜索内容');
        }

        let fansUserTag = this.fansCountShow(config.fansType);
        if (fansUserTag) {
            Common.log('找到了fansUserTag');
            Common.click(fansUserTag, 0.2);
            Common.sleep(2000 + 2000 * Math.random());
        }

        let userTypeTag = this.userTypeShow(config.userType);
        if (userTypeTag) {
            Common.log('找到了userTypeTag');
            Common.click(userTypeTag, 0.2);
            Common.sleep(2000 + 2000 * Math.random());
            Gesture.click(Device.width() * (0.2 + 0.6 * Math.random()), Device.height() * (0.6 + 0.3 * Math.random()));
            //判断是否点击成功，如果没有成功，再点击一次
            Common.sleep(1000 + 1000 * Math.random());
            if (UiSelector(false).text('用户类型').isVisibleToUser(true).findOne()) {
                Common.log('没有点击成功，再来一次');
                Gesture.click(Device.width() * (0.2 + 0.6 * Math.random()), Device.height() * (0.6 + 0.3 * Math.random()));
                Common.sleep(1000 + 1000 * Math.random());
            }
        }
    },

    privateMsg(msg) {
        let moreTag = UiSelector().descContains('更多').filter(v => {
            // @ts-ignore
            return v.desc() == '更多' && v.getHintText() == '按钮' && v.bounds().top < Device.height() / 4;
        }).isVisibleToUser(true).findOne();
        if (!moreTag) {
            Common.log('没有更多按钮');
            return false;
        }
        Common.click(moreTag, 0.3);
        Common.sleep(1000 + 1000 * Math.random());

        let sendMsgTag = UiSelector().className('android.widget.TextView').textContains('发私信').filter(v => {
            return v.bounds().top > Device.height() / 2;
        }).isVisibleToUser(true).findOne();
        if (!sendMsgTag) {
            Common.log("没有找到发送私信按钮");
            return false;
        }

        Common.click(sendMsgTag, 0.2);
        Common.sleep(2000 + 1000 * Math.random());

        let iptTag = UiSelector().className('android.widget.EditText').filter(v => {
            return v.isEditable();
        }).isVisibleToUser(true).findOne();
        if (!iptTag) {
            Common.log("没有找到发送私信输入框");
            return false;
        }

        Common.click(iptTag, 0.2);
        Common.sleep(1000 + 1000 * Math.random());

        iptTag = UiSelector().className('android.widget.EditText').filter(v => {
            // @ts-ignore
            return v.isEditable() && v.isFocused();
        }).isVisibleToUser(true).findOne();
        if (!iptTag) {
            Common.log('没有找到点击后的输入框');
            return true;
        }

        iptTag.setText(msg);
        Common.sleep(1000 + 1000 * Math.random());
        let btnTag = UiSelector().className('android.widget.ImageView').desc('发送').isVisibleToUser(true).findOne();
        if (!btnTag) {
            Common.log('没有找到发送按钮');
            return false;
        }
        if (this.debug) {
            Common.sleep(1000 + 1000 * Math.random());
            Common.back(2);
            Common.log('消息已发送', msg);
            return true;
        }
        Common.click(btnTag, 0.25);
        Common.sleep(1000 + 1000 * Math.random());
        Common.back(2);
        Common.log('消息已发送', msg);
        return true;
    },

    userListForward() {
        let tag = UiSelector().className('androidx.recyclerview.widget.RecyclerView').filter(v => {
            return v.bounds().width() > Device.width() / 2;
        }).scrollable(true).findOne();
        Common.log('滑动列表');
        return tag.scrollForward();
    }
}

let task = {
    startTime: Date.parse(new Date()) / 1000,
    getMsg(type) {
        return machine.getMsg(type) || false;//永远不会结束
    },

    getConfig() {
        //console.log(Storage.getString('toker_dy_uids'));
        return {
            keywords: Storage.getString('toker_dy_keywords'),
            address: Storage.getString('toker_dy_address'),
            shops: Storage.getString('toker_dy_shop'),
            second: Storage.getInteger('toker_dy_second'),
            privateCount: Storage.getInteger('toker_dy_private_count'),
            fansType: Storage.getString("toker_dy_fans_count"),
            userType: Storage.getString("toker_dy_type"),
            runMinute: Storage.getInteger('toker_dy_run_minute'),
            sleepMinute: Storage.getInteger('toker_dy_sleep_minute'),
        }
    },

    backList() {
        let rp = 0;
        let userTabTag = UiSelector().id('android:id/text1').text('用户').isVisibleToUser(true).findOne();
        while (!userTabTag) {
            Common.back();
            Common.log('不在列表页面，返回', !userTabTag);
            if (rp++ > 3) {
                throw new Error('重新开始');
            }
            Common.sleep(1200 + 800 * Math.random());
            userTabTag = UiSelector().id('android:id/text1').text('用户').isVisibleToUser(true).findOne();
        }
        return userTabTag;
    },

    ops: [],

    opUserList(config) {
        let tag = UiSelector().text('搜索结果为空').isVisibleToUser(true).findOne();
        if (tag) {
            return false;
        }

        while (true) {
            let userListTag = UiSelector().className('com.lynx.tasm.behavior.ui.LynxFlattenUI').descContains('粉丝:').isVisibleToUser(true).find();
            for (let i in userListTag) {
                //检测是不是在列表页，不是则返回
                Common.log('执行第N个', i);
                let userTabTag = this.backList();

                Common.log(Date.parse(new Date()) / 1000 - this.startTime, config.runMinute * 60);
                if (Date.parse(new Date()) / 1000 - this.startTime > config.runMinute * 60) {
                    Common.sleep(config.sleepMinute * 60 * 1000);
                    Common.log('休眠');
                    this.startTime = Date.parse(new Date()) / 1000;
                    return 1;
                }

                let userTag = userListTag[i];
                let title = userTag.text();
                if ((config.userType == '2' || config.userType == '3') && title.indexOf('抖音号') != -1) {
                    Common.sleep(1000 + 1000 * Math.random());
                    Common.log('带有抖音号的用户');
                    continue;
                }
                if (this.ops.includes(title)) {
                    Common.sleep(1000 + 1000 * Math.random());
                    Common.log('重复用户');
                    continue;
                }

                let bottom = userTabTag.parent().parent().bounds().top + userTabTag.parent().parent().bounds().height();
                if (userTag.bounds().top <= bottom) {
                    let btn = userTag.bounds().top + userTag.bounds().height();
                    if (btn > bottom + 10) {
                        Gesture.click(userTag.bounds().left + Math.random() * userTag.bounds().width(), btn - 10 * Math.random());
                        Common.log('点击用户1');
                    } else {
                        Common.log('超出范围');
                        continue;
                    }
                } else {
                    Common.click(userTag, 0.2);
                    Common.log('点击用户2');
                }

                Common.sleep(3000 + 3000 * Math.random());
                if (UiSelector().id('android:id/text1').text('用户').isVisibleToUser(true).findOne()) {
                    Common.log('没有进入用户主页');
                    Common.sleep(1000 + 1000 * Math.random());
                    continue;
                }

                if (!UiSelector().text('本店团购').isVisibleToUser(true).findOne()) {
                    Common.log('没有团购');
                    Common.back();
                    Common.sleep(500 + 1000 * Math.random());
                    continue;
                }

                let tags = UiSelector().filter(v => {
                    return !!v.desc();
                }).isVisibleToUser(true).find();
                let douyinAccount = tags[2].desc();
                if (Storage.getBoolean('dy_uid_' + douyinAccount)) {
                    Common.back();
                    Common.log('用户已存在');
                    Common.sleep(1000 + 1000 * Math.random());
                    continue;
                }

                dy.privateMsg(this.getMsg(1));
                // Common.back();这里不用返回
                Common.log('返回到列表');
                Storage.putBoolean('dy_uid_' + douyinAccount, true);
                if (--config.privateCount <= 0) {
                    return true;
                }

                this.ops.push(title);
                if (config.second == 0) {
                    config.second = 1;
                }
                Common.log('开始停顿', config.second);
                Common.sleep((config.second + config.second * Math.random()) * 1000);
                Common.log('停顿结束');
            }

            this.backList();
            Common.sleep(1000 + 1000 * Math.random());

            if (!dy.userListForward()) {
                throw new Error("滑动失败");
            }
            Common.log('列表滑动成功');
            Common.sleep(2000 + 1200 * Math.random());
        }
    },

    getKeyword(config) {
        if (config.keywords.trim() != '') {
            let keywords = config.keywords.split("\n");
            let keywordsIndex = Math.floor(Math.random() * keywords.length);
            return keywords[keywordsIndex].replace("\r", "");
        }
        let address = config.address.split("\n");
        let shops = config.shops.split("\n");
        let addressIndex = Math.floor(Math.random() * address.length);
        let shopIndex = Math.floor(Math.random() * shops.length);
        return address[addressIndex].replace("\r", "") + shops[shopIndex].replace("\r", "");
    },

    run() {
        let config = task.getConfig();
        let keyword = this.getKeyword(config);
        Common.log('配置', config, keyword);
        System.toast("即将搜索关键词：" + keyword);
        System.sleep(2000);

        Common.openApp();
        dy.searchUser(keyword, config);
        return this.opUserList(config);
    }
}

while (true) {
    try {
        let res = task.run();
        if (res === true) {
            FloatDialogs.show('任务完成');
            System.exit();
        } else if (res === 1) {
            Common.log('休眠时间');
            Common.backHomeOnly();
            continue;
        }
    } catch (e) {
        Common.backHomeOnly();
        Common.log('出错了', e.stack);
    }
}
