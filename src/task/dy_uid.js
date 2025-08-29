let Common = require('../util/dy/Common');
let machine = require('../common/machine');
const { get } = require('../common/storage');
const { config } = require('process');
let dy = {
    showUserTag() {
        let scrollTag = UiSelector().className('android.widget.HorizontalScrollView').scrollable(true).findOne();
        let userTag;
        let i = 0;
        do {
            let userTag = UiSelector().id('android:id/text1').text('用户').isVisibleToUser(true).filter(v => {
                return v.bounds().left < Device.width() * 0.7;
            }).findOne();
            if (userTag) {
                console.log(userTag);
                break;
            }
            scrollTag.scrollForward();
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
                console.log(fansCountTag);
                break;
            }
            scrollTags[0].scrollForward()
        } while (!fansCountTag || i++ < 3);
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
                console.log(userTypeTag);
                break;
            }
            scrollTags[1].scrollForward()
        } while (!userTypeTag || i++ < 3);
        return userTypeTag;
    },
    searchKeyword(keyword) {
        let searchTag = UiSelector().desc('搜索').isVisibleToUser(true).findOne();
        if (searchTag) {
            Common.click(searchTag, 0.2);
            Common.sleep(2000 + 2000 * Math.random());
        }

        let iptTag = UiSelector().className('android.widget.EditText').isVisibleToUser(true).editable(true).findOne();
        if (iptTag) {
            Common.click(iptTag, 0.1);
            Common.sleep(2000 + 2000 * Math.random());
        }

        iptTag = UiSelector().className('android.widget.EditText').isVisibleToUser(true).editable(true).findOne();
        if (iptTag) {
            iptTag.setText(keyword);
            Common.sleep(2000 + 2000 * Math.random());
        }

        let searchBtnTag = UiSelector().desc('搜索').isVisibleToUser(true).findOne();
        if (searchBtnTag) {
            Common.click(searchBtnTag, 0.2);
            Common.sleep(2000 + 2000 * Math.random());
        }

        let userTag = this.showUserTag();
        if (userTag) {
            Common.click(userTag, 0.2);
            Common.sleep(2000 + 2000 * Math.random());
        }

        let filterTag = UiSelector().descContains('筛选').findOne();
        if (filterTag) {
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
            Common.click(fansUserTag, 0.2);
            Common.sleep(2000 + 2000 * Math.random());
        }

        let userTypeTag = this.userTypeShow(config.userType);
        if (userTypeTag) {
            Common.click(userTypeTag, 0.2);
            Common.sleep(2000 + 2000 * Math.random());
        }

        let filterTag = UiSelector().descContains('筛选').findOne();
        if (filterTag) {
            Common.click(filterTag, 0.3);
            Common.sleep(2000 + 2000 * Math.random());
        }
    },

    privateMsg(msg) {
        let moreTag = UiSelector().descContains('更多').filter(v => {
            // @ts-ignore
            return v.desc() == '更多' && v.getHintText() == '按钮' && v.bounds().top < Device.height() / 4;
        }).isVisibleToUser(true).findOne();
        if (!moreTag) {
            Log.log('没有更多按钮');
            return false;
        }
        Common.click(moreTag, 0.3);
        Common.sleep(1000 + 1000 * Math.random());

        let sendMsgTag = UiSelector().className('android.widget.TextView').textContains('发私信').filter(v => {
            return v.bounds().top > Device.height() / 2;
        }).isVisibleToUser(true).findOne();
        if (!sendMsgTag) {
            Log.log("没有找到发送私信按钮");
            return false;
        }

        Common.click(sendMsgTag, 0.2);
        Common.sleep(2000 + 1000 * Math.random());

        let iptTag = UiSelector().className('android.widget.EditText').filter(v => {
            return v.isEditable();
        }).isVisibleToUser(true).findOne();
        if (!iptTag) {
            Log.log("没有找到发送私信输入框");
            return false;
        }

        Common.click(iptTag, 0.2);
        Common.sleep(1000 + 1000 * Math.random());

        iptTag = UiSelector().className('android.widget.EditText').filter(v => {
            // @ts-ignore
            return v.isEditable() && v.isFocused();
        }).isVisibleToUser(true).findOne();
        if (!iptTag) {
            Log.log('没有找到点击后的输入框');
            return true;
        }

        iptTag.setText(msg);
        Common.sleep(1000 + 1000 * Math.random());
        let btnTag = UiSelector().className('android.widget.ImageView').desc('发送').isVisibleToUser(true).findOne();
        if (!btnTag) {
            Log.log('没有找到发送按钮');
            return false;
        }
        Common.click(btnTag, 0.25);
        Common.sleep(1000 + 1000 * Math.random());
        Common.back(2);
        Log.log('消息已发送', msg);
        return true;
    }
}

