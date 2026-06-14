function getDate() {
    let now = new Date();
    return now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0') + '-' + String(now.getDate()).padStart(2, '0');
}
function run() {
    FloatDialogs.toast('开始执行任务');
    if (Storage.getBoolean('toker_sound')) {
        // Audio.playAndRelease(DeekeScript.getProjectRoot() + '/music/music.mp3');
    }
    Log.setFile('log.log');

    Gesture.press(Device.width() / 2, Device.height() / 2, 100);
    System.sleep(300 + 100 * Math.random());
    
    let onlineTabTag = UiSelector().className('android.widget.TextView').filter(v => {
        return v.text() && v.text().indexOf('线上问诊') == 0;
    }).isVisibleToUser(true).findOne();

    let buyTabTag = UiSelector().className('android.widget.TextView').filter(v => {
        return v.text() && v.text().indexOf('购药问诊') == 0;
    }).isVisibleToUser(true).findOne();


    while (true) {
        Gesture.pressQuick(buyTabTag.bounds().centerX(), buyTabTag.bounds().centerY(), 10 + 10 * Math.random());
        System.sleep(300);
        let orderTag = UiSelector().isVisibleToUser(true).filter(v => {
            return v.text() && v.text().indexOf('病情描述') != -1;
        }).findOne();

        if (orderTag) {
            Log.log(orderTag.text());
            Gesture.pressQuick(orderTag.bounds().centerX(), orderTag.bounds().centerY(), 10 + 10 * Math.random());
            System.sleep(Storage.getInteger('toker_order_wait_time'));
            if (!UiSelector().className('android.widget.TextView').filter(v => {
                return v.text() && v.text().indexOf('购药问诊') == 0;
            }).isVisibleToUser(true).findOne()) {
                Log.log('break');
                let count = Storage.getInteger('task_' + getDate()) || 0;
                FloatDialogs.show('提示', '今日已成功执行' + count + '次任务');
                if (Storage.getBoolean('toker_sound')) {
                    Audio.playAndRelease(DeekeScript.getProjectRoot() + '/music/music.mp3');
                }

                Storage.putInteger('task_' + getDate(), count + 1);
                break;
            }
        }

        Gesture.pressQuick(onlineTabTag.bounds().centerX(), onlineTabTag.bounds().centerY(), 10 + 10 * Math.random());
        System.sleep(Storage.getInteger('toker_refresh_time'));
    }
}

run();

// Audio.playAndRelease(DeekeScript.getProjectRoot() + '/music/music.mp3');

