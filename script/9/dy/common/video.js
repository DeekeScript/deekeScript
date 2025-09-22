let i = require("../../common/util"), r = require("./common"), o = require("./version"), e = {
    zan() {
        var e = r.id(o.video.zan).isVisibleToUser(!0).findOne();
        e && i.click(e);
    }
};

module.exports = e;