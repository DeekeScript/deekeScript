
function test() {
    let script = "let a = 12;console.log(a);System.sleep(3000);console.log(a);System.sleep(3000);console.log(a);";
    Engines.executeScriptStr(script);
}

// test();

// console.log(1);
// for(let i = 0;i<1000;i++){
//     //
// }
// System.sleep(5000);
// console.log(2);

function test1() {
    console.log("任务开始");
    setTimeout(() => {
        console.log("延时3秒执行完成");
    }, 3000);

    // @ts-ignore
    let i = 0;
    // @ts-ignore
    let timer = setInterval(() => {
        if (i >= 3) {
            clearInterval(timer);
            return;
        }
        console.log("每3秒执行一次：" + i++);
    }, 3000);

    console.log('任务结束');
}

// test1();

function test2() {
    let script = "let a = 12;console.log(a);System.sleep(3000);setTimeout(()=>console.log(22), 3000);console.log(a);";
    Engines.executeScriptStr(script);
    setTimeout(() => {
        console.log("延时3秒执行完成");
    }, 3000);
}
// test2();

let timerIndex;
function test3() {
    let obj = {
        run: function () {
            console.log('线程');
            timerIndex = setInterval(() => {
                for (let i = 0; i <= 5; i++) {
                    console.log('延时3秒执行完成');
                }
            }, 3000);
        }
    }

    let thread = new java.lang.Thread(new java.lang.Runnable(obj));

    thread.start();
    thread.join();
    console.log('主线程');

    // setTimeout(() => {
    //     console.log("main-延时3秒执行完成", timerIndex);
    //     clearInterval(timerIndex);
    // }, 12000);
}

test3();
