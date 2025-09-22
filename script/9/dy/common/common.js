let e = {
    openApp() {
        App.launch("com.ss.android.ugc.aweme"), System.sleep(8e3);
    },
    id(e) {
        return UiSelector().id("com.ss.android.ugc.aweme:id/" + e);
    }
};

module.exports = e;