

let a = java.lang.System.currentTimeMillis();
console.log(a);



//请开始编写DeekeScript代码吧~

try {
    let scopImages = "23423.txt";
    let url = "http://127.0.0.1:8000/dke/test";
    let Files = [new java.io.File(scopImages)];
    let params = {};
    Http.postFile(url, Files, params, {   //回调函数
        success: (response) => {
            //处理逻辑
            let js = response.json();
            console.log('返回内容：', js);
        },
        fail: (response) => {
            //失败逻辑
            console.log('失败', response);
        }
    });
} catch (e) {
    console.log(e);
}
