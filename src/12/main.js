
let res = {
    code: 0,
    data: {
        action: 'task'
    }
};

let index = 0;

setInterval(function () {
    index++;
    if (index > 10) {
        console.log('关闭通知');
        res.data.action = 'exit';
    }

    if (res.code == 0) {
        let taskName = res.data.action;
        if (taskName == 'exit') {
            console.log('关闭除了当前脚本外的其他脚本');
            Engines.closeOther();
            return;
        }

        if (Engines.childScriptCount() == 1) {
            console.log('正在运行中');
            return;
        }

        console.log('开始执行任务：' + taskName + ".js");
        Engines.executeScript("./" + taskName + ".js");
    }
}, 3000);
