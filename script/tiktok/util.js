const tags = require('./tags');

const util = {
    /**
     * @param {string} filename
     */
    setLog(filename) {
        Log.setFile(filename);
    },

    /**
     * @param {...object} obj
     */
    log(...obj) {
        console.log(obj);
        Log.log(obj);
    },

    /**
     * @param {number} millSecond
     */
    sleep(millSecond) {
        System.sleep(millSecond);
    },

    openApp() {
        let res = App.launch(tags.package);
        this.sleep(8000);
        //看看是不是主页
        let times = 3;
        while (!util.id(tags.index.intoHome[0]).isVisibleToUser(true).exists() && times-- > 0) {
            this.back();
            util.log('找不到主页，返回');
        }
        return res;
    },

    /**
     * @param {string} id 
    */
    id(id) {
        return UiSelector().id(tags.package + ':id/' + id);
    },

    /**
     * @param {string} id 
    */
    textId(id) {
        return UiSelector().id(id);
    },

    /**
     * 
     * @param {UiObject} tag 
     * @param {number} millSecond
     */
    click(tag, millSecond = undefined) {
        this.log('点击', tag);
        const x = tag.bounds().left + tag.bounds().width() * Math.random();
        const y = tag.bounds().top + tag.bounds().height() * Math.random();
        const res = Gesture.click(x, y);
        if (millSecond !== undefined) {
            this.sleep(millSecond);
        } else {
            this.sleep(2000 + 1000 * Math.random());
        }
        return res;
    },

    /**
     * 
     * @param {string} base 
     * @param {string} content 
     */
    contains(base, content) {
        const arr = base.replace(/，/g, ',').split(',');
        for (let str of arr) {
            if (content.indexOf(str) !== -1) {
                this.log('包含关键词：' + str);
                return true;
            }
        }
        return false;
    },

    /**
     * 
     * @param {number} millSecond 
     */
    back(millSecond = undefined) {
        Gesture.back();
        if (millSecond === undefined) {
            this.sleep(500);
        } else {
            this.sleep(millSecond);
        }
    },

    backApp() {
        App.backApp();
    },
}

module.exports = util;
