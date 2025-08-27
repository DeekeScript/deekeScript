let socketIoClient = SocketIoClient.getInstance("http://192.168.0.111:3000");

socketIoClient.on("connect_error", (error) => {
    console.error("连接错误:", error);
});

socketIoClient.on("error", (error) => {
    console.error("通用错误:", error);
});

socketIoClient.on("connect_timeout", () => {
    console.error("连接超时");
});


socketIoClient.on("connect", function () {
    console.log('是否连接成功：', socketIoClient.isConnected());
    socketIoClient.on("message", function (data) {
        console.log('服务端发来的消息：', data);
    });

    let str = JSON.stringify({
        name: "DeekeScript",
        age: 3,
        other: {
            sex: ["男"]
        }
    });
    socketIoClient.emit("message", str, function (data) {
        console.log('确认参数', data);
    });
});

socketIoClient.connect();

while (true) {
    System.sleep(1000);
    console.log('防止脚本终止');
}
