
let common = {
    openApp() {
        App.launch('com.ss.android.ugc.aweme');//打开抖音
        System.sleep(8000);
    },

    id(idName){
        return UiSelector().id('com.ss.android.ugc.aweme:id/' + idName);
    }
}

module.exports = common;