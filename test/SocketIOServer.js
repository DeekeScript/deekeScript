const { Server } = require("socket.io");
const readline = require("readline");

const io = new Server("3000", {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log(`客户端已连接: ${socket.id}`);

  socket.on("message", (data) => {
    console.log("收到客户端消息:", data);
    console.log(data.name);
    socket.emit("message", data);
  });

  socket.on("disconnect", () => {
    console.log(`客户端断开连接: ${socket.id}`);
  });
});

console.log("Socket.IO 服务启动，监听端口 3000");

// 创建命令行接口，监听输入
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  prompt: '请输入服务器消息> '
});

rl.prompt();

rl.on('line', (line) => {
  const msg = line.trim();
  if(msg.length > 0) {
    // 给所有客户端广播 message 事件
    io.emit('message', msg);
    if(msg === '333'){
      io.emit('getAccountInfo', msg);
    }
    console.log(`已广播消息: ${msg}`);
  }
  rl.prompt();
}).on('close', () => {
  console.log('服务器输入关闭，退出程序');
  process.exit(0);
});
