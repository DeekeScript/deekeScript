let storage = require('./storage.js');
let machine = {
    db() {
        return Storage;
    },

    clear() {
        this.db().clear();
        System.toast('成功');
    },

    getDate() {
        let d = new Date();
        return d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
    },



    getMsg(type) {
        let speechs = storage.getSpeech();
        if (speechs.length === 0) {
            return undefined;
        }

        let tmp = [];
        //let types = ["评\n论", "私\n信"];
        //type 为0 则是评论，为1是私信
        for (let i in speechs) {
            if (speechs[i]['type'] === type) {
                tmp.push(speechs[i].content);
            }
        }

        if (tmp.length === 0) {
            return undefined;
        }

        let rd = Math.round(Math.random() * (tmp.length - 1));
        return tmp[rd];
    },
    //尽量 文件名 + key的模式
    get(key, type) {
        if (type == undefined) {
            type = "string";
        }
        let db = this.db();
        Log.log("key:" + key + ":type:" + type);
        if (type == "string") {
            return db.get(key);
        } else if (type == 'int') {
            return db.getInteger(key);
        } else if (type == 'float') {
            return db.getDouble(key);
        } else if (type == 'object') {
            return db.getObj(key);
        } else if (type == 'bool') {
            return db.getBoolean(key);
        }

        return undefined;
    },

    getArray(key) {
        let db = this.db();
        return db.getArray(key);
    },

    //尽量 文件名 + key的模式
    set(key, value) {
        let db = this.db();
        if (typeof value == 'string') {
            db.put(key, value);
        } else if (typeof value == 'boolean') {
            db.putBoolean(key, value);
        } else if (typeof value == 'object') {
            db.putDouble(key, value);
        } else if (typeof value == 'undefined' || typeof value == 'null') {
            db.putObj(key, value);
        } else if (Number.isInteger(value)) {
            db.putInteger(key, value);
        } else if (typeof value == 'number') {
            db.putDouble(key, value);
        } else {
            db.putObj(key, value);
        }

        return true;
    }
};

module.exports = machine;
