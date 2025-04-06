const instagram = require('../instagram/instagram');
const util = require('../instagram/util');

const task = {
    /**
     * @param {number} type
     */
    getMsg(type) {
        if (type == 0) {
            return '视频拍的很好';//0评论，1私信
        }

        return 'hello, 😄';
    },

    /**
     * @param {{ toker_view_video_second: number; //视频观看时间
    toker_view_video_keywords: string; //关键词
    toker_zan_rate: number; //点赞频率
    toker_comment_rate: number; //评论频率
    toker_focus_rate: number; //关注频率
    toker_private_msg_rate: number; //私信频率
    toker_comment_area_zan_rate: number; //评论区五连赞
    toker_run_hour: number[]; }} config
     */
    run(config) {
        instagram.run(config, this.getMsg);
    },
}

const config = {
    toker_view_video_second: 5,//视频观看时间
    toker_view_video_keywords: 'she,the,me,just,time,and,me,live,baby,you,that,this,simple,it', //关键词
    toker_zan_rate: 50, //点赞频率
    toker_comment_rate: 50, //评论频率
    toker_focus_rate: 20, //关注频率
    toker_private_msg_rate: 20, //私信频率
    toker_comment_area_zan_rate: 50, //评论区五连赞
    toker_run_hour: [0, 1, 21, 22, 23], //运行时间 
}

Log.setFile('instagram_city.log');
while (true) {
    try {
        util.log(config);
        util.openApp();
        if (!config.toker_run_hour.includes(new Date().getHours())) {
            util.backApp();
            util.log('回到app');
            util.sleep(60 * 1000);//休眠一分钟
            continue;
        }

        task.intoCity();
        task.run(config);
    } catch (e) {
        util.log("异常了：", e.stack);
        util.sleep(3000);
    }
}
