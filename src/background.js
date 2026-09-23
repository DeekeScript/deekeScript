

FloatDialogs.toast('开始退到后台');

Gesture.home();

let k = 30;

for (let i = 0; i < k; i++) {
    System.sleep(1000);
    FloatDialogs.toast('第几秒' + i);
}

FloatDialogs.toast('开始执行任务');

let res = Http.get('https://baidu.com', {});

FloatDialogs.toast(res);
console.log(res);

FloatDialogs.toast('任务执行完毕');
