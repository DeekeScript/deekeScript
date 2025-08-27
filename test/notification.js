
let root = Access.hasNotificationAccess();

console.log('是否有通知读取权限', root);

if (!root) {
    Access.requestNotificationAccess();
    System.exit();
}

NotificationBridge.startService();
NotificationBridge.startListening((packageName, title, text) => {
    console.log('收到通知', packageName, title, text);
    if(text == '关闭'){
        NotificationBridge.stopService();
    }
}, (packageName, title, text) => {
    console.log('通知监听已关闭', packageName, title, text);

});

NotificationBridge.startService();

setInterval(() => {
    console.log('正在监听中...');
}, 10000);
