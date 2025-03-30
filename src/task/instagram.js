const ins = require('../instagram/core');

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

ins.run(config, 0);
