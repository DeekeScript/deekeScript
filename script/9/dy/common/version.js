let e;

(e = 310701 == App.getAppVersionCode("com.ss.android.ugc.aweme") ? require("../version/310701.js") : e) || (FloatDialogs.show("当前版本不支持"), 
System.exit()), module.exports = e;