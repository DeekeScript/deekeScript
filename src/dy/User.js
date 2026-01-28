let Common = require('./Common');
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

module.exports = User;
