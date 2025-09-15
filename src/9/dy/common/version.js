let ids;

if (App.getAppVersionCode('com.ss.android.ugc.aweme') == 310701) {
    ids = require('../version/310701.js');
}

if (!ids) {
    FloatDialogs.show('当前版本不支持');
    System.exit();
}

module.exports = ids;