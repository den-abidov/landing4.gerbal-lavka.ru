$(document).ready(function(){

  let currentPage=getPageName(); // текущая страница

  let name="";
  let comment="";
  let allNeededDataGiven=true;

  //слушай события

  //клик в область поля
  $("#name-input").click(function(){
    $("#name-input").removeClass("emptyWarning");
    $("#name-input-warning").hide();
  });

  //нажатие на кнопку 'Добавить'
  $("#submit").click(function(){
    console.log("Нажал на кнопку 'Добавить комментарий'.");
    name=$("#name-input").val();
    if(isEmpty(name))
    {
      allNeededDataGiven=false;
      $("#name-input").addClass("emptyWarning");
      $("#name-input-warning").slideDown();
    }
    comment=$("#comment-input").val();

    console.log("Все данные проверены. Всё в порядке ? "+allNeededDataGiven);
    
    if(allNeededDataGiven)
    {
      console.log("Все данные в порядке.");
      //собери сообщение
      let message=`<h3><u>Комментарий от посетителя</u></h3>
                  <p>Страница : ${currentPage}</p>
                  <p>Имя посетителя : ${name}</p>
                  <p>Комментарий    : ${comment}</p>`;
      //Конвертируй (encode) символ "<" в %3C  - иначе Google Chrome выдаст ошибку безопасности
      message=message.replace(/</g,"%3C");
      //console.log("Свёрстанное сообщение : "+message);
      console.log("Все данные предоставлены. Сейчас их отправим.");
      $("#spinner-icon").show();
      let request=`assets/php/sendMeUserComment.php?message=${message}`;
      let callback=function(serverResponse){
        console.log("получен serverResponse = "+serverResponse);
        if(serverResponse=="success") 
        {
          $("#spinner-icon").hide();
          $("#success").slideDown(); 
        }
        else
        {
          $("#spinner-icon").hide();
          $("#failure").slideDown(); 
        }
      };
      //выполни инструкции
      runServerCodeAsync(request,callback);
      //emulateServerCall(request,callback);

            //присвой имя и телефон объекту user{} и сохрани этот объект в Local Storage
            let user = JSON.parse(localStorage.getItem("userInLS"));
            if(user == null) // объект попросту ещё не был создан
            {
              user = { name:name, phone:phone,  email:"" };
            }
            else{  user.name = name; user.phone = phone; }
            localStorage.setItem("userInLS", JSON.stringify(user));

      //Отправка тех.сообщения
      //php-скрипт не понимает значения в `...` и не отправляет сообщение, поэтому вынужден использовать "..."
      let techMessage="<p>Имя посетителя : "+name+"</p><p>Его телефон    : "+phone+"</p><p>Откуда он(а)   : "+place+"</p><p>Комментарий    : "+comment+"</p>";  
      reportTelemetry("комментарий",techMessage);
    }

  });

//Вспомогательные функции
function emulateServerCall(request, callback)
{
  let serverResponse="success";
  setTimeout(2000, callback(serverResponse)); 
}
function isEmpty(x)
{
  let result=false;
  if(x==null || x==undefined || x=="" || x==0) result=true;
  return result;
}

});

function setPageName(pageName)
{
  localStorage.setItem("currentPageInLS","продуктовая страница - "+pageName);
}
function getPageName()
{
  return localStorage.getItem("currentPageInLS");
}

