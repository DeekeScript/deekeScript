
//请开始编写DeekeScript代码吧~

function taskOne(){
  console.log('任务1');
}

function taskTwo(i){
  console.log('任务2', "i="+i);
}

/**
Engines.executeScriptStr("engines", "console.log('开始');System.sleep(5000);console.log('完成');");
*/

let i = 0;
setInterval(function(){
  taskOne();
  i++;
}, 1000);

let obj = {
  run: function () {
    while(true){
      taskTwo(i);
      System.sleep(3000);
    }
  } 
}

let thread = new java.lang.Thread(new java.lang.Runnable(obj))
thread.start();




