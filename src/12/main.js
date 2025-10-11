
let res = {
    code: 0,
    data: {
        action: 'task'
    }
};

let index = 0;

setInterval(function () {
    index++;
    if (index > 5) {
        console.log('关闭通知');
        res.data.action = 'exit';
    }

    if (index > 6) {
        res.data.action = "";
    }

    if (res.code == 0 && res.data.action != "") {
        let taskName = res.data.action;
        if (taskName == 'exit') {
            console.log('关闭除了当前脚本外的其他脚本');
            Engines.closeOther();
            return;
        }

        if (Engines.childScriptCount() > 0) {
            console.log('正在运行中');
            return;
        }

        console.log('开始执行任务：' + taskName + ".js");
        Engines.executeScript("./" + taskName + ".js");
    }

    // Http.get("xxx.com/heard?isRunning=" + (Engines.childScriptCount() > 0 ? true : false));
}, 3000);
