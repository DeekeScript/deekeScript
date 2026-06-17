let storage = {
    getToken() {
        return Storage.get("token");
    },

    getPackage() {
        return Storage.get("package");
    },

    getMachineType() {
        return 1;
    },

    getSpeech() {
        let data = Storage.get('deekeScript:speech:default');
        console.log("speech内容");
        console.log(data);
        if (!data) {
            return [];
        }

        data = JSON.parse(data);
        let list = data && data.speechLists;
        if (!list) return [];
        // 保证每条话术带启用状态（老数据无 enabled 时视为启用）
        let res = [];
        for (let i in list) {
            if (list[i].enabled !== false) {
                res.push(list[i]);
            }
        }
        return res;
    },

    //尽量 文件名 + key的模式
    get(key, type) {
        if (type == undefined) {
            type = "string"
        }
        Log.log("key:" + key + ":type:" + type);
        if (type == "string") {
            return Storage.get(key);
        } else if (type == 'int') {
            return Storage.getInteger(key);
        } else if (type == 'float') {
            return Storage.getDouble(key);
        } else if (type == 'object') {
            return Storage.getObj(key);
        } else if (type == 'bool') {
            return Storage.getBoolean(key);
        }

        return undefined;
    },

    getArray(key) {
        return Storage.getArray(key);
    },

    isFloat(num) {
        return num % 1 !== 0;
    },

    //尽量 文件名 + key的模式
    set(key, value) {
        if (typeof value == 'string') {
            Storage.put(key, value);
        } else if (typeof value == 'boolean') {
            Storage.putBoolean(key, value);
        } else if (typeof value == 'object') {
            Storage.putDouble(key, value);
        } else if (typeof value == 'undefined' || value == null) {
            Storage.putObj(key, value);
        } else if (Number.isInteger(value)) {
            Storage.putInteger(key, value);
        } else if (this.isFloat(value)) {
            Storage.putDouble(key, value);
        } else {
            Storage.putObj(key, value);
        }
        return true;
    },
}

module.exports = storage;