let task = {
    startTime: Date.parse(new Date()) / 1000,
    getMsg(type) {
        return machine.getMsg(type) || false;//永远不会结束
    },

    log() {
        let d = new Date();
        let file = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        let allFile = "log/log-dy-uid-" + file + ".txt";
        Log.setFile(allFile);
    },

    getConfig() {
        //console.log(Storage.getString('toker_dy_uids'));
        return {
            address: Storage.getString('toker_dy_address'),
            shops: Storage.getString('toker_dy_shop'),
            second: Storage.getArray('toker_dy_second'),
            privateCount: Storage.getInteger('toker_dy_private_count'),
            fansType: Storage.getString("toker_dy_fans_count"),
            userType: Storage.getString("toker_dy_type"),
            runMinute: Storage.getInteger('toker_dy_run_minute'),
            sleepMinute: Storage.getInteger('toker_dy_sleep_minute'),
        }
    },

    opUserList(config) {
        let tag = UiSelector().text('搜索结果为空').isVisibleToUser(true).findOne();
        if (tag) {
            return false;
        }

        let userListTag = UiSelector().className('com.lynx.tasm.behavior.ui.LynxFlattenUI').descContains('粉丝:').isVisibleToUser(true).find();
        for (let i in userListTag) {
            if (Date.parse(new Date()) / 1000 - this.startTime > config.runMinute * 60) {
                Common.sleep(config.sleepMinute * 60 * 1000);
                this.startTime = Date.parse(new Date()) / 1000;
                return true;
            }

            let userTag = userListTag[i];
            Common.click(userTag, 0.2);
            Common.sleep(3000 + 3000 * Math.random());

            let tags = UiSelector().filter(v => {
                return !!v.desc();
            }).isVisibleToUser(true).find();
            let douyinAccount = tag[2].desc();
            if (Storage.getBoolean('dy_uid_' + douyinAccount)) {
                Common.back();
                continue;
            }

            dy.privateMsg(this.getMsg(1).msg);
            Storage.putBoolean('dy_uid_' + douyinAccount, true);
            if (--config.privateCount <= 0) {
                return true;
            }
            Common.sleep((config + config * Math.random()) * 1000);
        }
    },

    getKeyword(config) {
        let address = config.address.split("\n");
        let shops = config.shops.split("\n");
        let addressIndex = Math.floor(Math.random() * address.length);
        let shopIndex = Math.floor(Math.random() * shops.length);
        return address[addressIndex].replace("\r", "") + shops[shopIndex].replace("\r", "");
    },

    run() {
        let config = task.getConfig();
        let keyword = this.getKeyword(config);
        Log.log('配置', config, keyword);
        System.toast("即将搜索关键词：" + keyword);
        System.sleep(2000);

        Common.openApp();
        dy.searchUser(keyword, config);
        this.opUserList();
    }
}

while (true) {
    try {
        task.log();
        task.run();
    } catch (e) {
        Log.log('出错了', e);
    }
}
