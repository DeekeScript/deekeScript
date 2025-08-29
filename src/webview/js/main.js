
function btn_func(_this) {
    let json = {
        name: "DeekeScript",
        age: 2,
    }

    DeekeScriptWebView.run("src/task/webview.js", JSON.stringify(json));
}
