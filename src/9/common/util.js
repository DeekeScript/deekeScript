let util = {
    setLog(file) {
        Log.setFile(file);
    },
    log() {
        Log.log(arguments);
        console.log(arguments);
    },

    click(tag) {
        this.log('点击了控件：', tag);
        Gesture.click(tag.bounds().left + Math.random() * tag.bounds().width(), tag.bounds().top + Math.random() * tag.bounds().height());
    },

    input(tag, text) {
        tag.setText(text);
    },

    swipe() {
        let bottom = Device.height() * (0.6 + Math.random() * 0.2);
        let top = Device.height() * (0.2 + Math.random() * 0.2);
        let left = Math.random() * Device.width() * 0.6 + Device.width() * 0.2;

        Gesture.swipe(left, bottom, left + Device.width() * 0.1, top, 200 + 100 * Math.random());
    }
}

module.exports = util;
