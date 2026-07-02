
let cStorage = require('../../common/storage.js');

const Common = {
    //封装的方法
    logs: [],
    filter(v) {
        return v && v.bounds() && v.bounds().top >= 0 && v.bounds().left >= 0 && v.bounds().width() > 0 && v.bounds().height() > 0;
    },
    id(name) {
        return UiSelector().id('com.tencent.mm:id/' + name);
    },

    aId(name) {
        //android:id/text1
        return UiSelector().id('android:id/' + name);
    },

    sleep(time) {
        time > 200 ? Log.log("js休眠时间：" + time) : null;
        System.sleep(time);
    },

    packageName() {
        return 'com.tencent.mm';
    },

    clickRange(tag, top, bottom) {
        if (tag.bounds().top + tag.bounds().height() <= top) {
            return false;
        }

        if (tag.bounds().top >= bottom) {
            return false;
        }

        if (tag.bounds().top > top && tag.bounds().top + tag.bounds().height() < bottom) {
            this.click(tag);
            return true;
        }

        //卡在top的上下
        if (tag.bounds().top <= top && tag.bounds().top + tag.bounds().height() > top) {
            let topY = tag.bounds().top + tag.bounds().height() - top;
            Gesture.click(tag.bounds().left + tag.bounds().width() * Math.random(), (tag.bounds().top + 1) + (topY - 1) * Math.random());
            return true;
        }

        if (tag.bounds().top < bottom && tag.bounds().top + tag.bounds().height() >= bottom) {
            let topY = bottom - tag.bounds().top;
            Gesture.click(tag.bounds().left + tag.bounds().width() * Math.random(), tag.bounds().top + (topY - 1) * Math.random());
            return true;
        }
        return false;
    },

    backHome() {
        this.openApp();
        let i = 0;
        while (i++ < 5) {
            let homeTag = this.id('icon_tv').text('微信').findOnce();
            if (!homeTag || !homeTag.parent() || !homeTag.parent().isVisibleToUser()) {
                Log.log(this.id('icon_tv').text('微信').findOnce());
                this.back();
                this.sleep(1000);
                continue;
            }
            Log.log("找到了homeTag");
            break;
        }
        return true;
    },

    click(tag, rate) {
        if (!rate) {
            rate = 0.05;
        }

        let p = 1 - rate * 2;
        let width = tag.bounds().width() * rate + Math.random() * (tag.bounds().width() * p);
        let height = tag.bounds().height() * rate + Math.random() * (tag.bounds().height() * p);

        try {
            Gesture.click(tag.bounds().left + Math.round(width), tag.bounds().top + Math.round(height));
        } catch (e) {
            this.log(e);
            try {
                Gesture.click(tag.bounds().left + Math.round(width), tag.bounds().top);
            } catch (e) {
                this.log(e);
                return false;
            }
        }

        this.sleep(500);
        return true;
    },

    openApp() {
        App.launch('com.tencent.mm');//打开抖音
        this.sleep(8000);
    },

    backApp() {
        App.backApp();
    },


    log() {
        //这里需要做日志记录处理
        Log.log(arguments);
        console.log(arguments);
    },

    back(i, time, randTime) {
        if (i === undefined) {
            i = 1;
        }
        while (i-- > 0) {
            Gesture.back();
            if (!time) {
                this.sleep(1100 + Math.random() * 200);
                continue;
            }

            if (randTime) {
                this.sleep(time + randTime * Math.random());
                continue;
            }
            this.sleep(time);
        }
        this.log('back ' + i);
    },

    numDeal(text) {
        text = /[\d\.\,]+[\w|万|亿]*/.exec(text);
        if (!text) {
            return 0;
        }

        text[0] = text[0].replace(',', '').replace(',', '').replace(',', '');
        if (text[0].indexOf('w') !== -1 || text[0].indexOf('万') !== -1) {
            text[0] = text[0].replace('w', '').replace('万', '') * 10000;
        } else if (text[0].indexOf('亿') !== -1) {
            text[0] = text[0].replace('亿', '') * 100000000;
        }

        Log.log('数字：', text[0]);
        return text[0] * 1;//可能存在多个逗号
    },

    swipe(type, sensitivity) {
        let left = Math.random() * Device.width() * 0.8 + Device.width() * 0.2;
        let bottom = Device.height() * 2 / 3 * sensitivity + Device.height() / 6 * Math.random();
        let top = Device.height() / 12 + Device.height() / 12 * Math.random();
        if (!type) {
            Gesture.swipe(left, bottom, left, top, 200 + 100 * Math.random());//从下往上推，清除
            return true;
        }
        Gesture.swipe(left, top, left, bottom, 200 + 100 * Math.random());//从上往下滑
    },

    swipeCommentListOp() {
        let tag = UiSelector().className('androidx.recyclerview.widget.RecyclerView').filter(v => {
            return v.bounds().height() < Device.height();
        }).scrollable(true).isVisibleToUser(true).findOnce();
        if (tag) {
            return tag.scrollForward();
        } else {
            Log.log('滑动失败');
        }
        return false;
    },

    //关闭弹窗
    closeAlert(type) {
        this.log('开启线程监听弹窗');
    },

    sleepFunc(func, time, randomTime) {
        if (!randomTime) {
            randomTime = 0;
        }
        func();
        this.sleep(time + randomTime * Math.random());
    },

    toast(msg, time, randomTime) {
        if (!randomTime) {
            randomTime = 0;
        }

        //toast(msg);
        this.log(msg);
        if (time) {
            this.sleep(time + randomTime * Math.random());
        }
    },

    showToast(msg) {
        System.toast(msg);
        Log.log(msg);
    },

    //关键词拆分
    splitKeyword(keyword) {
        keyword = keyword.replace(/，/g, ',');
        keyword = keyword.split(',');
        let ks = [];
        for (let i in keyword) {
            if (keyword[i] == '') {
                continue;
            }

            let tmp = keyword[i];
            if (keyword[i].indexOf('&') !== -1) {
                tmp = keyword[i].split('&');
            } else if (keyword[i].indexOf('+') !== -1) {
                tmp = keyword[i].split('+');
            }
            ks.push(tmp);
        }
        return ks;
    },

    containsWord(contain, title) {
        contain = this.splitKeyword(contain);
        for (let con of contain) {
            if (typeof (con) === 'string' && title.indexOf(con) !== -1) {
                return [con];
            }

            if (typeof (con) === 'object') {
                let _true = true;
                for (let i in con) {
                    if (title.indexOf(con[i]) === -1) {
                        _true = false;
                    }
                }
                if (_true) {
                    return con;
                }
            }
        }
        return false;
    },

    noContainsWord(noContain, title) {
        noContain = this.splitKeyword(noContain);
        for (let con of noContain) {
            if (typeof (con) === 'string' && title.indexOf(con) !== -1) {
                return false;
            }

            if (typeof (con) === 'object') {
                let len = 0;
                for (let i in con) {
                    if (title.indexOf(con[i]) !== -1) {
                        len++;
                    }
                }
                if (len === con.length) {
                    return false;
                }
            }
        }
        return noContain;
    },

    playAudio(file) {
        media.playMusic(file);
    },

    getRemark(remark) {
        return remark.indexOf('#') == 0 || remark.indexOf('＃') == 0;
    },

    /**
     * 
     * @param {any} date 
     * @returns 
     */
    format(date) {
        const pad = n => String(n).padStart(2, '0');
        let res = date.getFullYear() + '-' +
            pad(date.getMonth() + 1) + '-' +
            pad(date.getDate()) + ' ' +
            pad(date.getHours()) + ':' +
            pad(date.getMinutes()) + ':' +
            pad(date.getSeconds());
        Common.log('朋友圈发布时间：' + res);
        return res;
    },

    /**
     * 
     * @param {string} publishTime 
     * @returns 
     */
    getTime(publishTime) {
        let now = new Date();
        // 刚刚
        if (publishTime === '刚刚') {
            return this.format(now);
        }

        // xx分钟前
        let match = publishTime.match(/^(\d+)分钟前$/);
        if (match) {
            let date = new Date(now.getTime() - parseInt(match[1]) * 60 * 1000);
            return this.format(date);
        }

        // xx小时前
        match = publishTime.match(/^(\d+)小时前$/);
        if (match) {
            let date = new Date(now.getTime() - parseInt(match[1]) * 60 * 60 * 1000);
            return this.format(date);
        }

        // 昨天 HH:mm
        match = publishTime.match(/^昨天\s*(\d{1,2}):(\d{1,2})$/);
        if (match) {
            let date = new Date();
            date.setDate(date.getDate() - 1);
            date.setHours(parseInt(match[1]), parseInt(match[2]), 0, 0);
            return this.format(date);
        }

        // 前天 HH:mm
        match = publishTime.match(/^前天\s*(\d{1,2}):(\d{1,2})$/);
        if (match) {
            let date = new Date();
            date.setDate(date.getDate() - 2);
            date.setHours(parseInt(match[1]), parseInt(match[2]), 0, 0);
            return this.format(date);
        }

        // xx天前
        match = publishTime.match(/^(\d+)天前$/);
        if (match) {
            let date = new Date(now.getTime() - parseInt(match[1]) * 24 * 60 * 60 * 1000);
            return this.format(date);
        }

        // MM月dd日 HH:mm
        match = publishTime.match(/^(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{1,2})$/);
        if (match) {
            let date = new Date();
            date.setMonth(parseInt(match[1]) - 1);
            date.setDate(parseInt(match[2]));
            date.setHours(parseInt(match[3]), parseInt(match[4]), 0, 0);

            return this.format(date);
        }

        // yyyy年MM月dd日 HH:mm
        match = publishTime.match(/^(\d{4})年(\d{1,2})月(\d{1,2})日\s*(\d{1,2}):(\d{1,2})$/);
        if (match) {
            let date = new Date(
                parseInt(match[1]),
                parseInt(match[2]) - 1,
                parseInt(match[3]),
                parseInt(match[4]),
                parseInt(match[5]),
                0
            );

            return this.format(date);
        }

        return publishTime;
    }
}

module.exports = Common;
