let e = {
    setLog(e) {
        Log.setFile(e);
    },
    log() {
        Log.log(arguments), console.log(arguments);
    },
    click(e) {
        this.log("点击了控件：", e), Gesture.click(e.bounds().left + Math.random() * e.bounds().width(), e.bounds().top + Math.random() * e.bounds().height());
    },
    input(e, t) {
        e.setText(t);
    },
    swipe() {
        var e = Device.height() * (.6 + .2 * Math.random()), t = Device.height() * (.2 + .2 * Math.random()), o = Math.random() * Device.width() * .6 + .2 * Device.width();
        Gesture.swipe(o, e, o + .1 * Device.width(), t, 200 + 100 * Math.random());
    }
};

module.exports = e;