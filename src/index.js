//这个文件不用编写代码
let Common = require('./util/dy/Common.js');
function a() {
    let iptTag = UiSelector().className('android.widget.EditText').filter(v => {
        return v.isEditable();
    }).isVisibleToUser(true).findOne();
    if (!iptTag) {
        console.log("没有找到发送私信输入框");
        return false;
    }

    Common.click(iptTag, 0.2);
    Common.sleep(1000 + 1000 * Math.random());

    iptTag = UiSelector().className('android.widget.EditText').filter(v => {
        // @ts-ignore
        return v.isEditable() && v.isFocused();
    }).isVisibleToUser(true).findOne();
    if (!iptTag) {
        console.log('没有找到点击后的输入框');
        return true;
    }
}

// let moreTag = UiSelector().descContains('更多').filter(v => {
//     // @ts-ignore
//     return v.desc() == '更多' && v.getHintText() == '按钮' && v.bounds().top < Device.height() / 4;
// }).isVisibleToUser(true).findOne();

// console.log(moreTag);
// Common.click(moreTag, 0.2);


// let containerTag = UiSelector().className('android.widget.FrameLayout').filter(v => {
//     return !!v.desc() && (v.desc().indexOf('笔记') == 0 || v.desc().indexOf('视频') == 0);
// }).isVisibleToUser(true).findOne();


// console.log(containerTag);

// let iptTag = UiSelector().className('android.widget.EditText').filter(v => {
//     // @ts-ignore
//     return v.isEditable() && v.isFocused();
// }).isVisibleToUser(true).findOne();

// let btnTag = UiSelector().className('android.widget.TextView').text('发送').filter(v => {
//     return v.bounds().top + v.bounds().height() > iptTag.bounds().top;
// }).clickable(true).isVisibleToUser(true).findOne();

// console.log(btnTag);

// let nicknameTag = UiSelector().descContains('作者').isVisibleToUser(true).findOne();
// console.log(nicknameTag);

let iptTag = UiSelector().className('android.widget.EditText').isVisibleToUser(true).filter(v => {
    return v.isEditable();
}).findOne();

console.log(iptTag);
