const instagram = require('../instagram/instagram');
const util = require('../instagram/util');

const task = {
    /**
     * @param {number} type
     * @param {string} msg
     */
    getMsg(type, msg) {
        util.log('对方的消息是：' + type + ":" + msg);
        if (type == 0) {
            return 'hi, 😄';//0评论，1私信
        }

        return 'hello, 😄';
    },


    /**
     * @param {{ ai_back_comment_run_other_fun: number; //0不选择，1推荐营销
    ai_back_comment_switch: boolean; //评论回复
    ai_back_friend_private_switch: boolean; //私信回复（不包含陌生人）
    ai_back_minitue: number; }} config
     */
    run(config) {
        instagram.aiBack(config, this.getMsg);
    }
}

const config = {
    ai_back_comment_run_other_fun: 1,//0不选择，1推荐营销，2同城营销
    ai_back_comment_switch: true,//评论回复
    ai_back_friend_private_switch: true,//私信回复（不包含陌生人）
    ai_back_private_switch: true,//陌生人私信回复
    ai_back_minitue: 1, //AI回复间隔（分钟）
}

while (true) {
    try {
        Log.setFile('instagram_ai_back.log');
        util.openApp();
        task.run(config);
        util.log('开始休眠');
    } catch (e) {
        util.log('全局异常');
        util.log(e.stack);
    }

    util.back(500 + 500 * Math.random());
    util.back(500 + 500 * Math.random());
    util.sleep(3000);//休眠10秒
    util.backApp();
    util.sleep(5000);//休眠10秒

    util.log('开始执行核心功能');
    if (config.ai_back_comment_run_other_fun == 0) {
        util.sleep(config.ai_back_minitue * 60 * 1000);
        continue;
    }

    let endTime = Date.parse(new Date().toString()) / 1000 + config.ai_back_minitue * 60;
    let file = ['src/task/instagram.js', 'instagram_city.js'][config.ai_back_comment_run_other_fun - 1];
    util.log('开始执行');
    Engines.executeScript(file);
    util.log('执行过了');
    do {
        util.log('时间判断', Date.parse(new Date().toString()) / 1000, endTime);
        if (Date.parse(new Date().toString()) / 1000 >= endTime) {
            Engines.closeOther();//关闭其他线程
            util.log('中断其他线程');
            util.backApp();
            break;
        }
        util.log('开始判断');
        util.sleep(60 * 1000);//一分钟后判断
    } while (true);
    util.log('又开始执行了');
}
