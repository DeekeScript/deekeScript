let util = require('../../common/util');
let common = require('../../dy/common/common');
let video = require('../../dy/common/video');

let task = {
    exec(){
        common.openApp();
        video.zan();
    }
}


task.exec();
