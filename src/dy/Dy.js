let Common = require('./Common');
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

module.exports = Dy;
