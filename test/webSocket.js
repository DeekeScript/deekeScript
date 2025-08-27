
WebSocket.closeAll();
let client = new WebSocket('ws://127.0.0.1:8000');
client.onClose = function(){

}


client.onMessage = function(msg){

}

client.onOpen = function(){

}

client.onError = function(errorMsg){

}

client.send('消息');
client.close();
