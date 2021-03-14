"use strict";

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

/**
 * 2019.01.20 Эксперимент. Замена  XMLHttpRequest => Fetch.
 * Использую эту функцию, чтобы исполнить на сервере PHP-код
 * Осторожно! Результат возвращается с задержкой!
 * Когда использовать runServerCode и runFetch :
 * Если от функции зависит работа следующих за ней функций - используй runServerCode,
 * если следующие функции не зависят от её результата - можно использовать runFetch.
 */
function runFetch(requestURL)
{
    let result = null;
    fetch(requestURL)
    .then(response => response.text())
    .then(response => {
        result = response;
        return result;        
    });  
}

// runFetch c колбэком
function runFetchWithCallback(requestURL,callback)
{
    fetch(requestURL)
    .then(response => response.text())
    .then(response => {
        callback(response);        
    });     
}

function checkMobility()
{
    var mobileOnly=false;

    if(mobileOnly)
    {
        //$("#open").addClass("show-for-small-only");
        document.getElementById("open").classList.add("show-for-small-only");
    }
    else
    {
        //ничего не делай
    }
}

function checkSiteStatus()
{
    var checkSiteStatus=false;
    
    if(checkSiteStatus)
    {
        var request="assets/php/getStatus.php";    
        var x=runServerCode(request);
        console.log("checkSiteStatus() : проверка ВКЛ ючена.");
        console.log("checkSiteStatus() : получил ответ от getStatus.php : "+x);

        $("#loading").hide();

        if(x=="on")
        {        
            $("#open").show();    
        }
        else
        {        
            $("#closed").show();        
        }
    }
    else
    {
        console.log("checkSiteStatus() : проверка ОТКЛ ючена.");
        $("#loading").hide();
        $("#open").show(); 
    }    
}

function useConfig()
{
    var request="assets/php/readFile.php?fileName=config.json";
    var response=JSON.parse(runServerCode(request));
    
    var siteIsOn=response.siteIsOn;
    var mobileOnly=response.mobileOnly;
    var filterIp=response.filterIp;

    console.log("useConfig(): Проверка. response.siteIsOn = "+response.siteIsOn);
    console.log("useConfig(): Проверка. response.mobileOnly = "+response.mobileOnly);
    console.log("useConfig(): Проверка. response.filterIp = "+response.filterIp);
    
    //проверка на только-мобильность
    if(mobileOnly=="true")
    {
       document.getElementById("open").classList.add("show-for-small-only");
    }

    //проверка на включенное состояние
    $("#loading").hide();//в любом случае убери надпись "Загружаю"
    if(siteIsOn=="true")
    {
        console.log("useConfig() : сайт ВКЛ ючен.");
        $("#open").show();
    }
    else
    {
        console.log("useConfig() : сайт ОТКЛ ючен.");
        $("#open").hide();//it's a hack!
        $("#closed").show(); 
    }
    //параметром filterIp занимается route.php
    //в useConfig() его обрабатывать не надо.    
}

//пометь раздел меню как выделенный
function mark(menuItemID)
{
    $("#topNav-"+menuItemID).addClass("top-menu-item-selected");
    $("#footer-"+menuItemID).addClass("footer-menu-item-selected");
}

/*
 * Вынужденный "костыль"
 * чтобы открывать JivoSite на мобильных устройствах
 * Внимание ! Требуется jQuery.
 */
$(document).ready(function(){
   
  $(".open-Jivo").click(function(){
    jivo_api.open();
  });
   
  // Для страницы best-sellers.html - ссылка "написать в чат" в низу страницы
  $("#open-Jivo-best-sellers").click(function(){
    jivo_api.open();
  });

});

//2019.01.15
function isEmpty(x)
{
    let result = false;
    switch(x)
    {
        case 0: result = true; break;
        case "": result = true; break;
        case undefined: result = true; break;
        case null: result = true; break;
    }
    return result;
}

function emptyIfUnset(x)
{
    let result="";
    if(x==null || x==undefined)
    {
        // ничего не делай
    }
    else
    {
        result = x;
    }
    return result;
}

//2019.01.15
function validateEmail(email) 
{
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

//2019.01.15 Проверка : если уже запросил прайслист на почту, то редирект на pricelistSent.html
function checkIfPricelistSent()
{
  console.log("checkIfPricelistSent() : вход.");
  let checkResult = localStorage.getItem("pricelistSentInLS");  
  console.log("checkIfPricelistSent() : checkResult ="+checkResult);
  if(checkResult == "true")
  {
    console.log("checkIfPricelistSent() : переадресация на pricelistSent.html");
    window.location.replace("pricelistSent.html");
    console.log("checkIfPricelistSent() : переадресация запрошена");
  }
  console.log("checkIfPricelistSent() : выход.");
}

/*
 * Функция возвращает промис.
 * ms - время в миллисекундах.
 * Пример использования : delay(3000).then(() => console.log('catalog.js : cart.count = '+cart.count));
 */

function delay(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

/*
 * Вызывает функцию f, после ms миллисекунд.
 */
function callAfterDelay(ms, f)
{
    delay(ms).then(() => f());
}

/*
 * Телефон валидный или нет ?
 */
function isValidPhoneNumber(inputString)
{
    let result = false;
    let onlyDigits = inputString.replace(/[^\n\d]+/g, '');

    if((onlyDigits.length==10) || (onlyDigits.length==11))
    {
        result = true;
    }
    return result;
}

/**
 * Форматирует строку в номер телефона типа "89528900209"
 * @param inputString
 * @returns {string}
 */
function formatPhoneNumber(inputString)
{
    let result = inputString;

    const onlyDigits = inputString.replace(/[^\n\d]+/g, ''); // удали всё, оставь только цифры

    result = onlyDigits;

    const char1 = onlyDigits.charAt(0);
    const char2 = onlyDigits.charAt(1);

    if((onlyDigits.length === 10) && (char1 === '9'))
    {
        result = '8'+ onlyDigits;
    }
    if((onlyDigits.length === 11) && (char2 === '9'))
    {
        result = '8'+ onlyDigits.substring(1,11);
    }

    return result;
}

/**
 * 1. Проверяет : телефон валидный ?
 * 2. Форматирует строку в номер телефона типа "89528900209"
 * @param inputString
 * @returns {{valid: boolean, phone: string}}
 * @constructor
 */
function PhoneNumber(inputString)
{
    let valid = false; // номер телефона валидный
    let phone = inputString; // отформатированный номер телефона

    const onlyDigits = inputString.replace(/[^\n\d]+/g, ''); // удали всё, оставь только цифры

    phone = onlyDigits;

    const char1 = onlyDigits.charAt(0);
    const char2 = onlyDigits.charAt(1);

    if((onlyDigits.length === 10) && (char1 === '9'))
    {
        valid = true;
        phone = '8'+ onlyDigits;
    }
    if((onlyDigits.length === 11) && (char2 === '9'))
    {
        valid = true;
        phone = '8'+ onlyDigits.substring(1,11);
    }

    return {
        'valid':valid,
        'formatted':phone
    };
}

/*
 * Время на клиентской машине.
 */
function getUserTime()
{
    let now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    return hours + ':' + minutes;
}


//Проверка : если уже заказал обратный звонок, то редирект на sent.html
function redirectIfRequestSubmitted()
{
    console.log("redirectIfRequestSubmitted() : вход.");
    let checkResult = JSON.parse(localStorage.getItem("requestSubmitted"));
    if(checkResult === true && settings.zastavka_after_callback)
    {
        window.location.replace("sent.html");
    }
    console.log("redirectIfRequestSubmitted() : выход.");
}
