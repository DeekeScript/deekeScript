
let close = false;
ForegroundServiceBridge.setContent('测试', '前台服务');
ForegroundServiceBridge.register(()=>{
    console.log('前台服务启动成功');
    let m = setInterval(() => {
        console.log('正在执行任务...');
        if(close){
            clearInterval(m);
        }
    }, 3000);
});

ForegroundServiceBridge.startService();

let i = 0;
setInterval(() => {
    console.log('正在监听中...');
    if(i++ >= 1){
        ForegroundServiceBridge.stopService();
        close = true;
    }
}, 10000);
