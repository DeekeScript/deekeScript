function n() {
    console.log("任务1");
}

function e(n) {
    console.log("任务2", "i=" + n);
}

let o = 0, a = (setInterval(function() {
    n(), o++;
}, 1e3), {
    run: function() {
        for (;;) e(o), System.sleep(3e3);
    }
}), l = new java.lang.Thread(new java.lang.Runnable(a));

l.start();