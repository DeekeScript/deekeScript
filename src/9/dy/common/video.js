let util = require('../../common/util');
let common = require('./common');
let ids = require('./version');

let video = {
    zan(){
        let zanTag = common.id(ids.video.zan).isVisibleToUser(true).findOne();
        if(zanTag){
            util.click(zanTag);
        }
    }
}

module.exports = video;
