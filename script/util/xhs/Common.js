const Common = {
    //封装的方法
    logs: [],
    id(name) {
        return UiSelector().id('com.xingin.xhs:id/' + name);
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
        return 'com.xingin.xhs';
    },

    backHome() {
        this.openApp();
        let i = 0;
        while (i++ < 5) {
            let homeTag = UiSelector().className('android.widget.ImageView').desc('菜单').isVisibleToUser(true).findOnce();
            if (!homeTag) {
                this.back();
                this.sleep(2000);
                continue;
            }
            Log.log("找到了homeTag");
            break;
        }
        return true;
    },

    backHomeOnly() {
        let i = 0;
        while (i++ < 5) {
            let homeTag = UiSelector().className('android.widget.ImageView').desc('菜单').isVisibleToUser(true).findOnce();
            if (!homeTag) {
                Log.log(UiSelector().className('android.widget.ImageView').desc('菜单').findOnce());
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

    gClick(x, y) {
        Log.log('点击位置：', x, y);
        Gesture.click(x, y);
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
            this.gClick(tag.bounds().left + tag.bounds().width() * Math.random(), (tag.bounds().top + 1) + (topY - 1) * Math.random());
            return true;
        }

        if (tag.bounds().top < bottom && tag.bounds().top + tag.bounds().height() >= bottom) {
            let topY = bottom - tag.bounds().top;
            this.gClick(tag.bounds().left + tag.bounds().width() * Math.random(), tag.bounds().top + (topY - 1) * Math.random());
            return true;
        }
        return false;
    },

    openApp() {
        App.launch('com.xingin.xhs');//打开app
        this.sleep(8000);
    },

    backApp() {
        App.backApp();
    },


    log() {
        //这里需要做日志记录处理
        Log.log(arguments);
    },

    back(i, time, randTime) {
        if (i === undefined) {
            i = 1;
        }
        while (i--) {
            Gesture.back();
            if (!time) {
                this.sleep(700 + Math.random() * 200);
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
        text = /[\d\.]+[\w|万]*/.exec(text);
        if (!text) {
            return 0;
        }

        if (text[0].indexOf('w') !== -1 || text[0].indexOf('W') !== -1 || text[0].indexOf('万') !== -1) {
            text[0] = text[0].replace('w', '').replace('W', '').replace('万', '') * 10000;
        }
        return text[0] * 1;
    },

    //关键词拆分
    splitKeyword(keyword) {
        keyword = keyword.replace(/，/g, ',');
        keyword = keyword.split(',');
        let ks = [];
        for (let i in keyword) {
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
}

module.exports = Common;
