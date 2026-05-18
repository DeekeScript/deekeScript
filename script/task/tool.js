let myTask = {
    intoApp() {
        //打开并进入App
    },

    backApp() {
        //退出当前App
    },

    task(){
        //任务代码
    },

    run() {
        FloatDialogs.show('提示', '请编写业务代码');
    }
}

myTask.run();
