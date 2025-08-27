

// let promise = new Promise(function (resolve, reject) {
//     setTimeout(function () {
//         console.log(Device.height());
//         resolve('成功');
//     }, 1000);
// }).then(resolve => {
//     console.log(resolve);//成功
// }, reject => {
//     console.log(reject);
// });
let thread;
try {
    thread = new java.lang.Thread(new java.lang.Runnable(function () {
        for (let j = 0; j < 100; j++) {
            console.log(j);
        }
    }));
    thread.start();
} catch (e) {
    console.log(e);
}

for (let i = 0; i < 100; i++) {
    console.log('main:' + i);
}
console.log('休眠后');
// System.sleep(2000);
