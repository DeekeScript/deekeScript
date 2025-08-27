

// let res = Http.getHeaders("https://home.deeke.top/dkee/config", { "content-type": "json" });
// console.log(res);


//文件上传测试
let filenames = Images.capture();
Http.postFile("https://home.deeke.top/dke/login", [new java.io.File(filenames)], {
    "name": "file",
}, {
    success(res) {
        console.log(res.body().string());
    },

    fail(res) {
        console.log("上传失败");
    }
});
