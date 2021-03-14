/*
  Передача запроса на сервер с использованием Ajax.
  Внимание! Требует инициализации jQuery.
  Пример:
  sendRequestToServer("php/summationScript.php?x=300&y=200","#calculatedSum");
  В папке php, есть скрипт summationScript.php.
  В этом скрипте есть 2 переменные x и у.
  Мы передаём значения 300 и 200 этим переменным в скрипте, он делает манипуляции,
  например складывает и возвращает ответ в тэг с id="calculatedSum"
*/
"use strict";
function sendRequestToServer(requestURL,responseTag)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            $(responseTag).html(this.responseText);
        }
    };

    xmlhttp.open("GET", requestURL, true);
    xmlhttp.send();
}

//получение данных из PHP скрипта (или иного кода на стороне сервера через AJAX)
function runServerCode(requestURL)
{
  var result=null;
  var xmlhttp = new XMLHttpRequest();    
  
  xmlhttp.onreadystatechange = function()
  {
      
      if (this.readyState == 4 && this.status == 200)
      {
          result=this.responseText;            
      }
  };   
  xmlhttp.open("GET", requestURL, false);
  xmlhttp.send();    
  return result;
}
// 19.04.2018 новая функция
// передаёшь запрос на сервер и колбэк-функцию, которая исполнится после получения ответа с сервера
function runServerCodeAsync(requestURL,callback)
{   
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function()
    {
        if (this.readyState == 4 && this.status == 200)
        {
            callback(this.responseText);
        }
    };
    xmlhttp.open("GET", requestURL, true);
    xmlhttp.send();
}