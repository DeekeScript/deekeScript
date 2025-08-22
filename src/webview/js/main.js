
function btn_func(_this) {
    let json = {
        name: "DeekeScript",
        age: 2,
    }

    DeekeScriptWebView.run((json) => {
        console.log(json);
        console.log(json.name);
    }, json);
}
