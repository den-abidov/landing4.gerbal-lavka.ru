$(document).ready(function(){

  mark("dostavka");
  
  //сверни развёрнутый ответ
  $(".hide-link").click(function(){
    $(".answer").css("display","none");
  });

  //де-активируй ссылку
  $("#dostavka-link").removeAttr("href");
  $("#dostavka-link").addClass("inactive");
 
});
